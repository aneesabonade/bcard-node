const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/config");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const app = express();

// JSON body parsing
app.use(express.json());

// CORS
app.use(cors());

// Logger with morgan :contentReference[oaicite:22]{index=22}
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ ok: true, message: "API is running" }));

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  });