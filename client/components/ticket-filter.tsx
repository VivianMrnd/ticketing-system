"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TicketFilterProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function TicketFilter({ activeFilter, setActiveFilter, searchQuery, setSearchQuery }: TicketFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className={activeFilter === "all" ? "bg-primary text-primary-foreground" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          All
        </Button>
        <Button
          variant={activeFilter === "open" ? "default" : "outline"}
          onClick={() => setActiveFilter("open")}
          className={activeFilter === "open" ? "bg-blue-500 hover:bg-blue-600" : ""}
        >
          Open
        </Button>
        <Button
          variant={activeFilter === "in-progress" ? "default" : "outline"}
          onClick={() => setActiveFilter("in-progress")}
          className={activeFilter === "in-progress" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
        >
          In Progress
        </Button>
        <Button
          variant={activeFilter === "closed" ? "default" : "outline"}
          onClick={() => setActiveFilter("closed")}
          className={activeFilter === "closed" ? "border-green-500 text-green-600" : ""}
        >
          Closed
        </Button>
      </div>
    </div>
  )
}

