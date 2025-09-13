import { Button } from "@lucci/ui/components/button"
import { Card } from "@lucci/ui/components/card"
import { Badge, BookOpen, Clock, ExternalLink } from "lucide-react"

interface ReadingItem {
  id: string
  title: string
  author: string
  description: string
  readTime: string
  category: string
  url: string
  isRead?: boolean
}

const sampleReadingItems = [
  {
    id: "1",
    title: "The Art of Readable Code",
    author: "Dustin Boswell",
    description:
      "Simple and practical techniques for writing better code that any programmer can understand.",
    readTime: "15 min",
    category: "Programming",
    url: "https://example.com/readable-code",
    isRead: false,
  },
  {
    id: "2",
    title: "Atomic Design Methodology",
    author: "Brad Frost",
    description:
      "A methodology for creating design systems by breaking down interfaces into their basic components.",
    readTime: "8 min",
    category: "Design",
    url: "https://example.com/atomic-design",
    isRead: true,
  },
  {
    id: "3",
    title: "The Psychology of Color in UI Design",
    author: "Sarah Chen",
    description:
      "How color choices affect user behavior and emotional responses in digital interfaces.",
    readTime: "12 min",
    category: "UX/UI",
    url: "https://example.com/color-psychology",
    isRead: false,
  },
  {
    id: "4",
    title: "Modern CSS Layout Techniques",
    author: "Rachel Andrew",
    description:
      "A comprehensive guide to CSS Grid, Flexbox, and other modern layout methods for responsive design.",
    readTime: "20 min",
    category: "CSS",
    url: "https://example.com/css-layout",
    isRead: false,
  },
]

export function ReadingList() {
  return (
    <div className={`w-full max-w-md px-5 pb-3`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-2 text-balance text-xl font-semibold">
          Reading list
        </h2>
        <p className="text-muted-foreground text-sm">
          {sampleReadingItems.length}{" "}
          {sampleReadingItems.length === 1 ? "item" : "items"} in your list
        </p>
      </div>

      {/* Reading Items */}
      <div className="space-y-3">
        {sampleReadingItems.map((item) => (
          <Card
            key={item.id}
            className="border-border bg-card p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="space-y-2">
              {/* Header with category and read time */}
              <div className="flex items-center justify-between">
                <Badge className="bg-muted text-muted-foreground text-xs">
                  {item.category}
                </Badge>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </div>
              </div>

              {/* Title and Author */}
              <div>
                <h3 className="text-card-foreground mb-1 text-pretty font-medium leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  by {item.author}
                </p>
              </div>

              {/* Description */}
              <p className="text-card-foreground text-pretty text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {item.isRead ? (
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
      {sampleReadingItems.length === 0 && (
        <Card className="bg-card border-border p-8 text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            No items in your reading list yet
          </p>
        </Card>
      )}
    </div>
  )
}
