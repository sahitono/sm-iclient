import type { FeatureResultPayload, GetFeatureMode } from "../../../sm/data"
import type { BaseParameter } from "../../base"

export interface BaseDataParameter extends BaseParameter {
  dataset: string
  datasource: string
  fromIndex?: number
  toIndex?: number
  typeCast?: boolean
  maxFeatures?: number
  hasGeometry?: boolean
}

export function toFeatureResultPayload(
  options: BaseDataParameter,
  getFeatureMode: GetFeatureMode,
): FeatureResultPayload {
  const { hasGeometry = true } = options
  return {
    datasetNames: [`${options.datasource}:${options.dataset}`],
    hasGeometry,
    getFeatureMode,
    maxFeatures: options.maxFeatures ?? undefined,
  }
}
