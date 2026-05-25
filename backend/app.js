/* ===== ENV ===== */

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";

/* ===== IMPORTS ===== */

const express = require("express");

const app = express();

const http = require("http");

const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const swaggerUi = require("swagger-ui-express");

const YAML = require("yamljs");

const connectDB = require("./config/db");

/* ===== ROUTES IMPORTS ===== */

const authRoutes = require("./modules/auth/auth.routes");

const accountsRoutes = require("./modules/accounts/accounts.routes");

const transactionsRoutes = require("./modules/transactions/transactions.routes");

const chatRoutes = require("./modules/chat/chat.routes");

/* ===== HTTP SERVER ===== */

const server = http.createServer(app);

/* ===== SOCKET.IO ===== */

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,

    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* ===== SWAGGER ===== */

const swaggerDocument = YAML.load("./docs/swagger/openapi.yaml");

/* ===== MIDDLEWARE ===== */

app.use(
  cors({
    origin: FRONTEND_URL,

    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());

/* ===== API ROUTES ===== */

app.use("/api/auth", authRoutes);

app.use("/api/accounts", accountsRoutes);

app.use("/api/transactions", transactionsRoutes);

app.use("/api/chat", chatRoutes);

/* ===== SWAGGER ROUTE ===== */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ===== SERVER STARTUP ===== */

async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Allowed frontend: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server");

    process.exit(1);
  }
}

startServer();
