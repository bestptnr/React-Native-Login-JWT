const express = require("express");
const authRoute = require("./routes/auth");
const app = express();
const mongoose = require("mongoose");
const verify = require('./routes/verify')
app.use(express.json())
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get('/api/users/profile',verify,(req,res)=>{
    res.send({success:true,data:req.user})
})

app.use("/api/users", authRoute);

mongoose
  .connect(
    "mongodb+srv://",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000, () => console.log("Server running"));
  })
  .catch((e) => console.log(e));
