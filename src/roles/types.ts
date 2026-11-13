import type { ComponentType, ReactNode } from 'react'

export type DemoUser = {
  id: string
  username: string
  password: string
  label: string
  name: string
  unit: string
  canCreateRequest?: boolean
}

export type RoleRequest = {
  status: string
  requesterId?: string
  unit?: string
  amount?: number
  code?: string
  title?: string
  requester?: string
  date?: string
  approvalHistory?: Array<{
    step?: string
    label?: string
    result?: string
    actor?: string
    date?: string
    comment?: string
  }>
}

export type RoleBudget = {
  total: number
  used: number
  scope: string
}

export type RoleStat = [label: string, value: string, detail: string]

export type DashboardRecord = Record<string, any>

export type ApprovalScreenProps = {
  activeSection: string
  user: DemoUser
  message: string
  approvalScopeDescription: string
  candidates: RoleRequest[]
  formatMoney: (amount: number) => string
  onSelectRequest: (request: RoleRequest) => void
  requestDetails: ReactNode
  queueTitle?: string
  workflow: Array<{ label: string; status: string; detail: string }>
}

export type HomeScreenProps = {
  user: DemoUser
  stats: RoleStat[]
  myRequests: RoleRequest[]
  allRequests: RoleRequest[]
  approvalCandidates: RoleRequest[]
  urgentRequests: RoleRequest[]
  urgentTitle: string
  roleBudget: RoleBudget
  committedAmount: number
  formatMoney: (amount: number) => string
  message: string
  approvalScopeDescription: string
  onOpenList: () => void
  onOpenMyRequests: () => void
  showMyRequests: boolean
  onSelectRequest: (request: RoleRequest) => void
}

export type WorkflowStage = {
  label: string
  status: string
  detail: string
}

export type AdminScreenProps = {
  activeSection: string
  allRequests: DashboardRecord[]
  auditEntries: Array<{ actor: string; action: string; code: string; date: string }>
  approvalOverrides: Record<string, string>
  formatMoney: (amount: number) => string
  onSelectRequest: (request: DashboardRecord) => void
  requestDetails: ReactNode
}

export type RoleStatsContext = {
  user: DemoUser
  allRequests: RoleRequest[]
  myRequests: RoleRequest[]
  approvalCandidates: RoleRequest[]
  auditEntries: unknown[]
  roleBudget: RoleBudget
  committedAmount: number
  money: (amount: number) => string
}

export type DashboardRole = {
  ApprovalScreen: ComponentType<ApprovalScreenProps>
  HomeScreen?: ComponentType<HomeScreenProps>
  AdminScreen?: ComponentType<AdminScreenProps>
  homeTitle?: string
  homeDescription?: string
  workflow: WorkflowStage[]
  initialSection: string
  approvalMenuItem: string
  overviewListMenuItem?: string
  getMenu: (canCreateRequest: boolean) => string[]
  getCreationPolicy: (user: DemoUser) => string
  getApprovalScopeDescription: (user: DemoUser) => string
  canReviewRequest: (request: RoleRequest, activeSection: string, user: DemoUser) => boolean
  getStats: (context: RoleStatsContext) => RoleStat[]
}

export const terminalRequestStatuses = [
  'อนุมัติแล้ว',
  'ชำระเงินแล้ว',
  'ปิดรายการแล้ว',
  'ไม่อนุมัติ',
  'ส่งแก้ไข',
  'ฉบับร่าง',
]

export const completedRequestStatuses = ['อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว']

export function getStatusToneClass(status: string) {
  if (['รอหัวหน้าแผนก', 'รอผู้บริหาร', 'รอคณะกรรมการตรวจสอบ', 'รอฝ่ายการเงิน', 'รอเคลียร์เงินยืม', 'รอตรวจเคลียร์เงินยืม'].includes(status)) {
    return 'status--pending'
  }
  if (['อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว', 'ใช้งาน'].includes(status)) {
    return 'status--approved'
  }
  if (status === 'ส่งแก้ไข') return 'status--revision'
  if (status === 'ไม่อนุมัติ') return 'status--rejected'
  if (status === 'ฉบับร่าง') return 'status--draft'
  return 'status--neutral'
}
