"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
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
        return (
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
              Open
            </Badge>
          </div>
        )
      case "in-progress":
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" />
            <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
              In Progress
            </Badge>
          </div>
        )
      case "closed":
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
              Closed
            </Badge>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
              Open
            </Badge>
          </div>
        )
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-teal-500" />
            <Badge variant="secondary" className="bg-teal-500 text-white hover:bg-teal-600">
              Low
            </Badge>
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-purple-500" />
            <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
              Medium
            </Badge>
          </div>
        )
      case "high":
        return (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <Badge className="bg-red-500 hover:bg-red-600">High</Badge>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-teal-500" />
            <Badge variant="secondary" className="bg-teal-500 text-white hover:bg-teal-600">
              Low
            </Badge>
          </div>
        )
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
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium">No tickets found</h3>
        <p className="text-muted-foreground">Create a new ticket to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
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
              <TableRow key={ticket._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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

