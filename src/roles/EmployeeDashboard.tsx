import { DashboardWorkspace } from '../DashboardWorkspace'
import type { DashboardRole, RoleStatsContext } from './types'
import type { DemoUser } from './types'
import { ApprovalQueue } from './ApprovalQueue'
import { RoleOverview } from './RoleOverview'
import type { HomeScreenProps, WorkflowStage } from './types'

const employeeWorkflow: WorkflowStage[] = [
  { label: 'ส่งคำขอ', status: 'รอหัวหน้าแผนก', detail: 'ส่งคำขอให้หัวหน้าแผนกตรวจสอบ' },
  { label: 'รอพิจารณา', status: 'รอผู้บริหาร', detail: 'คำขอวงเงินเกิน 10,000 บาท' },
  { label: 'รอการเงิน', status: 'รอฝ่ายการเงิน', detail: 'รอตรวจสอบและดำเนินการจ่าย' },
]

function EmployeeApprovalScreen(props: Parameters<typeof ApprovalQueue>[0]) {
  return (
    <ApprovalQueue
      {...props}
      description="พนักงานติดตามคำขอของตนเอง ไม่มีสิทธิ์อนุมัติคำขอ"
      workflow={employeeWorkflow}
    />
  )
}

function EmployeeHome(props: HomeScreenProps) {
  const activeRequests = props.myRequests
    .filter((request) => !['ฉบับร่าง', 'อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว', 'ไม่อนุมัติ'].includes(request.status))
    .sort((left, right) => Number(right.status === 'ส่งแก้ไข') - Number(left.status === 'ส่งแก้ไข'))

  return (
    <RoleOverview
      {...props}
      title="ภาพรวมคำขอของฉัน"
      description="ติดตามสถานะและรายการที่ต้องดำเนินการต่อ"
      urgentTitle="คำขอที่ต้องติดตาม"
      onOpenList={props.onOpenList}
      urgentRequests={activeRequests}
      showBudget
    />
  )
}

const employeeDashboard: DashboardRole = {
  ApprovalScreen: EmployeeApprovalScreen,
  HomeScreen: EmployeeHome,
  workflow: employeeWorkflow,
  initialSection: 'ภาพรวม',
  approvalMenuItem: 'รายการคำขอ',
  overviewListMenuItem: 'คำขอของฉัน',
  getMenu: () => ['ภาพรวม', 'สร้างคำขอใหม่', 'คำขอของฉัน'],
  getCreationPolicy: (user) =>
    `พนักงาน (${user.name}) สร้างและติดตามคำขอของตนเองได้ โดยระบบกำหนดผู้ขอและหน่วยงานจากบัญชีที่เข้าสู่ระบบ`,
  getApprovalScopeDescription: () => 'พนักงานสร้างและติดตามคำขอของตนเองเท่านั้น ไม่มีสิทธิ์อนุมัติ',
  canReviewRequest: () => false,
  getStats: ({ myRequests }: RoleStatsContext) => [
    ['คำขอของฉัน', `${myRequests.length} รายการ`, 'รวมทุกสถานะ'],
    [
      'รอดำเนินการ',
      `${myRequests.filter((item) => !['อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว', 'ไม่อนุมัติ'].includes(item.status)).length} รายการ`,
      'กำลังดำเนินการ',
    ],
    [`ส่งแก้ไข`, `${myRequests.filter((item) => item.status === 'ส่งแก้ไข').length} รายการ`, 'ต้องตรวจสอบ'],
  ],
}

export function EmployeeDashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  return <DashboardWorkspace user={user} logout={logout} role={employeeDashboard} />
}
