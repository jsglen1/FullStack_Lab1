import mongoose from "mongoose";
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  nombre: String,
  intereses: String,
  ciudad: String,
  edad: Number
});

const Recipe = model("jugador", recipeSchema);
export default Recipe;
