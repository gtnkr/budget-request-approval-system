import { DashboardWorkspace } from '../DashboardWorkspace'
import type { DashboardRole, DemoUser, RoleRequest, RoleStatsContext, RoleStat, WorkflowStage, HomeScreenProps } from './types'
import { completedRequestStatuses, terminalRequestStatuses } from './types'
import { ApprovalQueue } from './ApprovalQueue'
import { RoleOverview } from './RoleOverview'

// 1. ลำดับอนุมัติระดับองค์กร
const executiveWorkflow: WorkflowStage[] = [
  { label: 'หัวหน้าแผนกตรวจสอบ', status: 'รอหัวหน้าแผนก', detail: 'คำขอหน่วยงานรอการตรวจสอบเบื้องต้น' },
  { label: 'ผู้บริหารพิจารณา', status: 'รอผู้บริหาร', detail: 'คิวอนุมัติคำขอวงเงินเกิน 10,000 บาท' },
  { label: 'คณะกรรมการตรวจสอบ', status: 'รอคณะกรรมการตรวจสอบ', detail: 'ใช้กับคำขอที่ผู้บริหารเป็นผู้ขอ' },
  { label: 'ฝ่ายการเงินดำเนินการ', status: 'รอฝ่ายการเงิน', detail: 'ตรวจสอบและบันทึกการจ่ายเงิน' },
]

// 2. หน้าจอคิวอนุมัติและภาพรวมของผู้บริหาร
function ExecutiveApprovalScreen(props: Parameters<typeof ApprovalQueue>[0]) {
  return (
    <ApprovalQueue
      {...props}
      queueTitle="คิวพิจารณาระดับองค์กร"
      description="พิจารณาคำขอที่เกินวงเงินอำนาจ และส่งต่อฝ่ายการเงิน"
      workflow={executiveWorkflow}
    />
  )
}

function ExecutiveHome(props: HomeScreenProps) {
  return (
    <RoleOverview
      {...props}
      title="ภาพรวมการอนุมัติระดับองค์กร"
      description="ติดตามคิวอนุมัติ วงเงินรวม และคำขอของผู้บริหารที่ส่งให้คณะกรรมการตรวจสอบ"
      urgentTitle="คำขอรออนุมัติ"
      urgentRequests={props.approvalCandidates}
    />
  )
}

// 3. กติกาสิทธิ์และสถิติของผู้บริหาร
function canExecutiveReviewRequest(request: RoleRequest, user: DemoUser) {
  return (
    !terminalRequestStatuses.includes(request.status) &&
    request.requesterId !== user.id &&
    request.status === 'รอผู้บริหาร'
  )
}

function getExecutiveStats({ myRequests, approvalCandidates, money }: RoleStatsContext): RoleStat[] {
  return [
    ['คำขอรออนุมัติ', `${approvalCandidates.length} รายการ`, 'คิวผู้บริหาร'],
    ['วงเงินรออนุมัติ', money(approvalCandidates.reduce((total, item) => total + Number(item.amount || 0), 0)), 'รวมคำขอในคิว'],
    [
      'คำขอของฉันเสร็จแล้ว',
      `${myRequests.filter((item) => completedRequestStatuses.includes(item.status)).length} รายการ`,
      'ผู้ขอบทบาทผู้บริหาร',
    ],
  ]
}

const executiveDashboard: DashboardRole = {
  ApprovalScreen: ExecutiveApprovalScreen,
  HomeScreen: ExecutiveHome,
  initialSection: 'ภาพรวม',
  homeTitle: 'ภาพรวมการอนุมัติระดับองค์กร',
  homeDescription: 'ติดตามคิวอนุมัติ วงเงินรวม และคำขอที่ส่งให้คณะกรรมการตรวจสอบ',
  workflow: executiveWorkflow,
  approvalMenuItem: 'อนุมัติองค์กร',
  getMenu: (canCreateRequest) =>
    canCreateRequest
      ? ['ภาพรวม', 'สร้างคำขอใหม่', 'คำขอของฉัน', 'อนุมัติองค์กร']
      : ['ภาพรวม', 'อนุมัติองค์กร'],
  getCreationPolicy: (user) =>
    `ผู้บริหาร (${user.name}) สร้างคำขอได้ทุกวงเงิน คำขอของผู้บริหารจะส่งคณะกรรมการตรวจสอบแทนการอนุมัติด้วยตนเอง`,
  getApprovalScopeDescription: () =>
    'อนุมัติคำขอเกิน 10,000 บาททุกหน่วยงาน คำขอของผู้บริหารเองส่งคณะกรรมการตรวจสอบแทน',
  canReviewRequest: (request, _activeSection, user) => canExecutiveReviewRequest(request, user),
  getStats: getExecutiveStats,
}

export function ExecutiveDashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  return <DashboardWorkspace user={user} logout={logout} role={executiveDashboard} />
}
