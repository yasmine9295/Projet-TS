export type Meal = {
  id: number
  name: string
  calories: number
  price: number
}

export type Order = {
  id: number
  meals: Meal[]
  total: number
}

export type MealDraft = Partial<Meal>
export type OrderWithoutId = Omit<Order, "id">
export type MealPriceMap = Record<string, number>

export async function fetchMeals(): Promise<Meal[]> {
  try {
    const response = await fetch("https://keligmartin.github.io/api/meals.json")
    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`)
    }
    const meals: Meal[] = await response.json()
    return meals
  } catch (error) {
    console.error("Erreur repas")
    return []
  }
}