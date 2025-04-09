import { connectToDatabase } from '../../lib/mongodb'
import ticketList from '../../model/ticket'
import mongoose from 'mongoose';  

export default async function handler(req, res) {
  await connectToDatabase()

  switch(req.method){
    case 'GET': 
        try {
            const tickets = await ticketList.find().sort({ date: -1 })
            res.json(tickets)
            break;  
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch tickets", error: error.message })
        }
    case 'POST':
        try {
            const { title, user, description, status = "open", priority = "low" } = req.body
            if (!title || !user || !description) {
              return res.status(400).json({ message: "Title, user, and description are required" })
            }
        
            const newTicket = await ticketList.create({
              title,
              user,
              description,
              status,
              priority,
              date: new Date().toLocaleString(),
            })
        
            res.status(201).json(newTicket)
            break; 
        } catch (error) {
            res.status(500).json({ message: "Failed to create ticket", error: error.message })
        }  
    case 'PUT':
        try {
            const { id } = req.query
            if (!mongoose.Types.ObjectId.isValid(id)) {  
              return res.status(400).json({ message: "Invalid ticket ID" })
            }
        
            const updatedTicket = await ticketList.findByIdAndUpdate(id, req.body, { new: true })
            if (!updatedTicket) {
              return res.status(404).json({ message: "Ticket not found" })
            }
            res.json(updatedTicket)
            break;  
        } catch (error) {
            res.status(500).json({ message: "Failed to update ticket", error: error.message })
        }
    case "DELETE":
        try {
            const { id } = req.query
            if (!mongoose.Types.ObjectId.isValid(id)) {  
              return res.status(400).json({ message: "Invalid ticket ID" })
            }
        
            const deletedTicket = await ticketList.findByIdAndDelete(id)
            if (!deletedTicket) {
              return res.status(404).json({ message: "Ticket not found" })
            }
        
            res.json({ message: "Ticket deleted" })
            break; 
        } catch (error) {
            res.status(500).json({ message: "Failed to delete ticket", error: error.message })
        }

    default:
        return res.status(405).json({ message: 'Method not allowed' })
  }
}
