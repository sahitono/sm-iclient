import type { PrjCoordSys } from "../common/PrjCoordSys"
import type { SmPoint } from "./Point2D"

export enum GeometryType {
  POINT = "POINT",
  POINT3D = "POINT3D",
  LINE = "LINE",
  LINE3D = "LINE3D",
  REGION = "REGION",
  REGION3D = "REGION3D",
}

export interface Geometry<T extends GeometryType = GeometryType> {
  center: SmPoint
  parts: number[]
  style: any
  prjCoordSys?: PrjCoordSys | null
  id: number
  type: T
  partTopo: number[]
  points: SmPoint[]
}

export interface Point extends Geometry<GeometryType.POINT> {}
export interface Point3 extends Geometry<GeometryType.POINT3D> {}
export interface Line extends Geometry<GeometryType.LINE> {}
export interface Line3 extends Geometry<GeometryType.LINE3D> {}
export interface Region extends Geometry<GeometryType.REGION> {}
export interface Region3 extends Geometry<GeometryType.REGION3D> {}
