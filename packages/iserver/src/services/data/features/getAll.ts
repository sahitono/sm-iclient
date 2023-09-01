import type { Options as KyOptions } from "ky-universal"
import ky from "ky-universal"
import type { FeatureCollection, Geometry as GeoJSONGeometry, GeoJsonProperties } from "geojson"
import type { BaseDataParameter } from "../base/BaseParameter"
import { parseBaseParameter } from "~/services/base/parameter"

export interface GetAllParameter extends BaseDataParameter {}

/**
 * Get All Features
 * @param url iServer Data Service Base URL
 * @param options
 * @param kyOptions
 * @returns
 */
export async function getAll<G extends GeoJSONGeometry | null = GeoJSONGeometry, P = GeoJsonProperties>(
  url: string,
  options: GetAllParameter,
  kyOptions: KyOptions = {}
) {
  return await ky
    .get(`${url}/datasources/${options.datasource}/datasets/${options.dataset}/features.geojson`, {
      ...kyOptions,
      searchParams: {
        returnContent: true,
        fromIndex: options.fromIndex ?? 0,
        toIndex: options.toIndex ?? -1,
        ...parseBaseParameter(options)
      }
    })
    .json<FeatureCollection<G, P>>()
}
