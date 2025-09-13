"use server"

import * as cheerio from "cheerio"

const FETCH_TIMEOUT = 8000 // ms
const USER_AGENT = "metadata-fetcher/1.0 (+https://example.com)"

// Optional: whitelist to reduce SSRF risk (set to null to allow all)
const HOST_WHITELIST: string[] | null = null // e.g. ["example.com", "youtube.com"]

export type MetaResult = {
  title?: string
  description?: string
  image?: string // best image / og:image / twitter:image
  icon?: string // favicon / apple-touch-icon / mask-icon
  site?: string // og:site_name or hostname
  url: string // normalized target url
}

function timeoutFetch(resource: RequestInfo, options: RequestInit = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  return fetch(resource, { ...options, signal: controller.signal }).finally(
    () => clearTimeout(id),
  )
}

function absoluteUrl(
  base: string,
  maybeRelative?: string | null,
): string | undefined {
  if (!maybeRelative) return undefined
  try {
    return new URL(maybeRelative, base).toString()
  } catch {
    return undefined
  }
}

function chooseBestImage(images: (string | undefined)[]): string | undefined {
  for (const img of images) {
    if (img) return img
  }
  return undefined
}

export async function fetchMetadata(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
      return { error: "URL must be http(s)" }
  } catch {
    return { error: "Invalid URL" }
  }

  if (HOST_WHITELIST) {
    const host = parsed.hostname.replace(/^www\./, "")
    const allowed = HOST_WHITELIST.some(
      (h) => host === h || host.endsWith("." + h),
    )
    if (!allowed) return { error: "Domain not allowed" }
  }

  // Fetch page HTML
  let html: string
  try {
    const res = await timeoutFetch(parsed.toString(), {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    })
    if (!res.ok) return { error: `Fetch failed: ${res.status}` }
    html = await res.text()
  } catch (e: any) {
    if (e?.name === "AbortError") return { error: "Fetch timed out" }
    return { error: "Network error" }
  }

  // Parse
  const $ = cheerio.load(html)

  const getMeta = (prop: string) =>
    $(`meta[property="${prop}"]`).attr("content") ||
    $(`meta[name="${prop}"]`).attr("content") ||
    undefined

  const title =
    (
      $("title").first().text() ||
      getMeta("og:title") ||
      getMeta("twitter:title") ||
      undefined
    )?.trim() || undefined

  const description =
    (
      getMeta("og:description") ||
      getMeta("description") ||
      getMeta("twitter:description")
    )?.trim() || undefined

  // Candidate images (ordered by preference)
  const ogImage = getMeta("og:image")
  const twitterImage = getMeta("twitter:image")
  // Parse link rel images (apple-touch-icon, icon, shortcut icon, mask-icon)
  const relImages: string[] = []
  $("link[rel]").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase()
    const href = $(el).attr("href")
    if (!href) return
    if (rel.includes("icon") || rel.includes("apple-touch-icon"))
      relImages.push(href)
  })

  // Also try to discover large images from og:image:secure_url and multiple og:image tags
  const extraOgImages: string[] = []
  $('meta[property^="og:image"]').each((_, el) => {
    const v = $(el).attr("content")
    if (v) extraOgImages.push(v)
  })

  const candidateImgs = [ogImage, ...extraOgImages, twitterImage, ...relImages]

  const image = chooseBestImage(
    candidateImgs.map((i) => absoluteUrl(parsed.toString(), i)),
  )

  // Choose icon separately (prefer apple-touch-icon, mask-icon, then favicon)
  let icon: string | undefined
  // prefer common icon rels in order
  const preferredIconRels = [
    "apple-touch-icon",
    "apple-touch-icon-precomposed",
    "mask-icon",
    "icon",
    "shortcut icon",
  ]
  for (const relName of preferredIconRels) {
    const el = $(`link[rel="${relName}"]`).first()
    if (el && el.attr("href")) {
      icon = absoluteUrl(parsed.toString(), el.attr("href"))
      if (icon) break
    }
  }
  // fallback: try any link rel containing icon
  if (!icon) {
    $("link[rel]").each((_, el) => {
      const rel = ($(el).attr("rel") || "").toLowerCase()
      if (!icon && rel.includes("icon") && $(el).attr("href")) {
        icon = absoluteUrl(parsed.toString(), $(el).attr("href"))
      }
    })
  }
  // fallback to /favicon.ico
  if (!icon) {
    icon = absoluteUrl(parsed.toString(), "/favicon.ico")
  }

  const site = getMeta("og:site_name") || parsed.hostname

  const result: MetaResult = {
    url: parsed.toString(),
    title,
    description,
    image,
    icon,
    site,
  }

  return { data: result }
}
