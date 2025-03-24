import type { Ticket } from "./types"
import { crudData } from "./utils"

export async function fetchTickets(): Promise<Ticket[]> {
  return await crudData();
}
export async function createTicket(ticket: Omit<Ticket, "_id" | "date">): Promise<Ticket> {
  return await crudData("POST", ticket);
}

export async function updateTicket(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
  return await crudData("PUT", ticket, id)
}

export async function deleteTicket(id: string): Promise<void> {
  return await crudData("DELETE", "", id)
}

