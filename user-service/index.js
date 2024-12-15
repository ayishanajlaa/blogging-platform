const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const http = require('http');
const socketIO = require('socket.io');

const userRoutes = require('./routes/userRoutes');

const { authSocketMiddleware } = require('./middleware/authMiddleware'); 

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('User Microservice MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// HTTP server to support Socket.IO
const server = http.createServer(app); 

const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,  
    methods: ["GET", "POST"],
  },
  auth: authSocketMiddleware
});

io.on('connection', (socket) => {
  console.log('User connected for analytics');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

global.io = io;


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100,  // limit  IP to 100 
  message: 'Too many requests from this IP, please try again later.',
});


app.use(globalLimiter);
app.use(cors());
app.use(helmet());


app.use('/api/users', userRoutes);

// Error handling middleware should be added before app.listen()
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.USER_PORT || 5001;


server.listen(PORT, () => {
  console.log(`User Microservice listening on port ${PORT}`);
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Microservice API",
      version: "1.0.0",
      description: "API documentation for the User Microservice",
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
        url: "http://localhost:5001",
      },
    ],
  },
  apis: ["./routes/*.js"],
};


module.exports = swaggerOptions;


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));