const express = require("express");

const policeRouter = express.Router();
const { policeLogin,policeRegister,getTeamInfo,specificPolice,assignPolice} = require("../controllers/police.controller.js")

/* policeRouter.get("/", getPoliceInfos);
policeRouter.get("/:username", getPoliceInfo); */

policeRouter.get("/team",getTeamInfo);
policeRouter.post("/login",policeLogin);
policeRouter.post("/register",policeRegister);
policeRouter.post("/specific",specificPolice);
policeRouter.put("/assign",assignPolice);


module.exports =  policeRouter;


/* 

  {
    "police_id": "sujal12345",
    "password": "djrajesh",
    "photo": null,
    "aadhar_card": 123456789,
    "full_name": "sujal santosh patil",
    "phone_no": null,
    "email": null,
    "address": null,
    "city": "bhiwandi",
    "state": "maharashra",
    "blood_group": null,
    "post": "bhiwandi",
    "speciality": null,
    "description": null
  }

*/