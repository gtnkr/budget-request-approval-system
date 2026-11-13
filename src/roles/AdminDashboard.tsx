import { DashboardWorkspace } from '../DashboardWorkspace'
import { getStatusToneClass } from './types'
import { formatThaiDate } from './dateFormat'
import type { AdminScreenProps, DashboardRole, HomeScreenProps, RoleStatsContext } from './types'
import type { DemoUser } from './types'
import { ApprovalQueue } from './ApprovalQueue'
import { RoleOverview } from './RoleOverview'
import type { WorkflowStage } from './types'

const adminWorkflow: WorkflowStage[] = [
  { label: 'ติดตามผู้ใช้งาน', status: 'ใช้งาน', detail: 'บัญชีและบทบาทในระบบสาธิต' },
  { label: 'ติดตามคำขอ', status: 'รอผู้บริหาร', detail: 'ดูภาพรวมคำขอและสถานะ' },
  { label: 'ตรวจประวัติระบบ', status: 'ดำเนินการ', detail: 'ตรวจสอบกิจกรรมของผู้ใช้งาน' },
]

const demoAccounts = [
  { role: 'พนักงาน', login: 'พนักงาน', name: 'พิมพ์ชนก วัฒนากุล', unit: 'แผนกเทคโนโลยี', permissions: 'สร้างและติดตามคำขอของตนเอง' },
  { role: 'หัวหน้าแผนก', login: 'หัวหน้าแผนก', name: 'ธนกร ศรีสวัสดิ์', unit: 'แผนกเทคโนโลยี', permissions: 'สร้าง/ติดตามคำขอ และอนุมัติคำขอแผนกในลำดับแรก' },
  { role: 'ผู้บริหาร', login: 'ผู้บริหาร', name: 'กิตติพงษ์ วัฒนชัย', unit: 'ผู้บริหารองค์กร', permissions: 'สร้างคำขอ และอนุมัติคำขอเกิน 10,000 บาท' },
  { role: 'ฝ่ายการเงิน', login: 'ฝ่ายการเงิน', name: 'อรทัย พูลสวัสดิ์', unit: 'ฝ่ายการเงิน', permissions: 'สร้างคำขอเบิกจ่าย และตรวจสอบการจ่ายโดยไม่อนุมัติคำขอตนเอง' },
  { role: 'คณะกรรมการตรวจสอบ', login: 'คณะกรรมการตรวจสอบ', name: 'ณัฐกานต์ วงศ์ประเสริฐ', unit: 'คณะกรรมการตรวจสอบภายใน', permissions: 'อนุมัติคำขอของผู้บริหาร' },
  { role: 'แอดมิน', login: 'แอดมิน', name: 'ภาคิน นาคเจริญ', unit: 'ฝ่ายระบบสารสนเทศ', permissions: 'ดูแลข้อมูลสาธิต ผู้ใช้งาน บทบาท หน่วยงาน และวงเงิน' },
]

const rolePermissionRows = [
  ['พนักงาน', 'สร้างคำขอ', 'ติดตามคำขอตนเอง', '—'],
  ['หัวหน้าแผนก', 'สร้างคำขอ', 'ติดตามคำขอตนเอง', 'อนุมัติคำขอแผนกในลำดับแรก'],
  ['ผู้บริหาร', 'สร้างคำขอ', 'ติดตามคำขอตนเอง', 'อนุมัติ > 10,000 บาท'],
  ['ฝ่ายการเงิน', 'สร้างคำขอเบิกจ่าย', 'ติดตามคำขอตนเอง', 'ตรวจสอบการจ่าย ยกเว้นคำขอตนเอง'],
  ['คณะกรรมการตรวจสอบ', '—', '—', 'อนุมัติคำขอผู้บริหาร'],
  ['แอดมิน', '—', '—', 'ดูแลข้อมูลระบบ ไม่มีสิทธิ์อนุมัติ'],
]

function AdminApprovalScreen(props: Parameters<typeof ApprovalQueue>[0]) {
  return (
    <ApprovalQueue
      {...props}
      description="ผู้ดูแลระบบไม่มีสิทธิ์อนุมัติคำขอ"
      workflow={adminWorkflow}
    />
  )
}

function AdminHome(props: HomeScreenProps) {
  const recentRequests = [...props.allRequests].slice(-3).reverse()

  return (
    <RoleOverview
      {...props}
      title="ภาพรวมผู้ดูแลระบบ"
      description="สรุปสถานะข้อมูลและทางลัดไปยังรายการที่ต้องดูแล"
      urgentTitle="คำขอล่าสุดในระบบ"
      urgentRequests={recentRequests}
      showBudget={false}
    />
  )
}

