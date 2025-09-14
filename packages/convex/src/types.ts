export type Metadata = {
  title?: string
  description?: string
  image?: string
  icon?: string
  site?: string
  url: string
}

export type InferedMetadata = string & Metadata
