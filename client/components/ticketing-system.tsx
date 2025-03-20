"use client"

import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { TicketList } from "@/components/ticket-list"
import { TicketForm } from "@/components/ticket-form"
import { TicketFilter } from "@/components/ticket-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Ticketing System</h1>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tickets">View Tickets</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <TicketFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TicketList tickets={filteredTickets} isLoading={isLoading} onUpdate={handleUpdateTicket} onDelete={handleDeleteTicket} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <TicketForm onSubmit={handleCreateTicket} />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
