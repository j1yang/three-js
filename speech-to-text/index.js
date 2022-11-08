const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs')

app.get("/", (req, res) => {
  // res.sendfile('index.html');
  res.sendfile("index")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
