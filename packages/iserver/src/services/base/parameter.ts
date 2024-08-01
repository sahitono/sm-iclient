export interface BaseParameter {
  token?: string
}

export function parseBaseParameter<T extends BaseParameter>(param: T): Record<string, string> {
  return Object.hasOwn(param, "token") ? { token: param.token! } : {}
}
