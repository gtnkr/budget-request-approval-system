import { DashboardWorkspace } from '../DashboardWorkspace'
import type { DashboardRole, RoleStatsContext } from './types'
import type { DemoUser } from './types'
import { terminalRequestStatuses } from './types'
import { ApprovalQueue } from './ApprovalQueue'
import { RoleOverview } from './RoleOverview'
import type { HomeScreenProps, WorkflowStage } from './types'

const departmentWorkflow: WorkflowStage[] = [
  { label: 'หัวหน้าแผนกตรวจสอบ', status: 'รอหัวหน้าแผนก', detail: 'คำขอของหน่วยงานรอพิจารณาลำดับแรก' },
  { label: 'ผู้บริหารพิจารณา', status: 'รอผู้บริหาร', detail: 'ส่งต่อเมื่อวงเงินเกิน 10,000 บาท' },
  { label: 'ฝ่ายการเงินดำเนินการ', status: 'รอฝ่ายการเงิน', detail: 'ตรวจสอบและบันทึกการจ่ายเงิน' },
]

function DepartmentHeadApprovalScreen(props: Parameters<typeof ApprovalQueue>[0]) {
  return (
    <ApprovalQueue
      {...props}
      queueTitle="คิวรออนุมัติประจำแผนก"
      description="ตรวจคำขอจากหน่วยงานของตนและพิจารณาเป็นลำดับแรก"
      workflow={departmentWorkflow}
    />
  )
}

function DepartmentHeadHome(props: HomeScreenProps) {
  return (
    <RoleOverview
      {...props}
      title="ภาพรวมงานหัวหน้าแผนก"
      description="ตรวจคำขอของหน่วยงานในลำดับแรก และติดตามวงเงินของแผนก"
      urgentTitle="คำขอรออนุมัติในแผนก"
      urgentRequests={props.approvalCandidates}
    />
  )
}

const departmentHeadDashboard: DashboardRole = {
  ApprovalScreen: DepartmentHeadApprovalScreen,
  HomeScreen: DepartmentHeadHome,
  initialSection: 'ภาพรวม',
  homeTitle: 'ภาพรวมงานหัวหน้าแผนก',
  homeDescription: 'ตรวจคำขอของหน่วยงานในลำดับแรก และติดตามวงเงินของแผนก',
  workflow: departmentWorkflow,
  approvalMenuItem: 'รออนุมัติแผนก',
  getMenu: (canCreateRequest) =>
    canCreateRequest
      ? ['ภาพรวม', 'สร้างคำขอใหม่', 'คำขอของฉัน', 'รออนุมัติแผนก']
      : ['ภาพรวม', 'รออนุมัติแผนก'],
  getCreationPolicy: (user) =>
    `หัวหน้าแผนก (${user.name}) สร้างคำขอได้ และคำขอจะข้ามขั้นอนุมัติหัวหน้าแผนกของตนเอง`,
  getApprovalScopeDescription: () =>
    'อนุมัติคำขอของแผนกตัวเองในลำดับแรก และคำขอของตนเองจะข้ามขั้นนี้',
  canReviewRequest: (request, _activeSection, user) =>
    !terminalRequestStatuses.includes(request.status) &&
    request.requesterId !== user.id &&
    request.status === 'รอหัวหน้าแผนก' &&
    request.unit === user.unit,
  getStats: ({ user, myRequests, approvalCandidates }: RoleStatsContext) => [
    ['รออนุมัติแผนก', `${approvalCandidates.length} รายการ`, user.unit],
    ['คำขอของฉัน', `${myRequests.length} รายการ`, 'สร้างโดยบัญชีนี้'],
    ['ส่งแก้ไข', `${myRequests.filter((item) => item.status === 'ส่งแก้ไข').length} รายการ`, 'คำขอของหัวหน้าแผนก'],
  ],
}

export function DepartmentHeadDashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  return <DashboardWorkspace user={user} logout={logout} role={departmentHeadDashboard} />
}
