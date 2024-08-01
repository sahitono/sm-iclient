import type { Geometry } from "../../geometry"

export interface FeatureResultResponse {
  succeed: boolean
  newResourceID: string
  newResourceLocation: string
}

export interface FeatureResultResponseContent {
  succeed?: boolean
  error?: {
    code: number
    errorMsg: string
  }
  featureCount: number
  featureUriList: string[]
  features: FeatureResultFeature[]
  totalCount: number
}

export interface FeatureResultFeature {
  ID: number
  fieldNames: string[]
  fieldValues: string[]
  geometry: Geometry
}
