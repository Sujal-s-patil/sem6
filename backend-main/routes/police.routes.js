const express = require("express");

const policeRouter = express.Router();
const { policeLogin,policeRegister,getTeamInfo,specificPolice,assignPolice,unassignPolice,getUserById} = require("../controllers/police.controller.js")


policeRouter.get("/team",getTeamInfo);
policeRouter.post("/login",policeLogin);
policeRouter.post("/register",policeRegister);
policeRouter.post("/specific",specificPolice);
policeRouter.put("/assign",assignPolice);
policeRouter.put("/unassign",unassignPolice);
policeRouter.get("/:id",getUserById);



module.exports =  policeRouter;
