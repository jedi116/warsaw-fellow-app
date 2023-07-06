
export const parseString = (value: string | boolean | undefined, defaultValue: string) => {
    if (typeof value === 'undefined') {
      return defaultValue
    }
    if (typeof value === 'boolean') {
      return defaultValue
    }
    if (typeof value === 'string') {
      return value
    }
}