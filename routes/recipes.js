import express from "express";
import { readFileSync, writeFileSync } from "fs";


const router = express.Router();
const recipesFile = "./data/recipes.json";

const readRecipes = () => JSON.parse(readFileSync(recipesFile, "utf-8"));
const writeRecipes = (recipes) => { writeFileSync(recipesFile, JSON.stringify(recipes, null, 2), "utf-8");};


//GET all recipes  info
router.get("/", (_, res)=>{
    try{
        const recipes = readRecipes();
        res.json(recipes)
    } catch (error){
        console.error("Error reading recipes:", error);
        res.status(500).json({ error: "Unable to fetch recipes"});
    }
});

//GET a single recipe by ID
router.get("/:id", (req, res)=>{
    try{
        const recipes = readRecipes();
        const recipeId = Number(req.params.id);
        const recipe = recipes.find((p) => p.id === recipeId);

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.json(recipe);
    } catch (error){
        console.error("Error fetching recipe:", error);
        res.status(500).json({ error: "Unable to fetch recipe" });
    }
});

// POST a new recipe
router.post("/", (req, res) => {
    try {
        const recipes = readRecipes();
        const newRecipe = req.body;

        // Validate required fields
        if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions || !newRecipe.prepTimeMinutes || !newRecipe.cookTimeMinutes || !newRecipe.servings ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate a new ID 
        const newId = recipes.length > 0 ? recipes[recipes.length - 1].id + 1 : 1;
        newRecipe.id = newId;

        const recipeToAdd = {
            id: newId, 
            ...newRecipe, 
            image: newRecipe.image || "http://localhost:8080/recipes/Photo-15.jpg"
        };

        // Add the new recipe
        recipes.push(recipeToAdd);
        writeRecipes(recipes);

        res.status(201).json(recipeToAdd);
    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ error: "Unable to add recipe" });
    }
});

// PUT (update) an existing recipe by ID
router.put("/:id", (req, res) => {
    try {
        const recipes = readRecipes();
        const recipeId = Number(req.params.id);
        const updatedRecipe = req.body;

        // Find the recipe to update
        const recipeIndex = recipes.findIndex((p) => p.id === recipeId);
        if (recipeIndex === -1) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        // Update the recipe
        recipes[recipeIndex] = { ...recipes[recipeIndex], ...updatedRecipe };
        writeRecipes(recipes);

        res.json(recipes[recipeIndex]);
    } catch (error) {
        console.error("Error updating recipe:", error);
        res.status(500).json({ error: "Unable to update recipe" });
    }
});

// DELETE a recipe by ID
router.delete("/:id", (req, res) => {
    try {
        const recipes = readRecipes();
        const recipeId = Number(req.params.id);

        // Find the recipe to delete
        const recipeIndex = recipes.findIndex((p) => p.id === recipeId);
        if (recipeIndex === -1) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        // Remove the recipe
        recipes.splice(recipeIndex, 1);
        writeRecipes(recipes);

        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        res.status(500).json({ error: "Unable to delete recipe" });
    }
});

export default router;