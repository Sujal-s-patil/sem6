const express = require("express");
const app = express();
const port = 5555;
const cors=require('cors')


const policeRouter = require("./routes/police.routes.js");
const publicRouter = require("./routes/public.routes.js");
const criminalRouter = require("./routes/criminal.routes.js");
const ticketRouteer = require("./routes/ticket.routes.js")


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/police", policeRouter);
app.use("/public", publicRouter);
app.use("/criminal", criminalRouter)
app.use("/ticket", ticketRouteer)


app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


app.listen(port, "0.0.0.0", () => {
  console.log(`server started on `, port)
})