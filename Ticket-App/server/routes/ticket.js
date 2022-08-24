const express = require("express");

const router = express.Router();

const {add,send, update, getTicketbyId, deleteTicket} =require("../controllers/ticket.js")

router.post("/addticket", add);
router.get("/getticket", send);
router.put("/:id", update);
router.get("/:id",getTicketbyId);
router.put("/del/:id", deleteTicket);

module.exports = router;