"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { Ticket } from "@/lib/types"
import { TicketEditDialog } from "./ticket-edit-dialog"
import { TicketDeleteDialog } from "./ticket-delete-dialog"

interface TicketListProps {
  tickets: Ticket[]
  isLoading: boolean
  onUpdate: (id: string, ticket: Partial<Ticket>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TicketList({ tickets, isLoading, onUpdate, onDelete }: TicketListProps) {
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null)
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">Open</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="default">Open</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="secondary">Low</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No tickets found</h3>
        <p className="text-muted-foreground">Create a new ticket to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell className="font-medium">{ticket.ticket}</TableCell>
                <TableCell className="font-medium">{ticket.title}</TableCell>
                <TableCell className="font-medium">{ticket.user}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="max-w-xs truncate">{ticket.description}</div>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell className="hidden md:table-cell">{ticket.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTicketToEdit(ticket)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTicketToDelete(ticket)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {ticketToEdit && (
        <TicketEditDialog
          ticket={ticketToEdit}
          open={!!ticketToEdit}
          onOpenChange={(open) => !open && setTicketToEdit(null)}
          onSave={async (updatedTicket) => {
            await onUpdate(ticketToEdit._id, updatedTicket)
            setTicketToEdit(null)
          }}
        />
      )}

      {ticketToDelete && (
        <TicketDeleteDialog
          ticket={ticketToDelete}
          open={!!ticketToDelete}
          onOpenChange={(open) => !open && setTicketToDelete(null)}
          onConfirm={async () => {
            await onDelete(ticketToDelete._id)
            setTicketToDelete(null)
          }}
        />
      )}
    </>
  )
}

