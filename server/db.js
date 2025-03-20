const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticket: { type: String, default: Date.now()},
  title: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    default: () => new Date().toLocaleString(),
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
});

const ticketList = mongoose.model("Ticket", ticketSchema);

module.exports = ticketList;
