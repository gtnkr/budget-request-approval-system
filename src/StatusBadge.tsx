import type { ReactNode } from 'react'
import { statusStyles } from './statusStyles'

type StatusBadgeProps = {
  status: string
  children?: ReactNode
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const style = statusStyles[status] ?? (status.startsWith('รอ') ? statusStyles['กำลังรอ'] : statusStyles.default)

  return <span className={`status ${style}`}>{children ?? status}</span>
}
