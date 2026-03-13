import { Meal, fetchMeals } from "./meals.js"

// --- Récupération des éléments HTML ---
const mealNameInput = document.getElementById("mealName") as HTMLInputElement
const mealCaloriesInput = document.getElementById("mealCalories") as HTMLInputElement
const mealPriceInput = document.getElementById("mealPrice") as HTMLInputElement
const addMealBtn = document.getElementById("addMealBtn") as HTMLButtonElement

const mealListEl = document.getElementById("mealList") as HTMLUListElement
const menuListEl = document.getElementById("menuList") as HTMLUListElement
const calculateMenuBtn = document.getElementById("calculateMenuBtn") as HTMLButtonElement
const menuTotalHT = document.getElementById("menuTotalHT") as HTMLSpanElement
const menuTotalTTC = document.getElementById("menuTotalTTC") as HTMLSpanElement

let meals: Meal[] = []
let menu: Meal[] = []

function displayMeals(): void {
  mealListEl.innerHTML = ""
  if (meals.length === 0) {
    mealListEl.innerHTML = "<li class='list-group-item'>Aucun repas disponible.</li>"
    return
  }

  meals.forEach((meal) => {
    const li = document.createElement("li")
    li.className = "list-group-item d-flex justify-content-between align-items-center"

    const span = document.createElement("span")
    span.textContent = `${meal.name} - ${meal.price}€ (${meal.calories} kcal)`

    const addBtn = document.createElement("button")
    addBtn.textContent = "Ajouter au menu"
    addBtn.className = "btn btn-sm btn-primary"
    addBtn.addEventListener("click", () => {
      menu.push(meal)
      displayMenu()
    })

    li.appendChild(span)
    li.appendChild(addBtn)
    mealListEl.appendChild(li)
  })
}


function displayMenu(): void {
  menuListEl.innerHTML = ""
  if (menu.length === 0) {
    menuListEl.innerHTML = "<li class='list-group-item'>Aucun repas dans le menu.</li>"
    return
  }

  menu.forEach((meal, index) => {
    const li = document.createElement("li")
    li.className = "list-group-item d-flex justify-content-between align-items-center"
    li.textContent = `${meal.name} - ${meal.price}€`
    
    const removeBtn = document.createElement("button")
    removeBtn.textContent = "Supprimer"
    removeBtn.className = "btn btn-sm btn-danger"
    removeBtn.addEventListener("click", () => {
      menu.splice(index, 1)
      displayMenu()
    })

    li.appendChild(removeBtn)
    menuListEl.appendChild(li)
  })
}

addMealBtn.addEventListener("click", () => {
  const name = mealNameInput.value.trim()
  const calories = parseInt(mealCaloriesInput.value)
  const price = parseFloat(mealPriceInput.value)

  if (!name || isNaN(calories) || isNaN(price)) {
    alert("Veuillez remplir tous les champs correctement.")
    return
  }

  const newMeal: Meal = {
    id: Date.now(),
    name,
    calories,
    price
  }

  meals.push(newMeal)
  displayMeals()

  mealNameInput.value = ""
  mealCaloriesInput.value = ""
  mealPriceInput.value = ""
})


calculateMenuBtn.addEventListener("click", () => {
  const totalHT = menu.reduce((sum, m) => sum + m.price, 0)
  const totalTTC = totalHT * 1.2 
  menuTotalHT.textContent = totalHT.toFixed(2)
  menuTotalTTC.textContent = totalTTC.toFixed(2)
})


async function init(): Promise<void> {
  meals = await fetchMeals()
  displayMeals()
}

init()