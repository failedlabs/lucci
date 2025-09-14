import { readingsAtom, showNewReadingAtom } from "@/lib/atoms"
import { Button } from "@lucci/ui/components/button"
import { Card } from "@lucci/ui/components/card"
import { useAtomValue, useSetAtom } from "jotai"
import { Badge, BookOpen, Clock, ExternalLink, Plus } from "lucide-react"

export function ReadingList() {
  const readingsList = useAtomValue(readingsAtom)
  const setShowNewReading = useSetAtom(showNewReadingAtom)

  return (
    <div className={`w-full max-w-md px-5 pb-3`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-2 text-balance text-xl font-semibold">
          Reading list
        </h2>
        <p className="text-muted-foreground text-sm">
          {readingsList.length} {readingsList.length === 1 ? "item" : "items"}{" "}
          in your list
        </p>
      </div>

      {/* Reading Items */}
      <div className="space-y-3">
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => setShowNewReading(true)}
        >
          <Plus />
        </Button>
        {readingsList.reverse().map((item) => (
          <Card
            key={item._id}
            className="border-border bg-card rounded-xl p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="space-y-2">
              {/* <div className="flex items-center justify-between">
                <Badge className="bg-muted text-muted-foreground text-xs">
                  {item.category}
                </Badge>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </div>
              </div> */}

              {/* Title and Author */}
              <div>
                <h3 className="text-card-foreground mb-1 text-pretty font-medium leading-tight">
                  {item.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  from {item.domain}
                </p>
              </div>

              {/* Description */}
              <p className="text-card-foreground text-pretty text-sm leading-relaxed">
                {item.metadata.description || ""}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {item.read ? (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <BookOpen className="h-3 w-3" />
                      Read
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  asChild
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Read
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {readingsList.length === 0 && (
        <Card className="bg-card border-border mt-3 p-8 text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            No items in your reading list yet
          </p>
        </Card>
      )}
    </div>
  )
}
