const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const libraryController = require("./interfaces/controllers/LibraryController");
const { swaggerUi, specs } = require("./swagger");
const connectDB = require("./infrastructure/database/connection");
const config = require("./config/config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use("/api", libraryController);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
