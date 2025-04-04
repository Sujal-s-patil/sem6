const express=require("express");
const publicRouter=express.Router();
const {publicRegister,publicLogin}=require("../controllers/public.controller.js");


publicRouter.post("/register",publicRegister);
publicRouter.post("/login",publicLogin);


module.exports=publicRouter;


/* 
{
  "fullName":"sujal patil",
  "aadharcardno":123456789,
  "email":"sujalpatil.com",
  "phoneno":6158496325,
  "address":"shetan galli",
  "city":"bhiwandi",
  "state":"maharashtra",
  "password":"123456789"
}
*/