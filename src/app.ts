import { fetchMeals, Meal } from "./meals.js"
import { User } from "./user.js"

const user = new User(1, "Bob", 30)
user.loadOrders()

let panier: Meal[] = []
let tousLesRepas: Meal[] = []
let nextMealId = 1000

const meallist = document.getElementById("mealList") as HTMLUListElement
const menulist = document.getElementById("menuList") as HTMLUListElement
const totalht = document.getElementById("menuTotalHT") as HTMLSpanElement
const totaltc = document.getElementById("menuTotalTTC") as HTMLSpanElement
const calcbtn = document.getElementById("calculateMenuBtn") as HTMLButtonElement
const orderbtn = document.getElementById("orderMenuBtn") as HTMLButtonElement
const addbtn = document.getElementById("addMealBtn") as HTMLButtonElement
const mealname = document.getElementById("mealName") as HTMLInputElement
const mealcalories = document.getElementById("mealCalories") as HTMLInputElement
const mealprice = document.getElementById("mealPrice") as HTMLInputElement
const wallet = document.getElementById("walletDisplay") as HTMLElement
const walleterror = document.getElementById("walletError") as HTMLSpanElement
const username = document.getElementById("userName") as HTMLElement
const orderhistory = document.getElementById("orderHistory") as HTMLDivElement

const updateUI = () => {
  wallet.textContent = `${user.wallet}€`
  username.textContent = user.name
  orderhistory.innerHTML = user.orders.length
    ? user.orders.map((o, idx) =>
        `<div>
          <span>${o.meals.map(m => m.name).join(", ")} total : ${o.total}€</span>
          <button data-idx="${idx}">Supprimer</button>
        </div>`).join('')
    : "<p class='text-muted'>pas de commande.</p>"

  orderhistory.querySelectorAll("button").forEach(btn =>
    btn.addEventListener("click", e => {
      const idx = parseInt((e.target as HTMLButtonElement).dataset.idx!)
      user.orders.splice(idx, 1)
      user.saveOrders()
      updateUI()
    })
  )
}

const displayMeals = () => {
  meallist.innerHTML = tousLesRepas.length
    ? tousLesRepas.map((m, i) =>
        `<li>
          <span>${m.name} — ${m.price}€ (${m.calories} kcal)</span>
          <button data-index="${i}">Ajouter au menu</button>
        </li>`).join('')
    : "<li>Aucun repas dispo.</li>"

  meallist.querySelectorAll("button").forEach(btn => {
    const idx = parseInt((btn as HTMLButtonElement).dataset.index!)
    btn.addEventListener("click", () => addToMenu(tousLesRepas[idx]))
  })
}

const addToMenu = (meal: Meal) => {
  panier.push(meal)
  const li = document.createElement("li")
  li.textContent = `${meal.name} — ${meal.price}€`
  const removebtn = document.createElement("button")
  removebtn.className = "btn btn-sm btn-outline-danger"
  removebtn.textContent = "Supprimer"
  removebtn.addEventListener("click", () => {
    panier.splice(panier.indexOf(meal), 1)
    li.remove()
  })
  li.appendChild(removebtn)
  menulist.appendChild(li)
}

calcbtn.addEventListener("click", () => {
  const total = panier.reduce((s, m) => s + m.price, 0)
  totalht.textContent = total.toFixed(2)
  totaltc.textContent = (total * 1.1).toFixed(2)
})

orderbtn.addEventListener("click", () => {
  if (!panier.length) { walleterror.textContent = "panier vide"; return }
  const total = panier.reduce((s, m) => s + m.price, 0)
  if (total > user.wallet) { walleterror.textContent = `pas assez de sous: ${user.wallet}€`; return }
  panier.forEach(m => user.orderMeal(m))
  user.saveOrders()
  panier = []
  menulist.innerHTML = ""
  totalht.textContent = "0"
  totaltc.textContent = "0"
  walleterror.textContent = ""
  updateUI()
})

addbtn.addEventListener("click", () => {
  const name = mealname.value.trim()
  const calories = parseInt(mealcalories.value)
  const price = parseFloat(mealprice.value)
  if (!name || isNaN(calories) || isNaN(price)) return
  tousLesRepas.push({ id: nextMealId++, name, calories, price })
  displayMeals()
  mealname.value = mealcalories.value = mealprice.value = ""
})

async function init() {
  tousLesRepas = await fetchMeals()
  updateUI()
  displayMeals()
}

init()