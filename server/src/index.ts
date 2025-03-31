import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes"
import transactionRoutes from "./routes/transactionRoutes";
import supplierRoutes from "./routes/supplierRoutes"
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tatsulok API Documentation",
      version: "1.0.0",
      description: "API Documentation for Tatsulok application",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/supplier", supplierRoutes)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});