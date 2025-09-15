"use client"

import { Button } from "@lucci/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@lucci/ui/components/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@lucci/ui/components/tooltip"
import { Book, History } from "lucide-react"
import { useState } from "react"
import { ReadingList } from "./reading-list"

export function AppSection() {
  const [section, setSection] = useState<"history" | "readings">("readings")

  return (
    <Card className="h-full w-full pb-0">
      {/* <CardHeader className="flex items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={section === "readings" ? "default" : "ghost"}
              size={"icon"}
              onClick={() => setSection("readings")}
            >
              <Book />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reading list</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={section === "history" ? "default" : "ghost"}
              size={"icon"}
              onClick={() => setSection("history")}
            >
              <History />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>History</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader> */}
      <CardContent className="h-full w-full overflow-y-auto px-0">
        <ReadingList />
      </CardContent>
    </Card>
  )
}
