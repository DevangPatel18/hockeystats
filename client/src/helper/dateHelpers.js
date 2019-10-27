export const getCurrentSeasonId = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const seasonStart = currentMonth > 8 ? currentYear : currentYear - 1
  return `${seasonStart}${seasonStart + 1}`
}
