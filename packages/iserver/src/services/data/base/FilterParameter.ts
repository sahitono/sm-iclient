import type { BaseDataParameter } from "../base"
import type { QueryParameter } from "../../../sm/common/QueryParameter"

export interface FilterParameter {
  where: string
  select?: string[]
  orderBy?: string
  groupBy?: string
}

export function filterToQueryParameter(
  parameter: BaseDataParameter,
  filter: FilterParameter,
): QueryParameter {
  return {
    name: `${parameter.dataset}@${parameter.datasource}`,
    attributeFilter: filter.where,
    fields: filter.select ?? undefined,
    ...(filter.orderBy && { orderBy: filter.orderBy }),
    ...(filter.groupBy && { orderBy: filter.groupBy }),
  } as QueryParameter
}
