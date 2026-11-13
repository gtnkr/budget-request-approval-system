const thaiDateFormatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatThaiDate(value?: string | null) {
  if (!value) return ''

  const dateValue = value.trim()
  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateValue)
  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(.+))?$/.exec(dateValue)
  if (!isoMatch && !slashMatch) return dateValue

  const year = Number(isoMatch?.[1] ?? slashMatch?.[3])
  const month = Number(isoMatch?.[2] ?? slashMatch?.[2])
  const day = Number(isoMatch?.[3] ?? slashMatch?.[1])
  const gregorianYear = year > 2400 ? year - 543 : year
  const date = new Date(gregorianYear, month - 1, day)

  if (
    date.getFullYear() !== gregorianYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return dateValue
  }

  const formattedDate = thaiDateFormatter.format(date)
  const time = slashMatch?.[4]
  return time ? `${formattedDate} ${time}` : formattedDate
}
