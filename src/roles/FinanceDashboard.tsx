import { DashboardWorkspace } from '../DashboardWorkspace'
import type { DashboardRole, RoleStatsContext } from './types'
import type { DemoUser } from './types'
import { terminalRequestStatuses } from './types'
import { ApprovalQueue } from './ApprovalQueue'
import { RoleOverview } from './RoleOverview'
import type { HomeScreenProps, WorkflowStage } from './types'

const financeWorkflow: WorkflowStage[] = [
  { label: 'รอตรวจสอบการเงิน', status: 'รอฝ่ายการเงิน', detail: 'ตรวจเอกสารและข้อมูลการจ่าย' },
  { label: 'รอเคลียร์เงินยืม', status: 'รอตรวจเคลียร์เงินยืม', detail: 'ตรวจหลักฐานหลังผู้ขอชำระคืน' },
  { label: 'ดำเนินการเสร็จสิ้น', status: 'ชำระเงินแล้ว', detail: 'บันทึกผลการจ่ายเรียบร้อย' },
]

function FinanceApprovalScreen(props: Parameters<typeof ApprovalQueue>[0]) {
  return (
    <ApprovalQueue
      {...props}
      description="ตรวจสอบการจ่ายเงินและหลักฐานตามรายการที่ผ่านการอนุมัติ"
      workflow={financeWorkflow}
    />
  )
}

function FinanceHome(props: HomeScreenProps) {
  const pendingRequests = props.allRequests.filter((request) =>
    request.status === 'รอฝ่ายการเงิน' && request.requesterId !== props.user.id,
  )

  return (
    <RoleOverview
      {...props}
      title="ภาพรวมงานฝ่ายการเงิน"
      description="สรุปรายการรอตรวจการจ่ายและติดตามคำขอที่ต้องดำเนินการ"
      urgentTitle="รายการรอตรวจการเงิน"
      urgentRequests={pendingRequests}
      showBudget
    />
  )
}

const financeDashboard: DashboardRole = {
  ApprovalScreen: FinanceApprovalScreen,
  HomeScreen: FinanceHome,
  workflow: financeWorkflow,
  initialSection: 'ภาพรวม',
  approvalMenuItem: 'ตรวจสอบการเงิน',
  overviewListMenuItem: 'ตรวจสอบการเงิน',
  getMenu: (canCreateRequest) =>
    canCreateRequest
      ? ['ภาพรวม', 'สร้างคำขอใหม่', 'คำขอของฉัน', 'ตรวจสอบการเงิน', 'ติดตามเงินยืม']
      : ['ภาพรวม', 'ตรวจสอบการเงิน', 'ติดตามเงินยืม'],
  getCreationPolicy: (user) =>
    `ฝ่ายการเงิน (${user.name}) สร้างคำขอเบิกจ่ายได้โดยใช้งบฝ่ายการเงิน คำขอของตนจะไม่ส่งกลับมาตรวจโดยฝ่ายการเงิน`,
  getApprovalScopeDescription: () =>
    'ตรวจสอบการจ่ายเงินหลังผ่านการอนุมัติ โดยไม่อนุมัติคำขอที่ฝ่ายการเงินเป็นผู้ขอ',
  canReviewRequest: (request, activeSection, user) =>
    !terminalRequestStatuses.includes(request.status) &&
    request.requesterId !== user.id &&
    (activeSection === 'ติดตามเงินยืม'
      ? request.status === 'รอตรวจเคลียร์เงินยืม'
      : request.status === 'รอฝ่ายการเงิน'),
  getStats: ({ allRequests, myRequests, approvalCandidates, money }: RoleStatsContext) => [
    [
      'รอตรวจสอบการเงิน',
      `${approvalCandidates.filter((item) => item.status === 'รอฝ่ายการเงิน').length} รายการ`,
      'ทุกหน่วยงาน',
    ],
    [
      'วงเงินรอตรวจ',
      money(approvalCandidates.reduce((total, item) => total + Number(item.amount || 0), 0)),
      'รวมเฉพาะคิวการเงิน',
    ],
    [
      'รอตรวจหลักฐานเงินยืม',
      `${allRequests.filter((item) => item.status === 'รอตรวจเคลียร์เงินยืม').length} รายการ`,
      'ติดตามหลักฐาน',
    ],
    ['คำขอของฉัน', `${myRequests.length} รายการ`, 'ผู้ขอฝ่ายการเงิน'],
  ],
}

export function FinanceDashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  return <DashboardWorkspace user={user} logout={logout} role={financeDashboard} />
}
