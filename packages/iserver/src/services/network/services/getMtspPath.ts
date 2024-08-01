import ky from "ky"
import type { NetworkAnalystResultResponse } from "../base/response"
import type { BaseNetworkParameter, TransportationAnalystParameter } from "../base/parameter"
import type { Point2D } from "../../../sm/geometry"
import { parseBaseParameter } from "../../base"

export interface GetMtspPathParameter extends BaseNetworkParameter {
  nodes: Point2D[]
  parameter: TransportationAnalystParameter
  centers: Point2D
  isAnalyzeById?: boolean
  hasLeastTotalCost?: boolean
}

export async function getMtspPath(url: string, params: GetMtspPathParameter) {
  return await ky
    .get(`${url}/path.json`, {
      searchParams: {
        nodes: JSON.stringify(params.nodes),
        parameter: JSON.stringify(params.parameter),
        centers: JSON.stringify(params.centers),
        isAnalyzeById: params?.isAnalyzeById ?? false,
        hasLeastTotalCost: params?.hasLeastTotalCost ?? false,
        ...parseBaseParameter(params),
      },
    })
    .json<NetworkAnalystResultResponse>()
}
