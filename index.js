require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/courese");  
const { adminRouter } = require("./routes/admin");

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Define routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

// MongoDB connection and server setup
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Get the port from the environment or default to 3000
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

main();
