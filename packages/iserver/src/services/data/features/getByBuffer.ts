import type { Geometry as GeoJSONGeometry, GeoJsonProperties } from "geojson"
import type { Options as KyOptions } from "ky"
import type { BaseDataParameter, FilterParameter } from "../base"
import { filterToQueryParameter, toFeatureResultPayload } from "../base"
import { geojsonGeometry2sm, toGeoJSON } from "../../../geometry/transformer"
import type { FeatureResultPayload } from "../../../sm/data"
import { GetFeatureMode } from "../../../sm/data"
import { buildFeatureResultRequest } from "../base/buildFeatureResultRequest"

export interface GetByBufferParameter extends BaseDataParameter {
  geometry: GeoJSONGeometry
  bufferDistance: number
  filter?: FilterParameter
}

export async function getByBuffer<G extends GeoJSONGeometry | null = GeoJSONGeometry, P = GeoJsonProperties>(
  url: string,
  options: GetByBufferParameter,
  kyOptions: KyOptions = {},
) {
  const geometry = geojsonGeometry2sm[options.geometry.type.toUpperCase()](options.geometry)
  const getFeatureMode
    = options.filter != null ? GetFeatureMode.BUFFER_ATTRIBUTEFILTER : GetFeatureMode.BUFFER

  const payload: FeatureResultPayload = {
    ...toFeatureResultPayload(options, getFeatureMode),
    ...(options.filter && { queryParameter: filterToQueryParameter(options, options.filter) }),
    geometry,
    bufferDistance: options.bufferDistance,
  }

  const res = await buildFeatureResultRequest(url, payload, options, kyOptions)

  if (res.error != null && res.succeed === false) {
    throw new Error(`${res.error.code}: ${res.error.errorMsg}`)
  }

  return toGeoJSON<G, P>(res.features)
}
