import type { Geometry as GeoJSONGeometry, GeoJsonProperties } from "geojson"
import type { Options as KyOptions } from "ky"
import type { BaseDataParameter, FilterParameter } from "../base"
import { filterToQueryParameter, toFeatureResultPayload } from "../base"
import { toGeoJSON } from "../../../geometry/transformer"
import type { FeatureResultPayload } from "../../../sm/data"
import { GetFeatureMode } from "../../../sm/data"
import { buildFeatureResultRequest } from "../base/buildFeatureResultRequest"

export interface GetBySQLParamater extends BaseDataParameter {
  filter: FilterParameter
}

export async function getBySQL<G extends GeoJSONGeometry | null = GeoJSONGeometry, P = GeoJsonProperties>(
  url: string,
  options: GetBySQLParamater,
  kyOptions: KyOptions = {},
) {
  const payload: FeatureResultPayload = {
    ...toFeatureResultPayload(options, GetFeatureMode.SQL),
    queryParameter: filterToQueryParameter(options, options.filter),
  }

  const res = await buildFeatureResultRequest(url, payload, options, kyOptions)

  if (res.error != null && res.succeed === false) {
    throw new Error(`${res.error.code}: ${res.error.errorMsg}`)
  }

  return toGeoJSON<G, P>(res.features, options.typeCast)
}
