import type { Geometry as GeoJSONGeometry, GeoJsonProperties } from "geojson"
import type { Options as KyOptions } from "ky"
import type { BaseDataParameter, FilterParameter } from "../base"
import { filterToQueryParameter, toFeatureResultPayload } from "../base"
import { toGeoJSON } from "../../../geometry/transformer"
import type { FeatureResultPayload } from "../../../sm/data"
import { GetFeatureMode } from "../../../sm/data"
import type { Rectangle2D } from "../../../sm/geometry"
import { buildFeatureResultRequest } from "../base/buildFeatureResultRequest"

export interface GetByBoundsParameter extends BaseDataParameter {
  bounds: Pick<Rectangle2D, "leftBottom" | "rightTop">
  filter?: FilterParameter
}

export async function getByBounds<G extends GeoJSONGeometry | null = GeoJSONGeometry, P = GeoJsonProperties>(
  url: string,
  options: GetByBoundsParameter,
  kyOptions: KyOptions = {},
) {
  const getFeatureMode
    = options.filter != null ? GetFeatureMode.BOUNDS_ATTRIBUTEFILTER : GetFeatureMode.BOUNDS

  const { bounds } = options

  const payload: FeatureResultPayload = {
    ...toFeatureResultPayload(options, getFeatureMode),
    ...(options.filter && { queryParameter: filterToQueryParameter(options, options.filter) }),
    bounds: {
      ...bounds,
      bottom: bounds.leftBottom.y,
      top: bounds.rightTop.y,
      left: bounds.leftBottom.x,
      right: bounds.rightTop.x,
    },
  }

  const res = await buildFeatureResultRequest(url, payload, options, kyOptions)

  if (res.error != null && res.succeed === false) {
    throw new Error(`${res.error.code}: ${res.error.errorMsg}`)
  }

  return toGeoJSON<G, P>(res.features)
}
