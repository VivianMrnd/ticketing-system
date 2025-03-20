import type { Ticket } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function fetchTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_URL}/ticket`)

  if (!response.ok) {
    throw new Error("Failed to fetch tickets")
  }

  return response.json()
}

export async function createTicket(ticket: Omit<Ticket, "_id" | "date">): Promise<Ticket> {
  const response = await fetch(`${API_URL}/ticket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  })

  if (!response.ok) {
    throw new Error("Failed to create ticket")
  }

  return response.json()
}

export async function updateTicket(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
  const response = await fetch(`${API_URL}/ticket/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  })

  if (!response.ok) {
    throw new Error("Failed to update ticket")
  }

  return response.json()
}

export async function deleteTicket(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/ticket/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete ticket")
  }
}

