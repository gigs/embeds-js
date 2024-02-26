/**
 * Removes any empty, null or undefined values from submit data, to make sure
 * we never submit any empty data to the API which resets already filled-out
 * porting fields.
 */
export function sanitizeSubmitData<T extends Record<string, unknown>>(data: T) {
  const sanitizedData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined,
    ),
  )

  return sanitizedData
}
