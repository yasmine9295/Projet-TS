import { Meal, Order } from "./meals.js"

export class TropPauvreErreur extends Error {
  solde: number
  prixCommande: number

  constructor(message: string, solde: number, prixCommande: number) {
    super(message)
    this.name = "TropPauvreErreur"
    this.solde = solde
    this.prixCommande = prixCommande
  }
}

export class User {
  id: number
  name: string
  wallet: number
  orders: Order[] = []

  constructor(id: number, name: string, wallet: number) {
    this.id = id
    this.name = name
    this.wallet = wallet
  }

  orderMeal(meal: Meal): void {
    if (meal.price > this.wallet) throw new TropPauvreErreur("Pas assez de sous", this.wallet, meal.price)
    this.wallet -= meal.price
    this.orders.push({ id: Date.now(), meals: [meal], total: meal.price })
    this.saveOrders()
  }

  orderMeals(meals: Meal[]): void {
    const total = meals.reduce((sum, m) => sum + m.price, 0)
    if (total > this.wallet) throw new TropPauvreErreur("Pas assez de sous", this.wallet, total)
    this.wallet -= total
    this.orders.push({ id: Date.now(), meals, total })
    this.saveOrders()
  }

  saveOrders(): void {
    localStorage.setItem(`orders${this.id}`, JSON.stringify(this.orders))
  }

  loadOrders(): void {
    const saved = localStorage.getItem(`orders${this.id}`)
    if (saved) this.orders = JSON.parse(saved)
  }
}