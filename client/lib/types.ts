export interface Ticket {
    _id: string
    ticket:string
    title: string
    user: string
    description: string
    date: string
    status: "open" | "in-progress" | "closed"
    priority: "low" | "medium" | "high"
  }
  
  