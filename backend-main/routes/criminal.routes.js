const express = require("express");
const criminalRouter= express.Router();
const { criminalRegister, criminalRecords , criminal_list} = require("../controllers/criminal.controller.js");



//register
criminalRouter.post("/register", criminalRegister);

//get all criminal records
criminalRouter.get("/records", criminalRecords);

//get specific record
criminalRouter.post("/specific", criminal_list);


module.exports = criminalRouter;



