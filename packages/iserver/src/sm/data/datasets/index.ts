import type { PrjCoordSys } from "../../common/PrjCoordSys"
import type { Rectangle2D } from "../../geometry"

export type DatasetType = string

export interface DatasetInfo {
  name: string
  description: string
  type: DatasetType
  bounds: Rectangle2D
  dataSourceName: string
  encodeType: any
  isReadOnly: boolean
  prjCoordSys: PrjCoordSys
  recordCount: number
  [name: string]: unknown
}

export interface Dataset {
  datasetInfo: any
}
