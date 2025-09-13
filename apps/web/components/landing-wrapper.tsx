import { ShaderBg } from "@/components/shader-bg"

interface Props {
  children: React.ReactNode
}

export function LandingWrapper({ children }: Props) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      {children}
    </div>
  )

  // return (
  //   <ShaderBg>
  //     <div className="w-full h-full absolute z-10 flex">
  //       <div className="flex-1 flex items-center justify-center">
  //         <div className="w-sm bg-background/60 backdrop-blur-xl shadow-xl p-4 rounded-2xl px-10">

  //         <ul className="list-disc space-y-2">
  //           <li>Save all your bookmarks in one place</li>
  //           <li>Share it across browsers and devices</li>
  //           <li>Have your reading list anywhere</li>
  //           <li>One search history for everything</li>
  //         </ul>
  //         </div>
  //       </div>
  //       <div className="flex-1 h-full bg-background right-0 rounded-l-3xl p-5">
  //         <div className="px-10 space-y-3 mt-5">

  //           <h2 className="text-3xl font-bold">Welcome to Lucci</h2>
  //           <p className="text-muted-foreground">Lucci let's you save all your bookmarks and reading list in one place and share it across browsers and even devices</p>
  //         </div>

  //         <div className="w-full flex items-center justify-center mt-10">
  //         {children}
  //         </div>
  //       </div>
  //     </div>
  //   </ShaderBg>
  // )
}
