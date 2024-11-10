require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');


const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/courese");
const { adminRouter } = require("./routes/admin");
const app = express();
app.use(express.json());
app.use(cors());


app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
    console.log("listening on port 3000")
}

main()