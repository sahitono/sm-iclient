import type { Point2D } from "./Point2D"

export interface Bounds {
  top: number
  left: number
  bottom: number
  leftBottom: Point2D
  right: number
  rightTop: Point2D
}
