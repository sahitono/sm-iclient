import type { Geometry } from "../geometry"

export interface Feature {
  ID: number
  fieldNames: string[]
  fieldValues: string[]
  geometry: Geometry
}
