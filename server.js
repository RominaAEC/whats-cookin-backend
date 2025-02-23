import express from "express";
import cors from "cors";
import 'dotenv/config'; 

import recipesRoutes from "./routes/recipes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/recipes", express.static("public/images"));

app.get("/", (req, res) => {
    res.send(`
      <h1>Welcome to the Cookbook API!</h1>
      <p>Available Endpoints:</p>
      <ul>
        <li>GET /recipes - Access recipes-related data</li>
        <li>GET /recipes/:id - Access a single recipe/li>
        <li>PUT /recipes/:id - Edit a single recipe/li>
        <li>POST /recipes/:id - Add a single recipe/li>
        <li>DELETE /recipes/:id - Delete a single recipe/li>
      </ul>
    `);
  });

app.use("/recipes", recipesRoutes);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});