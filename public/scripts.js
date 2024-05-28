document.addEventListener("DOMContentLoaded", function () {
  const addRecipeForm = document.getElementById("addRecipeForm");
  const editRecipeForm = document.getElementById("editRecipeForm");

  const recipeList = document.getElementById("recipeList");

  // Function to fetch and display all recipes
  function getAllRecipes() {
      fetch("/api/recipes")
          .then(response => response.json())
          .then(recipes => {
              recipeList.innerHTML = "";
              recipes.forEach(player => {
                  const row = document.createElement("tr");
                  row.innerHTML = `
                      <td>${player.nombre}</td>
                      <td>${player.intereses}</td>
                      <td>${player.ciudad}</td>
                      <td>${player.edad}</td>
                      <td>
                          <button onclick="updateRecipe('${player._id}')">Editar</button>
                          <button onclick="deleteRecipe('${player._id}')">Eliminar</button>
                      </td>
                  `;
                  recipeList.appendChild(row);
              });
          })
          .catch(error => console.error("Error fetching recipes:", error));
  }

  // Function to handle form submission for adding a new player
  addRecipeForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(addRecipeForm);
      const newRecipe = {};
      formData.forEach((value, key) => {
          newRecipe[key] = value;
      });
      fetch("/api/recipes", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newRecipe)
      })
          .then(response => {
              if (response.ok) {
                  return response.json();
              }
              throw new Error("Failed to add player");
          })
          .then(() => {
              addRecipeForm.reset();
              getAllRecipes();
          })
          .catch(error => console.error("Error adding player:", error));
  });

  // The Function to handle form submission for updating a player
editRecipeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(editRecipeForm);
  const updatedRecipe = {};
  formData.forEach((value, key) => {
      updatedRecipe[key] = value;
  });
  const recipeId = formData.get('recipeId');
  fetch(`/api/recipes/by-id/${recipeId}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedRecipe)
  })
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Failed to update player");
      })
      .then(() => {
          editRecipeForm.reset();
          getAllRecipes();
      })
      .catch(error => console.error("Error updating player:", error));
});


  window.deleteRecipe = function (id) {
      if (confirm("Are you sure you want to delete this player?")) {
          fetch(`/api/recipes/${id}`, {
              method: "DELETE"
          })
              .then(response => {
                  if (response.ok) {
                      getAllRecipes();
                  } else {
                      throw new Error("Failed to delete player");
                  }
              })
              .catch(error => console.error("Error deleting player:", error));
      }
  };

  // Function to populate the update form with the selected player's data
  window.updateRecipe = function (id) {
      fetch(`/api/recipes/by-id/${id}`)
          .then(response => response.json())
          .then(player => {
              const editForm = document.getElementById("editRecipeForm");
              editForm.querySelector("#recipeId").value = player._id;
              editForm.querySelector("#nombre").value = player.nombre;
              editForm.querySelector("#intereses").value = player.intereses.join("\n");
              editForm.querySelector("#ciudad").value = player.ciudad;
              editForm.querySelector("#edad").value = player.edad;
          })
          .catch(error => console.error("Error fetching player for update:", error));
  };

  getAllRecipes();
});
