
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import Recipe from "./model/recipe.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

// Show all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve a specific recipe by nombre
app.get("/api/recipes/:nombre", async (req, res) => {
  const nombre = req.params.nombre;
  try {
    const recipe = await Recipe.findOne({ nombre: nombre });
    if (!recipe) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new recipe
app.post("/api/recipes", async (req, res) => {
  const { nombre } = req.body;
  try {
    const existingRecipe = await Recipe.findOne({ nombre: nombre });
    if (existingRecipe) {
      return res.status(409).json({ message: "Player already exists" });
    }
    const recipe = new Recipe(req.body);
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Retrieve a specific recipe by ID
app.get("/api/recipes/by-id/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const recipe = await Recipe.findById(id);
      if (!recipe) {
          return res.status(404).json({ message: "Player not found" });
      }
      res.json(recipe);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// Update a recipe by ID and Update
app.put("/api/recipes/by-id/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, intereses, ciudad, edad } = req.body;

  try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(
          id,
          {
              nombre,
              intereses,
              ciudad,
              edad: parseInt(edad, 10)
          },
          { new: true }
      );

      if (!updatedRecipe) {
          return res.status(404).json({ message: "Player not found" });
      }

      res.json(updatedRecipe);
  } catch (error) {
      console.error("Failed to update the recipe", error);
      res.status(500).json({ error: "Failed to update the recipe" });
  }
});





// Delete a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Player not found" });
    }
    await Recipe.deleteOne({ _id: id });
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

