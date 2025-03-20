require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ticketList = require("./db");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.db)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.get("/ticket", async (req, res) => {
  try {
    res.json(await ticketList.find().sort({ date: -1 }));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
});

app.post("/ticket", async (req, res) => {
  try {
    const { title, user, description, status = "open", priority = "low" } = req.body;
    if (!title || !user || !description) {
      return res.status(400).json({ message: "Title, user, and description are required" });
    }

    res.status(201).json(
      await ticketList.create({ title, user, description, status, priority, date: new Date().toLocaleString() })
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
});


app.put("/ticket/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ticket ID" });

    const updatedTicket = await ticketList.findByIdAndUpdate(id, req.body, { new: true });
    updatedTicket ? res.json(updatedTicket) : res.status(404).json({ message: "Ticket not found" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticket", error: error.message });
  }
});

app.delete("/ticket/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ticket ID" });

    const deletedTicket = await ticketList.findByIdAndDelete(id);
    deletedTicket ? res.json({ message: "Ticket deleted" }) : res.status(404).json({ message: "Ticket not found" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ticket", error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
