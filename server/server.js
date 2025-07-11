import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
//app.use(express.json());
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

// Middlewares
const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Global error handler (important!)
app.use((err, req, res, next) => {
  console.error(" Global Error:", err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// Start server
app.listen(port, () => console.log(`Server running on PORT: ${port}`));
