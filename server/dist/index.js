"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
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
const swaggerSpecs = (0, swagger_jsdoc_1.default)(swaggerOptions);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// Routes
app.use("/api/products", productRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/supplier", supplierRoutes_1.default);
// Swagger route
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecs));
// Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
