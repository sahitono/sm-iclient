import type { Geometry, Line, Point2D, Region } from "../../../sm/geometry"
import type { Bounds } from "../../../sm/geometry/Bounds"
import type { Feature } from "../../../sm/common/Features"

import type { PrjCoordSys } from "../../../sm/common/PrjCoordSys"

export type DirectionType =
  "EAST" |
  "NONE" |
  "NORTH" |
  "SOURTH" |
  "WEST "

export type TurnType =
  "AHEAD" |
  "BACK" |
  "END" |
  "LEFT" |
  "NONE" |
  "RIGHT"

export type SideType = "MIDDLE" | "NONE" | "LEFT" | "RIGHT"

export interface PathList {
  edgeFeatures?: Feature[]
  edgeIDs?: number[]
  nodeFeatures?: Feature[]
  nodeIDs?: number[]
  pathGuideItems?: PathGuideItem[]
  stopWeights?: number[]
  route?: {
    line: Line
    length: number
  }
  weight: number
}

export interface Route {
  line: Line
  center: Point2D
  length: number
  minM: number
  type: string
  points: Point2D[]
  parts: number[]
  maxM: number
  style?: unknown
  prjCoordSYs: PrjCoordSys
  id: number
  region: Region
  partTopo?: number[]
}

export interface PathGuideItem {
  sideType: SideType
  distance: number
  isStop: boolean
  isEdge: boolean
  length: number
  turnType: TurnType
  description: string
  index: number
  weight: number
  directionType: DirectionType
  bounds: Bounds
  name: string
  turnAngle: number
  geometry: Geometry
  id: number
}

export interface NetworkAnalystResultResponse {
  pathList: PathList[]
}
