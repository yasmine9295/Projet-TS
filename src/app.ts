import { fetchMeals, Meal } from "./meals.js"
import { User } from "./user.js"

const user = new User(1, "Bob", 30)
user.loadOrders()

let panier: Meal[] = []
let tousLesRepas: Meal[] = []
let nextMealId = 1000

const mealListEl = document.getElementById("mealList") as HTMLUListElement
const menuListEl = document.getElementById("menuList") as HTMLUListElement
const menuTotalHTEl = document.getElementById("menuTotalHT") as HTMLSpanElement
const menuTotalTTCEl = document.getElementById("menuTotalTTC") as HTMLSpanElement
const calculateMenuBtn = document.getElementById("calculateMenuBtn") as HTMLButtonElement
const orderMenuBtn = document.getElementById("orderMenuBtn") as HTMLButtonElement
const addMealBtn = document.getElementById("addMealBtn") as HTMLButtonElement
const mealNameInput = document.getElementById("mealName") as HTMLInputElement
const mealCaloriesInput = document.getElementById("mealCalories") as HTMLInputElement
const mealPriceInput = document.getElementById("mealPrice") as HTMLInputElement
const walletDisplayEl = document.getElementById("walletDisplay") as HTMLElement
const walletErrorEl = document.getElementById("walletError") as HTMLSpanElement
const userNameEl = document.getElementById("userName") as HTMLElement
const orderHistoryEl = document.getElementById("orderHistory") as HTMLDivElement

const updateUI = () => {
  walletDisplayEl.textContent = `${user.wallet}€`
  userNameEl.textContent = user.name
  orderHistoryEl.innerHTML = user.orders.length
    ? user.orders.map((o, idx) =>
        `<div>
          <span>${o.meals.map(m => m.name).join(", ")} total : ${o.total}€</span>
          <button data-idx="${idx}">Supprimer</button>
        </div>`).join('')
    : "<p class='text-muted'>pas de commande.</p>"

  orderHistoryEl.querySelectorAll("button").forEach(btn =>
    btn.addEventListener("click", e => {
      const idx = parseInt((e.target as HTMLButtonElement).dataset.idx!)
      user.orders.splice(idx, 1)
      user.saveOrders()
      updateUI()
    })
  )
}

const displayMeals = () => {
  mealListEl.innerHTML = tousLesRepas.length
    ? tousLesRepas.map(m =>
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span>${m.name} — ${m.price}€ (${m.calories} kcal)</span>
          <button>Ajouter au menu</button>
        </li>`).join('')
    : "<li>Aucun repas dispo.</li>"

  mealListEl.querySelectorAll("button").forEach((btn, i) =>
    btn.addEventListener("click", () => addToMenu(tousLesRepas[i]))
  )
}

const addToMenu = (meal: Meal) => {
  panier.push(meal)
  const li = document.createElement("li")
  li.textContent = `${meal.name} — ${meal.price}€`
  const removeBtn = document.createElement("button")
  removeBtn.className = "btn btn-sm btn-outline-danger"
  removeBtn.textContent = "Supprimer"
  removeBtn.addEventListener("click", () => { panier.splice(panier.indexOf(meal), 1); li.remove() })
  li.appendChild(removeBtn)
  menuListEl.appendChild(li)
}

calculateMenuBtn.addEventListener("click", () => {
  const totalHT = panier.reduce((s, m) => s + m.price, 0)
  menuTotalHTEl.textContent = totalHT.toFixed(2)
  menuTotalTTCEl.textContent = (totalHT * 1.1).toFixed(2)
})

orderMenuBtn.addEventListener("click", () => {
  if (!panier.length) { walletErrorEl.textContent = "panier vide"; return }
  const totalPrix = panier.reduce((s, m) => s + m.price, 0)
  if (totalPrix > user.wallet) { walletErrorEl.textContent = `pas assez de sous: ${user.wallet}€`; return }
  panier.forEach(m => user.orderMeal(m))
  user.saveOrders()
  panier = []
  menuListEl.innerHTML = ""
  menuTotalHTEl.textContent = "0"
  menuTotalTTCEl.textContent = "0"
  walletErrorEl.textContent = ""
  updateUI()
})

addMealBtn.addEventListener("click", () => {
  const name = mealNameInput.value.trim()
  const calories = parseInt(mealCaloriesInput.value)
  const price = parseFloat(mealPriceInput.value)
  if (!name || isNaN(calories) || isNaN(price)) return
  tousLesRepas.push({ id: nextMealId++, name, calories, price })
  displayMeals()
  mealNameInput.value = mealCaloriesInput.value = mealPriceInput.value = ""
})

async function init() {
  tousLesRepas = await fetchMeals()
  updateUI()
  displayMeals()
}

init()