function AdminManagementScreen({
  activeSection,
  allRequests,
  auditEntries,
  approvalOverrides,
  formatMoney,
  onSelectRequest,
  requestDetails,
}: AdminScreenProps) {
  return (
    <section className="panel management-page">
      <div className="panel-header">
        <div><h2>{activeSection}</h2><p>ข้อมูลสำหรับบัญชีสาธิตในเบราว์เซอร์นี้</p></div>
      </div>
      {activeSection === 'ผู้ใช้งาน' ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>ชื่อผู้ใช้</th><th>บทบาท</th><th>หน่วยงาน</th><th>สิทธิ์โดยสรุป</th><th>สถานะ</th></tr></thead>
            <tbody>{demoAccounts.map((account) => (
              <tr key={account.role}>
                <td><strong>{account.login}</strong><small>{account.name}</small></td>
                <td>{account.role}</td><td>{account.unit}</td><td>{account.permissions}</td>
                <td><span className={`status ${getStatusToneClass('ใช้งาน')}`}>ใช้งาน</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : activeSection === 'บทบาทและสิทธิ์' ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>บทบาท</th><th>สร้างคำขอ</th><th>ติดตาม</th><th>อนุมัติ / ตรวจสอบ</th></tr></thead>
            <tbody>{rolePermissionRows.map((row) => (
              <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      ) : activeSection === 'หน่วยงาน' ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>หน่วยงาน</th><th>บัญชีสาธิต</th><th>คำขอในระบบ</th></tr></thead>
            <tbody>{[...new Set([...demoAccounts.map((account) => account.unit), ...allRequests.map((item) => item.unit)])].map((unit) => (
              <tr key={unit}>
                <td><strong>{unit}</strong></td>
                <td>{demoAccounts.filter((account) => account.unit === unit).length}</td>
                <td>{allRequests.filter((item) => item.unit === unit).length}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : activeSection === 'วงเงินอนุมัติ' ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>เงื่อนไขวงเงิน</th><th>สายอนุมัติ</th><th>ข้อยกเว้น</th></tr></thead>
            <tbody>
              <tr><td>ไม่เกิน 10,000 บาท</td><td>หัวหน้าแผนก → ฝ่ายการเงิน</td><td>ผู้ขอที่เป็นหัวหน้าแผนกข้ามขั้นหัวหน้าแผนก</td></tr>
              <tr><td>มากกว่า 10,000 บาท</td><td>หัวหน้าแผนก → ผู้บริหาร → ฝ่ายการเงิน</td><td>คำขอหัวหน้าแผนกข้ามขั้นตนเอง; ผู้บริหารอนุมัติคำขอตนเองไม่ได้</td></tr>
              <tr><td>คำขอของผู้บริหาร</td><td>คณะกรรมการตรวจสอบ → ฝ่ายการเงิน</td><td>แยกผู้อนุมัติออกจากผู้ขอ</td></tr>
              <tr><td>คำขอของฝ่ายการเงิน</td><td>ผู้บริหาร</td><td>ข้ามการตรวจของหัวหน้าแผนกที่ไม่ตรงหน่วยงาน และไม่ส่งกลับให้ผู้ขออนุมัติการจ่าย</td></tr>
            </tbody>
          </table>
        </div>
      ) : activeSection === 'คำขอทั้งหมด' ? (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>เลขที่คำขอ</th><th>รายการ / ผู้ขอ</th><th>หน่วยงาน</th><th>วงเงิน</th><th>สถานะ</th><th>รายละเอียด</th></tr></thead>
              <tbody>{allRequests.map((item) => (
                <tr key={item.code}>
                  <td><strong>{item.code}</strong><small>{formatThaiDate(item.date)}</small></td>
                  <td><strong>{item.title}</strong><small>{item.requester} • {item.requesterRole}</small></td>
                  <td>{item.unit}</td><td>{formatMoney(item.amount)}</td>
                  <td><span className={`status ${getStatusToneClass(approvalOverrides[item.code] ?? item.status)}`}>{approvalOverrides[item.code] ?? item.status}</span></td>
                  <td><button type="button" className="view-detail" onClick={() => onSelectRequest(item)}>ดูข้อมูลครบ</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {requestDetails}
        </>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>วันเวลา</th><th>ผู้ดำเนินการ</th><th>กิจกรรม</th><th>เลขที่คำขอ</th></tr></thead>
            <tbody>{auditEntries.map((entry, index) => (
              <tr key={`${entry.code}-${index}`}><td>{formatThaiDate(entry.date)}</td><td>{entry.actor}</td><td>{entry.action}</td><td>{entry.code}</td></tr>
            ))}</tbody>
          </table>
          {auditEntries.length === 0 && (
            <div className="empty-approval">ยังไม่มีกิจกรรมในประวัติระบบ การสร้างหรือพิจารณาคำขอจะแสดงที่นี่</div>
          )}
        </div>
      )}
      <p className="management-note">หน้านี้เป็นข้อมูลสาธิตแบบ client-side ไม่ได้เชื่อมฐานข้อมูลหรือระบบจัดการบัญชีจริง</p>
    </section>
  )
}

const adminDashboard: DashboardRole = {
  ApprovalScreen: AdminApprovalScreen,
  HomeScreen: AdminHome,
  workflow: adminWorkflow,
  AdminScreen: AdminManagementScreen,
  initialSection: 'ภาพรวม',
  approvalMenuItem: 'รายการคำขอ',
  overviewListMenuItem: 'คำขอทั้งหมด',
  getMenu: () => ['ภาพรวม', 'ผู้ใช้งาน', 'บทบาทและสิทธิ์', 'หน่วยงาน', 'วงเงินอนุมัติ', 'คำขอทั้งหมด', 'ประวัติระบบ'],
  getCreationPolicy: () =>
    'แอดมินไม่มีสิทธิ์สร้างหรืออนุมัติคำขอ ใช้สำหรับจัดการผู้ใช้งานและกำหนดสิทธิ์ของระบบ',
  getApprovalScopeDescription: () =>
    'แอดมินจัดการบัญชีและสิทธิ์เท่านั้น ไม่มีสิทธิ์อนุมัติคำขอ',
  canReviewRequest: () => false,
  getStats: ({ allRequests, auditEntries }: RoleStatsContext) => [
    ['ผู้ใช้งาน', '6 บัญชี', 'บัญชีสาธิต'],
    ['บทบาท', '6 บทบาท', 'กำหนดสิทธิ์'],
    ['คำขอทั้งหมด', `${allRequests.length} รายการ`, 'รวมข้อมูลสาธิต'],
    ['ประวัติระบบ', `${auditEntries.length} รายการ`, 'กิจกรรมล่าสุด'],
  ],
}

export function AdminDashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  return <DashboardWorkspace user={user} logout={logout} role={adminDashboard} />
}
