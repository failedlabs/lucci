import { MeshGradient } from "@paper-design/shaders-react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="z-10 flex h-screen w-full">
      <div className="relative flex flex-1 p-4">
        <MeshGradient
          className="inset-0 h-full w-full rounded-xl"
          colors={["#000000", "#8b5cf6", "#1e1b4b", "#4c1d95"]}
          speed={0.3}
        />
        <div className="absolute w-full p-6">
          <h2 className="text-2xl font-bold">🐱 Lucci</h2>
        </div>
        <div className="absolute bottom-3 w-full p-8 pr-14">
          <span className="text-muted-foreground text-xl">
            With Lucci you can
          </span>
          <p className="mt-2 text-5xl">
            Access your bookmarks and reading list from anywhere at any time
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-3 p-10">
          <h3 className="text-3xl font-bold">Access Lucci now</h3>
          <p className="text-muted-foreground text-lg font-medium">
            Lucci let's you sync all your bookmarks and reading list and share
            it between browsers and devices have everything sync at all times
          </p>
        </div>
        <div className="bg-background flex h-full flex-1 items-center justify-center p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
