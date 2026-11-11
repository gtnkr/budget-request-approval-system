import { useEffect, useRef, useState } from 'react'

type BuddhistDatePickerProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

type DateParts = {
  day: string
  month: string
  year: string
}

const parseDate = (value: string): DateParts => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return { day: '', month: '', year: '' }
  return {
    day: match[3],
    month: match[2],
    year: String(Number(match[1]) + 543),
  }
}

const isValidDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function BuddhistDatePicker({ label, value, onChange }: BuddhistDatePickerProps) {
  const [parts, setParts] = useState<DateParts>(() => parseDate(value))
  const lastEmittedValue = useRef(value)
  const [currentBuddhistYear] = useState(() => new Date().getFullYear() + 543)
  const selectedYear = Number(parts.year)
  const years = Array.from({ length: 21 }, (_, index) => currentBuddhistYear - 10 + index)
  if (selectedYear && !years.includes(selectedYear)) years.push(selectedYear)
  years.sort((a, b) => a - b)

  useEffect(() => {
    if (value === lastEmittedValue.current) return
    lastEmittedValue.current = value
    setParts(parseDate(value))
  }, [value])

  const updateDate = (nextParts: DateParts) => {
    setParts(nextParts)
    if (!nextParts.day || !nextParts.month || !nextParts.year) return

    const day = Number(nextParts.day)
    const month = Number(nextParts.month)
    const year = Number(nextParts.year) - 543
    if (!isValidDate(year, month, day)) return

    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    lastEmittedValue.current = isoDate
    onChange(isoDate)
  }

  const monthDays = parts.month && parts.year
    ? new Date(Number(parts.year) - 543, Number(parts.month), 0).getDate()
    : 31

  return (
    <div className="buddhist-date-picker" role="group" aria-label={label}>
      <select
        aria-label={`วัน ${label}`}
        value={parts.day}
        onChange={(event) => updateDate({ ...parts, day: event.target.value })}
      >
        <option value="">วว</option>
        {Array.from({ length: monthDays }, (_, index) => {
          const day = String(index + 1).padStart(2, '0')
          return <option key={day} value={day}>{day}</option>
        })}
      </select>
      <span aria-hidden="true">/</span>
      <select
        aria-label={`เดือน ${label}`}
        value={parts.month}
        onChange={(event) => {
          const month = event.target.value
          const nextDay = month && parts.year
            ? String(Math.min(Number(parts.day) || 1, new Date(Number(parts.year) - 543, Number(month), 0).getDate())).padStart(2, '0')
            : parts.day
          updateDate({ ...parts, month, day: nextDay })
        }}
      >
        <option value="">ดด</option>
        {Array.from({ length: 12 }, (_, index) => {
          const month = String(index + 1).padStart(2, '0')
          return <option key={month} value={month}>{month}</option>
        })}
      </select>
      <span aria-hidden="true">/</span>
      <select
        aria-label={`ปี พ.ศ. ${label}`}
        value={parts.year}
        onChange={(event) => {
          const year = event.target.value
          const nextDay = year && parts.month
            ? String(Math.min(Number(parts.day) || 1, new Date(Number(year) - 543, Number(parts.month), 0).getDate())).padStart(2, '0')
            : parts.day
          updateDate({ ...parts, year, day: nextDay })
        }}
      >
        <option value="">พ.ศ.</option>
        {years.map((year) => <option key={year} value={String(year)}>{year}</option>)}
      </select>
    </div>
  )
}
