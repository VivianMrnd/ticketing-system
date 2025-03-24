"use client"

import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { TicketList } from "@/components/ticket-list"
import { TicketForm } from "@/components/ticket-form"
import { TicketFilter } from "@/components/ticket-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TicketIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  BarChart4,
  ListFilter,
} from "lucide-react"
import type { Ticket } from "@/lib/types"
import { fetchTickets, createTicket, updateTicket, deleteTicket } from "@/lib/api"

export default function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const loadTickets = async () => {
    setIsLoading(true)
    try {
      const data = await fetchTickets()
      setTickets(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tickets", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const handleCreateTicket = async (newTicket: Omit<Ticket, "_id" | "date">) => {
    try {
      await createTicket(newTicket)
      toast({ title: "Success", description: "Ticket created successfully" })
      loadTickets()
    } catch (error) {
      toast({ title: "Error", description: "Failed to create ticket", variant: "destructive" })
    }
  }

  const handleUpdateTicket = async (id: string, updatedTicket: Partial<Ticket>) => {
    try {
      await updateTicket(id, updatedTicket)
      toast({ title: "Success", description: "Ticket updated successfully" })
      loadTickets()
    } catch (error) {
      toast({ title: "Error", description: "Failed to update ticket", variant: "destructive" })
    }
  }

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteTicket(id)
      toast({ title: "Success", description: "Ticket deleted successfully" })
      loadTickets()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete ticket", variant: "destructive" })
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = activeFilter === "all" || ticket.status === activeFilter
    const matchesSearch = searchQuery === "" || ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const statusCounts = {
    open: tickets.filter((ticket) => ticket.status === "open").length,
    "in-progress": tickets.filter((ticket) => ticket.status === "in-progress").length,
    closed: tickets.filter((ticket) => ticket.status === "closed").length,
  }

  const priorityCounts = {
    high: tickets.filter((ticket) => ticket.priority === "high").length,
    medium: tickets.filter((ticket) => ticket.priority === "medium").length,
    low: tickets.filter((ticket) => ticket.priority === "low").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary p-3 rounded-full">
              <TicketIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary">TicketMaster</h1>
          </div>
          <p className="text-muted-foreground">Your complete ticket management solution</p>
        </div>

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <BarChart4 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Status Overview</h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-around">
                <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      Open
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.open}</span>
                </div>
                <div className="flex flex-col items-center bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
                      In Progress
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {statusCounts["in-progress"]}
                  </span>
                </div>
                <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
                      Closed
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.closed}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <ListFilter className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Priority Overview</h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-around">
                <div className="flex flex-col items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
                  </div>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">{priorityCounts.high}</span>
                </div>
                <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertCircle className="h-4 w-4 text-purple-500" />
                    <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                      Medium
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {priorityCounts.medium}
                  </span>
                </div>
                <div className="flex flex-col items-center bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle className="h-4 w-4 text-teal-500" />
                    <Badge variant="secondary" className="bg-teal-500 text-white hover:bg-teal-600">
                      Low
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">{priorityCounts.low}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-5">
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 dark:bg-slate-700">
              <TabsTrigger
                value="tickets"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TicketIcon className="h-4 w-4 mr-2" />
                View Tickets
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Create Ticket
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="mt-2">
              <TicketFilter
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <TicketList
                tickets={filteredTickets}
                isLoading={isLoading}
                onUpdate={handleUpdateTicket}
                onDelete={handleDeleteTicket}
              />
            </TabsContent>

            <TabsContent value="create" className="mt-2">
              <TicketForm onSubmit={handleCreateTicket} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

