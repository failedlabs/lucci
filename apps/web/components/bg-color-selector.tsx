import { Button } from "@lucci/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lucci/ui/components/popover"
import { cn } from "@lucci/ui/lib/utils"
import { useState } from "react"

interface Props {
  color: string
  setColor: (color: string) => void
}

export const BG_COLORS = [
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-gray-500",
  "bg-stone-500",
]

export function BgColorSelector({ color, setColor }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" className={cn(color, "h-9 w-9")} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-wrap gap-2">
          {BG_COLORS.map((cl) => (
            <Button
              type="button"
              key={cl}
              className={cn(cl, "h-9 w-9")}
              onClick={() => {
                setColor(cl)
                setOpen(false)
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
