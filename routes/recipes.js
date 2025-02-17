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
        const recipeId = Number(req.params.id)
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
            image: newRecipe.image || "http://localhost:8080/photos/Photo-09.jpg"
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


export default router;