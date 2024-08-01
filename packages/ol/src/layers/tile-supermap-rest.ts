import BaseEvent from "ol/events/Event"
import { getCenter, getWidth } from "ol/extent"
import { Tile as TileLayer } from "ol/layer"
import type { Projection } from "ol/proj"
import { toSize } from "ol/size"
import { TileImage } from "ol/source"
import type { Options as TileOptions } from "ol/source/TileImage"
import TileGrid from "ol/tilegrid/TileGrid"

function getResolutions(extent: number[]) {
  const startResolution = getWidth(extent) / 256
  const resolutions = Array.from<number>({ length: 22 })
  for (let i = 0, ii = resolutions.length; i < ii; ++i) {
    resolutions[i] = startResolution / 2 ** i
  }
  return resolutions
}

const MAP_UNIT: Record<string, number> = {
  m: 1,
  degree: (Math.PI * 2 * 6378137) / 360,
  degrees: (Math.PI * 2 * 6378137) / 360,
  km: 1.0e-3,
  in: 1 / 2.5399999918e-2,
  ft: 0.3048,
}

export function getMeterPerMapUnit(mapUnit: string) {
  return MAP_UNIT[mapUnit]
}

function resolutionToScale(resolution: number, dpi: number, mapUnit: string) {
  const inchPerMeter = 1 / 0.0254
  const meterPerMapUnit = getMeterPerMapUnit(mapUnit)
  return 1 / (resolution * dpi * inchPerMeter * meterPerMapUnit)
}

export function createTileGrid(extent: number[], origin?: number[], tileSize = 256) {
  return new TileGrid({
    resolutions: getResolutions(extent),
    tileSize,
    origin: origin ?? getCenter(extent),
  })
}

export function createTileLayer(url: string, projection: Projection) {
  const resolutions = getResolutions(projection.getExtent())
  const tileGrid = createTileGrid(resolutions, getCenter(projection.getExtent()))

  return new TileLayer({
    preload: Infinity,
    source: new TileSuperMapRest({
      url,
      wrapX: true,
      projection,
      tileGrid,
      format: "png",
      transparent: true,
    }),
  })
}

class TileChangeEvent extends BaseEvent {
  // @ts-expect-error placeholder
  private value: Record<string, any>
  constructor(opt: { type: string, value: Record<string, any> }) {
    super(opt.type)
    this.value = opt.value
  }
}

export interface Options extends TileOptions {
  format?: string
  layersID?: number
  tileProxy?: string
  dpi?: number
  prjCoordSys?: {
    epsgCode: number
  }
  transparent?: boolean
  redirect?: boolean
  cacheEnabled?: boolean
  overlapDisplayed?: boolean
  overlapDisplayedOptions?: Record<string, unknown>
  tileversion?: string
  extent?: number[]
  opaque?: boolean
}

export class TileSuperMapRest extends TileImage {
  // @ts-expect-error placeholder
  private tileProxy: string | undefined
  public options: Options
  private tileSetsIndex = -1
  private tempIndex = -1
  private origin: [number, number] | undefined
  private requestParams: Record<string, string>
  private tileSets: Record<string, Record<string, any>> | undefined

