import type { ComponentType } from 'react'
import type { DemoUser } from './roles/types'
import { AdminDashboard } from './roles/AdminDashboard'
import { AuditCommitteeDashboard } from './roles/AuditCommitteeDashboard'
import { DepartmentHeadDashboard } from './roles/DepartmentHeadDashboard'
import { EmployeeDashboard } from './roles/EmployeeDashboard'
import { ExecutiveDashboard } from './roles/ExecutiveDashboard'
import { FinanceDashboard } from './roles/FinanceDashboard'

type DashboardProps = {
  user: DemoUser
  logout: () => void
}

const roleDashboards: Record<string, ComponentType<DashboardProps>> = {
  employee: EmployeeDashboard,
  'department-head': DepartmentHeadDashboard,
  executive: ExecutiveDashboard,
  finance: FinanceDashboard,
  committee: AuditCommitteeDashboard,
  admin: AdminDashboard,
}

export function Dashboard({ user, logout }: DashboardProps) {
  const RoleDashboard = roleDashboards[user.id]
  if (!RoleDashboard) {
    throw new Error(`ไม่พบการตั้งค่าหน้าสำหรับบทบาท "${user.id}"`)
  }

  return <RoleDashboard user={user} logout={logout} />
}
