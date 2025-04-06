const express = require("express");
const ticketRouter = express.Router();
const { ticketRecords, createTicket ,specificTicket, lastComplaintId , ticketStatus, addComment} = require("../controllers/ticket.controller.js")


ticketRouter.get("/get", ticketRecords);
ticketRouter.post("/specific",specificTicket);
ticketRouter.post("/create", createTicket);
ticketRouter.get("/last", lastComplaintId);
ticketRouter.put("/status", ticketStatus);
ticketRouter.put("/comment", addComment);


module.exports = ticketRouter;
