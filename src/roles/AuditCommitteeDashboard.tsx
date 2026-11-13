import { DashboardWorkspace } from '../DashboardWorkspace'
import type { DashboardRole, RoleStatsContext } from './types'
import type { DemoUser } from './types'
import { terminalRequestStatuses } from './types'
import { ApprovalQueue } from './ApprovalQueue'
import { RoleOverview } from './RoleOverview'
import type { HomeScreenProps, WorkflowStage } from './types'

const committeeWorkflow: WorkflowStage[] = [
  { label: 'รอตรวจสอบโดยคณะกรรมการ', status: 'รอคณะกรรมการตรวจสอบ', detail: 'พิจารณาคำขอที่ผู้บริหารเป็นผู้ขอ' },
  { label: 'ผ่านการตรวจสอบ', status: 'รอฝ่ายการเงิน', detail: 'ส่งต่อฝ่ายการเงินหลังคณะกรรมการอนุมัติ' },
  { label: 'ดำเนินการเสร็จสิ้น', status: 'ชำระเงินแล้ว', detail: 'ฝ่ายการเงินบันทึกการจ่ายเงินแล้ว' },
]

function AuditCommitteeApprovalScreen(props: Parameters<typeof ApprovalQueue>[0]) {
  return (
    <ApprovalQueue
      {...props}
      queueTitle="คิวตรวจสอบอิสระ"
      description="ตรวจสอบคำขอของผู้บริหารอย่างเป็นอิสระ ก่อนส่งต่อฝ่ายการเงิน"
      workflow={committeeWorkflow}
    />
  )
}

function AuditCommitteeHome(props: HomeScreenProps) {
  return (
    <RoleOverview
      {...props}
      title="ภาพรวมคณะกรรมการตรวจสอบ"
      description="สรุปคิวตรวจสอบและรายการสำคัญ โดยดำเนินการพิจารณาในเมนูคิวตรวจสอบ"
      urgentTitle="คำขอรอตรวจสอบ"
      urgentRequests={props.approvalCandidates}
      showBudget={false}
    />
  )
}

const auditCommitteeDashboard: DashboardRole = {
  ApprovalScreen: AuditCommitteeApprovalScreen,
  HomeScreen: AuditCommitteeHome,
  initialSection: 'ภาพรวม',
  homeTitle: 'ภาพรวมการตรวจสอบอิสระ',
  homeDescription: 'พิจารณาคำขอของผู้บริหารและติดตามการส่งต่อฝ่ายการเงิน',
  workflow: committeeWorkflow,
  approvalMenuItem: 'อนุมัติตรวจสอบ',
  getMenu: () => ['ภาพรวม', 'อนุมัติตรวจสอบ'],
  getCreationPolicy: () =>
    'คณะกรรมการตรวจสอบมีสิทธิ์ตรวจและอนุมัติคำขอของผู้บริหารเท่านั้น ไม่มีสิทธิ์สร้างคำขอ',
  getApprovalScopeDescription: () =>
    'ตรวจและอนุมัติคำขอของผู้บริหารเพื่อป้องกันการอนุมัติด้วยตนเอง ก่อนส่งต่อฝ่ายการเงิน',
  canReviewRequest: (request, _activeSection, user) =>
    !terminalRequestStatuses.includes(request.status) &&
    request.requesterId !== user.id &&
    request.status === 'รอคณะกรรมการตรวจสอบ',
  getStats: ({ allRequests, approvalCandidates, money }: RoleStatsContext) => [
    ['รอตรวจสอบ', `${approvalCandidates.length} รายการ`, 'คิวคณะกรรมการ'],
    [
      'วงเงินรอตรวจ',
      money(approvalCandidates.reduce((total, request) => total + Number(request.amount || 0), 0)),
      'คำขอในคิว',
    ],
    [
      'ส่งต่อฝ่ายการเงิน',
      `${allRequests.filter((request) => request.requesterId === 'executive' && request.status === 'รอฝ่ายการเงิน').length} รายการ`,
      'ผ่านการตรวจสอบแล้ว',
    ],
    [
      'ปิดรายการแล้ว',
      `${allRequests.filter((request) => request.requesterId === 'executive' && ['ชำระเงินแล้ว', 'ปิดรายการแล้ว'].includes(request.status)).length} รายการ`,
      'คำขอผู้บริหาร',
    ],
  ],
}

export function AuditCommitteeDashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  return <DashboardWorkspace user={user} logout={logout} role={auditCommitteeDashboard} />
}
