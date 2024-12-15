const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const http = require("http");

const blogRoutes = require("./routes/blogRoutes");

const socketIO = require("socket.io");
const { authSocketMiddleware } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Blog Microservice MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
  auth: authSocketMiddleware,
});

io.on("connection", (socket) => {
  console.log("Blog connected for analytics");

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Blog disconnected");
  });
});

global.io = io;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit  IP to 100
  message: "Too many requests from this IP, please try again later.",
});

app.use(globalLimiter);
app.use(cors());
app.use(helmet());

app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`Blog Microservice listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Microservice API",
      version: "1.0.0",
      description: "API documentation for the Blog Microservice",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:5002/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
