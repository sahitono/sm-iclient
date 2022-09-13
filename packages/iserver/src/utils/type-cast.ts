export function isNumeric(num: any) {
  return (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) && !isNaN(num as number)
}

export function parseString(val: string): string | number {
  if (!isNumeric(val as any)) {
    return val
  }

  return parseFloat(val)
}
