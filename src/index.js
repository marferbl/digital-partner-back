const express = require("express");
require("./database");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

require("./routes")(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