  constructor(options: Options) {
    options = options || {}
    options.attributions
      = options.attributions
      || "Map Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span> with <span>© <a href='https://iclient.supermap.io' target='_blank'>SuperMap iClient</a></span>"

    options.format = options?.format ?? "png"

    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      state: options.state,
      tileClass: options.tileClass,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      wrapX: options.wrapX !== undefined ? options.wrapX : false,
    })

    this.tileProxy = options.tileProxy

    this.options = options

    this.options.dpi = this.options?.dpi ?? 96
    this.options.cacheEnabled = this.options.cacheEnabled !== false

    this.requestParams = this.getAllRequestParams()

    this.tileGrid = this.options?.tileGrid ?? this.setupTileGrid()

    const o = this.tileGrid.getOrigin(0)
    this.origin = [o[0], o[1]]
    this.requestParams.origin = JSON.stringify({
      x: o[0],
      y: o[1],
    })

    this.tileUrlFunction = this.tileUrlFunctionSM
  }

  get param() {
    return new URLSearchParams(this.requestParams).toString()
  }

  get mapUrl() {
    return `${this.options.url}/tileImage.${this.options.format}?${this.param}`
  }

  setupTileGrid() {
    if (this.options.extent) {
      return createTileGrid(this.options.extent)
    }

    if (this.projection == null) {
      throw new Error("missing projection")
    }

    return createTileGrid(this.projection.getExtent())
  }

  /**
   * @function  TileSuperMapRest.prototype.getAllRequestParams
   * @description 获取全部请求参数。
   */
  getAllRequestParams() {
    const params: Record<string, any> = {}

    params.redirect = this.options?.redirect ?? false
    params.transparent = this.options?.transparent ?? true
    params.cacheEnabled = this.options.cacheEnabled
    params._cache = params.cacheEnabled

    // 设置切片原点
    if (this.origin) {
      params.origin = JSON.stringify({
        x: this.origin[0],
        y: this.origin[1],
      })
    }

    if (this.options.prjCoordSys) {
      params.prjCoordSys = JSON.stringify(this.options.prjCoordSys)
    }

    if (this.options.layersID) {
      params.layersID = this.options.layersID.toString()
    }

    if (!this.options.overlapDisplayed) {
      params.overlapDisplayed = false
      if (this.options.overlapDisplayedOptions) {
        params.overlapDisplayedOptions = JSON.stringify(this.options.overlapDisplayedOptions)
      }
    }
    else {
      params.overlapDisplayed = true
    }

    if (params.cacheEnabled && this.options.tileversion) {
      params.tileversion = this.options.tileversion.toString()
    }
    // if (options.rasterfunction) {
    //   params.rasterfunction = JSON.stringify(options.rasterfunction)
    // }

    return params
  }

  tileUrlFunctionSM(tileCoord: [number, number, number], pixelRatio: number, projection: Projection) {
    const z = tileCoord[0]
    const x = tileCoord[1]
    const y = tileCoord[2]

    const resolution = this.tileGrid!.getResolution(z)
    const unit = projection.getUnits() || "degree"

    if (this.options.dpi == null) {
      throw new Error("undefined DPI")
    }

    const scale = resolutionToScale(resolution, this.options.dpi, unit)
    const tileSize = toSize(this.tileGrid!.getTileSize(z))

    let url
      = this.mapUrl + encodeURI(`&x=${x}&y=${y}&width=${tileSize[0]}&height=${tileSize[1]}&scale=${scale}`)

    if (!this.options.cacheEnabled) {
      url += `&_t=${new Date().getTime()}`
    }
    return url
  }

  setTileSetsInfo(
    tileSets: Record<string, Record<string, any>> | Array<Record<string, Record<string, any>>>,
  ) {
    if (Array.isArray(tileSets)) {
      this.tileSets = tileSets[0]
    }

    this.tileSets = tileSets as Record<string, Record<string, any>>

    if (!this.tileSets) {
      return
    }

    this.dispatchEvent(
      new TileChangeEvent({
        type: "tileversionschanged",
        value: {
          tileVersion: this.tileSets.tileVersions,
        },
      }),
    )
    this.changeTilesVersion()
  }

  lastTilesVersion() {
    this.tempIndex = this.tileSetsIndex - 1
    this.changeTilesVersion()
  }

  nextTilesVersion() {
    this.tempIndex = this.tileSetsIndex + 1
    this.changeTilesVersion()
  }

  changeTilesVersion() {
    if (this.tileSets == null) {
      return
    }
    if (this.tempIndex === this.tileSetsIndex || this.tempIndex < 0) {
      return
    }

    const tileVersions = this.tileSets.tileVersions
    if (tileVersions && this.tempIndex < tileVersions.length && this.tempIndex >= 0) {
      const name = tileVersions[this.tempIndex].name
      const result = this.mergeTileVersionParam(name)
      if (result) {
        this.tileSetsIndex = this.tempIndex

        this.dispatchEvent(
          new TileChangeEvent({
            type: "tileversionschanged",
            value: {
              tileVersion: tileVersions[this.tempIndex],
            },
          }),
        )
      }
    }
  }

  updateCurrentTileSetsIndex(index: number) {
    this.tempIndex = index
  }

  mergeTileVersionParam(version: string) {
    if (version) {
      this.requestParams.tileversion = version
      this.requestParams = this.getAllRequestParams()
      this.refresh()
      return true
    }
    return false
  }
}
