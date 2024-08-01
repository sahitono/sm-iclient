import ky from "ky"
import type { NetworkAnalystResultResponse } from "../base/response"
import type { BaseNetworkParameter, TransportationAnalystParameter } from "../base/parameter"
import type { Point2D } from "../../../sm/geometry"
import { parseBaseParameter } from "../../base"

export interface GetOptimalPathParameter extends BaseNetworkParameter {
  nodes: Point2D[]
  hasLeastEdgeCount?: boolean
  parameter: TransportationAnalystParameter
}

export async function getOptimalPath(url: string, params: GetOptimalPathParameter) {
  return await ky
    .get(`${url}/path.json`, {
      searchParams: {
        hasLeastEdgeCount: params.hasLeastEdgeCount ?? false,
        nodes: JSON.stringify(params.nodes),
        parameter: JSON.stringify(params.parameter),
        ...parseBaseParameter(params),
      },
    })
    .json<NetworkAnalystResultResponse>()
}
