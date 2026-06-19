const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const leadRoutes =
require("./routes/leadRoutes");

const authRoutes =
require("./routes/authRoutes");

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server Running On Port ${PORT}`
    );

});