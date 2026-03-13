import { Meal, Order } from "./meals.js"

export class TropPauvreErreur extends Error {
  public solde: number
  public prixCommande: number

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
  orders: Order[]

  constructor(id: number, name: string, wallet: number) {
    this.id = id
    this.name = name
    this.wallet = wallet
    this.orders = []
  }

  orderMeal(meal: Meal): void {
    if (meal.price > this.wallet) {
      throw new TropPauvreErreur(
        `Fonds insuffisants pour commander "${meal.name}"`,
        this.wallet,
        meal.price
      )
    }

    this.wallet -= meal.price

    const newOrder: Order = {
      id: Date.now(),
      meals: [meal],
      total: meal.price
    }

    this.orders.push(newOrder)
    this.saveOrders()
  }

  saveOrders(): void {
    localStorage.setItem(`orders_${this.id}`, JSON.stringify(this.orders))
  }

  loadOrders(): void {
    const saved = localStorage.getItem(`orders_${this.id}`)
    if (saved) {
      this.orders = JSON.parse(saved) as Order[]
    }
  }
}