import ky from "ky"
import type { Options as KyOptions } from "ky"
import { parseBaseParameter } from "../../base"
import type { ServiceResult } from "../../../sm/common/ServiceResult"
import type { BaseDataParameter } from "./BaseParameter"

export async function buildFeatureResultRequest(url: string, payload: Record<string, any>, parameter: BaseDataParameter, kyOptions: KyOptions = {}) {
  return ky.create({
    ...kyOptions,
    searchParams: {
      returnContent: true,
      fromIndex: parameter.fromIndex ?? 0,
      toIndex: parameter.toIndex ?? -1,
      ...parseBaseParameter(parameter),
    },
  }).post(`${url}/featureResults.json`, {
    json: payload,
  }).json<ServiceResult>()
}
