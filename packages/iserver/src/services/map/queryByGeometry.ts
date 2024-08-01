import ky from "ky"
import type { FeatureCollection, Feature as GeoJSONFeature } from "geojson"
import type { Geometry as SmGeometry } from "../../sm/geometry"
import { geojsonGeometry2sm, toGeoJSON } from "../../geometry/transformer"
import type { MapResponse } from "../../sm/map"
import { SpatialQueryMode } from "../../sm/common/SpatialQueryMode"
import { type BaseParameter, parseBaseParameter } from "../base"

export interface QueryByGeometryParameter extends BaseParameter {
  url: string
  geometry: GeoJSONFeature
  layerName: string[]
  maxResult?: number
  queryMode?: SpatialQueryMode
}

export async function queryByGeometry(param: QueryByGeometryParameter) {
  const geomType = param.geometry.geometry.type.toUpperCase()
  if (!Object.keys(geojsonGeometry2sm).includes(geomType)) {
    throw new Error("Not supported yet")
  }

  const queryGeom: SmGeometry = geojsonGeometry2sm[geomType](param.geometry)

  const res = await ky
    .post(`${param.url}/queryResults.json`, {
      searchParams: {
        returnContent: true,
        ...parseBaseParameter(param),
      },
      json: {
        queryMode: "SpatialQuery",
        queryParameters: {
          customParams: null,
          prjCoordSys: null,
          expectCount: param?.maxResult ?? 10000,
          networkType: "LINE",
          queryOption: "ATTRIBUTEANDGEOMETRY",
          queryParams: param.layerName.map((p) => {
            return { name: p }
          }),
          startRecord: 0,
          holdTime: 10,
          returnCustomResult: false,
          returnFeatureWithFieldCaption: false,
        },
        spatialQueryMode: param?.queryMode ?? SpatialQueryMode.INTERSECT,
        geometry: queryGeom,
      },
    })
    .json<MapResponse>()

  const collection: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  }

  for (const recordset of res.recordsets) {
    collection.features.push(...toGeoJSON(recordset.features).features)
  }

  return collection
}
