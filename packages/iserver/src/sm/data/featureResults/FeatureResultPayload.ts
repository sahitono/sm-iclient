import type { Geometry, Rectangle2D } from "../../geometry"

import type { SpatialQueryMode } from "../../common/SpatialQueryMode"
import type { PrjCoordSys } from "../../common/PrjCoordSys"
import type { GetFeatureMode } from "./GetFeatureMode"

export interface FeatureResultPayload {
  getFeatureMode: GetFeatureMode
  datasetNames: string[]
  ids?: number[]
  bounds?: Rectangle2D
  geometry?: Geometry
  bufferDistance?: number
  attributeFilter?: string
  spatialQueryMode?: SpatialQueryMode
  maxFeatures?: number
  queryParameter?: any
  targetPrj?: PrjCoordSys
  targetEpsgCode?: any
  hasGeometry?: boolean
}
