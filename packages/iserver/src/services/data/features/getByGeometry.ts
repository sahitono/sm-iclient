import type { Geometry as GeoJSONGeometry, GeoJsonProperties } from "geojson"
import type { Options as KyOptions } from "ky"
import type { BaseDataParameter, FilterParameter } from "../base"
import { filterToQueryParameter, toFeatureResultPayload } from "../base"
import { geojsonGeometry2sm, toGeoJSON } from "../../../geometry/transformer"
import type { FeatureResultPayload } from "../../../sm/data"
import { GetFeatureMode } from "../../../sm/data"
import type { SpatialQueryMode } from "../../../sm/common/SpatialQueryMode"
import { buildFeatureResultRequest } from "../base/buildFeatureResultRequest"

export interface GetByGeometryParameter extends BaseDataParameter {
  geometry: GeoJSONGeometry
  spatialQueryMode: SpatialQueryMode
  filter?: FilterParameter
}

export async function getByGeometry<
  G extends GeoJSONGeometry | null = GeoJSONGeometry,
  P = GeoJsonProperties,
>(url: string, options: GetByGeometryParameter, kyOptions: KyOptions = {}) {
  const geometry = geojsonGeometry2sm[options.geometry.type.toUpperCase()](options.geometry)
  const getFeatureMode
    = options.filter != null ? GetFeatureMode.SPATIAL_ATTRIBUTEFILTER : GetFeatureMode.SPATIAL

  const payload: FeatureResultPayload = {
    ...toFeatureResultPayload(options, getFeatureMode),
    geometry,
    spatialQueryMode: options.spatialQueryMode,
  }

  const filter
    = options.filter == null ? null : { queryParameter: filterToQueryParameter(options, options.filter) }
  if (filter != null) {
    payload.attributeFilter = filter.queryParameter.attributeFilter
    if (filter.queryParameter?.fields != null) {
      payload.queryParameter = filter.queryParameter
    }
  }

  const res = await buildFeatureResultRequest(url, payload, options, kyOptions)

  if (res.error != null && res.succeed === false) {
    throw new Error(`${res.error.code}: ${res.error.errorMsg}`)
  }

  return toGeoJSON<G, P>(res.features)
}
