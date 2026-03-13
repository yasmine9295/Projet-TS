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
export async function fetchMeals(): Promise<Meal[]> {
  try {
    const reponse = await fetch("https://keligmartin.github.io/api/meals.json")
    if (!reponse.ok) throw new Error("Erreur")
    const repas: Meal[] = await reponse.json()
    return repas
  } catch {
    console.log("Erreur lors du chargement des repas")
    return []
  }
}