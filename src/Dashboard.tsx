import { useState } from 'react'
import './Dashboard.css'

export type DemoUser = {
  id: string
  username: string
  password: string
  label: string
  name: string
  unit: string
  canCreateRequest?: boolean
}

/* ข้อมูลจำลองสำหรับงานนำเสนอ แยกออกจากคำขอที่ผู้ใช้สร้างใน sessionStorage */
const requests = [
  { code: 'REQ-2026-0118', title: 'จัดซื้ออุปกรณ์คอมพิวเตอร์', requester: 'นภาพร ทองดี', unit: 'แผนกเทคโนโลยี', amount: 84500, status: 'รอผู้อำนวยการฝ่าย', date: '29 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0117', title: 'อบรมพัฒนาทักษะด้าน AI', requester: 'พิชญา วงศ์ดี', unit: 'แผนกทรัพยากรบุคคล', amount: 128000, status: 'รอคณบดี', date: '28 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0115', title: 'ปรับปรุงห้องปฏิบัติการ', requester: 'กิตติชัย แสงใส', unit: 'ภาควิชาวิศวกรรม', amount: 760000, status: 'รอคณบดี', date: '27 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0109', title: 'โครงการวิจัยประจำปี', requester: 'ศุภกาญจน์ มีชัย', unit: 'คณะวิศวกรรมศาสตร์', amount: 1850000, status: 'รอผู้บริหาร', date: '25 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0102', title: 'จัดซื้อระบบรักษาความปลอดภัย', requester: 'วรินทร กล้าหาญ', unit: 'ฝ่ายบริหาร', amount: 2450000, status: 'รอผู้บริหาร', date: '24 ต.ค. 2569' },
  { code: 'REQ-2026-0201', title: 'จัดซื้อเครื่องพิมพ์สำนักงาน', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 8500, status: 'อนุมัติแล้ว', date: '29 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }, { step: 'ฝ่ายการเงิน', label: 'ฝ่ายการเงิน', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0202', title: 'จัดซื้อวัสดุสำนักงานประจำเดือน', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 6500, status: 'รอหัวหน้าแผนก', date: '29 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย' },
  { code: 'REQ-2026-0203', title: 'อบรมพัฒนาทักษะการใช้งานโปรแกรม', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 45000, status: 'รอผู้อำนวยการฝ่าย', date: '28 ต.ค. 2569', category: 'ฝึกอบรมและสัมมนา', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0204', title: 'ค่าบริการซ่อมระบบเครือข่าย', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 180000, status: 'รอคณบดี', date: '27 ต.ค. 2569', category: 'ซ่อมแซมและปรับปรุง', requestTiming: 'เบิกย้อนหลัง', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0205', title: 'โครงการวิจัยนวัตกรรมดิจิทัล', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 1250000, status: 'รอผู้บริหาร', date: '26 ต.ค. 2569', category: 'โครงการวิจัยและพัฒนา', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0206', title: 'ทดรองค่าเดินทางปฏิบัติงาน', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 22000, status: 'รอฝ่ายการเงิน', date: '25 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เงินสดยืม', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }, { step: 'ผู้อำนวยการฝ่าย', label: 'ผู้อำนวยการฝ่าย', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0207', title: 'ปรับปรุงระบบสำรองข้อมูล', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 120000, status: 'ส่งแก้ไข', date: '24 ต.ค. 2569', category: 'ซ่อมแซมและปรับปรุง', requestTiming: 'เบิกย้อนหลัง', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }, { step: 'คณบดี', label: 'คณบดี', result: 'ส่งแก้ไข' }] },
  { code: 'REQ-2026-0208', title: 'จัดจ้างติดตั้งอุปกรณ์เสริม', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 35000, status: 'ไม่อนุมัติ', date: '23 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'ไม่อนุมัติ' }] },
  { code: 'REQ-2026-0209', title: 'จัดซื้ออุปกรณ์เก็บข้อมูลชั่วคราว', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 4800, status: 'ฉบับร่าง', date: '22 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย' },
  { code: 'REQ-2026-0301', title: 'เช่าเจ้าหน้าที่ประเมินความเสี่ยงองค์กร', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 1250000, status: 'รอคณะกรรมการตรวจสอบ', date: '29 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', description: 'จ้างผู้เชี่ยวชาญภายนอกประเมินความเสี่ยงด้านการบริหาร งบประมาณ และการกำกับดูแล เพื่อเสนอมาตรการป้องกันต่อคณะกรรมการตรวจสอบ', expenseItems: [{ name: 'ค่าจ้างที่ปรึกษาผู้ประเมิน', detail: 'ประเมินความเสี่ยงองค์กรและจัดทำรายงาน', amount: '1,250,000' }], attachments: [{ type: 'ข้อเสนอการให้บริการ', name: 'ข้อเสนอประเมินความเสี่ยง.pdf', size: 820000 }] },
]

const money = (amount: number) => new Intl.NumberFormat('th-TH').format(amount) + ' บาท'

// คำนวณสายอนุมัติตามวงเงินที่ผู้ขอระบุ
const getApprovalSteps = (amount: number, requesterId?: string) => {
  if (requesterId === 'executive') {
    return [
      { key: 'committee', label: 'คณะกรรมการตรวจสอบ', status: 'รอคณะกรรมการตรวจสอบ' },
      { key: 'finance', label: 'ฝ่ายการเงิน', status: 'รอฝ่ายการเงิน' },
    ]
  }
  const steps: Array<{ key: string; label: string; status: string }> = [
    { key: 'department-head', label: 'หัวหน้าแผนก', status: 'รอหัวหน้าแผนก' },
  ]
  if (amount > 10000 && amount <= 100000) {
    steps.push({ key: 'director', label: 'ผู้อำนวยการฝ่าย', status: 'รอผู้อำนวยการฝ่าย' })
  } else if (amount > 100000 && amount <= 1000000) {
    steps.push({ key: 'dean', label: 'คณบดี', status: 'รอคณบดี' })
  } else if (amount > 1000000) {
    steps.push({ key: 'executive', label: 'ผู้บริหาร', status: 'รอผู้บริหาร' })
  }
  steps.push({ key: 'finance', label: 'ฝ่ายการเงิน', status: 'รอฝ่ายการเงิน' })
  return steps
}

export function Dashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  const [active, setActive] = useState(() => user.canCreateRequest === false ? 'ผู้ใช้งาน' : 'สร้างคำขอใหม่')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('จัดซื้อวัสดุและครุภัณฑ์')
  const [requestType, setRequestType] = useState<'เงินสดยืม' | 'เบิกจ่าย'>('เบิกจ่าย')
  const [requestTiming, setRequestTiming] = useState<'เบิกล่วงหน้า' | 'เบิกย้อนหลัง'>('เบิกล่วงหน้า')
  const [requestDate, setRequestDate] = useState('2026-10-29')
  const [neededDate, setNeededDate] = useState('')
  const [budgetYear, setBudgetYear] = useState('2569')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [expenseItems, setExpenseItems] = useState([{ name: '', detail: '', amount: '' }])
  const [recipientName, setRecipientName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [settlementDate, setSettlementDate] = useState('')
  const [financeReferenceNo, setFinanceReferenceNo] = useState('')
  const [financePurpose, setFinancePurpose] = useState('')
  const [documentType, setDocumentType] = useState('ใบเสนอราคา')
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null)
  const [attachments, setAttachments] = useState<Array<{ type: string; name: string; size: number }>>([])
  const [message, setMessage] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  // sessionStorage จำลองฐานข้อมูลระหว่างการพรีเซนต์ โดยไม่ต้องติดตั้ง backend
  const [createdRequests, setCreatedRequests] = useState<any[]>(() => {
    const saved = sessionStorage.getItem('budget-created-requests')
    return saved ? JSON.parse(saved) : []
  })
  const [approvalOverrides, setApprovalOverrides] = useState<Record<string, string>>(() => {
    const saved = sessionStorage.getItem('budget-approval-overrides')
    return saved ? JSON.parse(saved) : {}
  })
  // งบประมาณจำลองแยกตามบทบาท ใช้ตรวจวงเงินคงเหลือและแสดงผลในหน้าโฟลว์คำขอ
  const roleBudgets: Record<string, { total: number; used: number; scope: string }> = {
    employee: { total: 500000, used: 245000, scope: 'งบแผนกเทคโนโลยีของพนักงาน' },
    'department-head': { total: 800000, used: 320000, scope: 'งบครอบคลุมแผนกเทคโนโลยี' },
    director: { total: 5000000, used: 1800000, scope: 'งบฝั่งผู้อำนวยการฝ่ายทุกแผนก' },
    dean: { total: 1000000, used: 420000, scope: 'งบคณะ/หน่วยงานวิชาการ' },
    executive: { total: 42800000, used: 18400000, scope: 'งบประมาณทั้งองค์กร' },
    finance: { total: 500000, used: 245000, scope: 'งบฝ่ายการเงินของหน่วยงานตัวเอง' },
    committee: { total: 0, used: 0, scope: 'คณะกรรมการตรวจสอบคำขอของผู้บริหาร' },
    admin: { total: 0, used: 0, scope: 'ไม่มีงบสร้างคำขอ' },
  }
  const employee = user.id === 'employee'
  const admin = user.id === 'admin'
  const executive = user.id === 'executive'
  const finance = user.id === 'finance'
  const canCreateRequest = user.canCreateRequest ?? !admin
  const creationPolicy = admin
    ? 'แอดมินไม่มีสิทธิ์สร้างหรืออนุมัติคำขอ ใช้สำหรับจัดการผู้ใช้งานและกำหนดสิทธิ์ของระบบ'
    : user.id === 'committee'
      ? 'คณะกรรมการตรวจสอบมีสิทธิ์ตรวจและอนุมัติคำขอของผู้บริหารเท่านั้น ไม่มีสิทธิ์สร้างคำขอ'
      : finance
      ? `ฝ่ายการเงิน (${user.name}) มีสิทธิ์สร้างคำขอระดับพนักงาน ใช้งบฝ่ายการเงินคนละ 500,000 บาท โดยเบิกผ่านระบบจ่ายงบประมาณเท่านั้น ไม่อนุญาตขอทดรองเงินสดยืม และต้องระบุเลขที่รายการการเงินและกรอบการจ่ายเงิน`
      : `${user.label} (${user.name}) สามารถสร้างคำขอได้ทุกวงเงิน โดยระบบใช้วงเงินที่ระบุเพื่อคำนวณสายอนุมัติอัตโนมัติ ผู้ขอและหน่วยงานถูกผูกกับบัญชีที่ล็อกอิน ไม่สามารถแก้ไขได้`

  // เลือกชื่อเมนูอนุมัติตามบทบาทเพื่อให้สมาชิกแต่ละคนพรีเซนต์จุดเข้าที่ชัดเจน
  const approvalMenuItem = user.id === 'department-head'
    ? 'รออนุมัติแผนก'
    : user.id === 'director'
      ? 'รออนุมัติฝ่าย'
      : user.id === 'dean'
        ? 'รออนุมัติคณบดี'
        : finance
          ? 'ตรวจสอบการเงิน'
          : user.id === 'executive'
            ? 'อนุมัติองค์กร'
              : user.id === 'committee'
                ? 'อนุมัติตรวจสอบ'
                : 'รายการคำขอ'

  const menu = admin
    ? ['ผู้ใช้งาน', 'บทบาทและสิทธิ์', 'หน่วยงาน', 'วงเงินอนุมัติ', 'ประวัติระบบ']
    : employee
      ? ['สร้างคำขอใหม่']
      : canCreateRequest
        ? ['สร้างคำขอใหม่', approvalMenuItem]
        : approvalMenuItem ? [approvalMenuItem] : []

  const stats = executive
    ? [['คำขอรออนุมัติ', '8 รายการ', 'เกิน 1,000,000 บาท'], ['งบรออนุมัติ', '18.4 ล้านบาท', 'วันนี้'], ['อนุมัติแล้ว', '63 รายการ', 'เดือนนี้'], ['งบทั้งองค์กร', '42.8 ล้านบาท', 'งวดปีนี้']]
    : finance
      ? [['รอตรวจสอบการเงิน', '12 รายการ', 'ทุกหน่วยงาน'], ['มูลค่ารอตรวจสอบ', '5.2 ล้านบาท', 'วงเงินรวม'], ['อนุมัติแล้ว', '71 รายการ', 'เดือนนี้'], ['งบประมาณคงเหลือ', '18.6 ล้านบาท', 'ปีงบประมาณนี้']]
      : admin
        ? [['ผู้ใช้งาน', '42 คน', 'ทั้งหมด'], ['บทบาท', '7 บทบาท', 'กำหนดสิทธิ์'], ['คำขอทั้งหมด', '128 รายการ', 'เดือนนี้'], ['ระบบใช้งาน', '99.9%', 'Online']]
        : [['คำขอรอดำเนินการ', '9 รายการ', 'ทั้งหมด'], ['อนุมัติแล้ว', '18 รายการ', 'เดือนนี้'], ['ส่งแก้ไข', '3 รายการ', 'รอดำเนินการ'], ['งบรวม', '245,500 บาท', 'ที่ได้รับอนุมัติ']]

  const visibleRequests = user.id === 'department-head'
    ? requests.filter((item) => item.unit === user.unit)
    : user.id === 'director'
      ? requests.filter((item) => item.unit === user.unit || item.unit.includes('แผนก'))
      : user.id === 'dean'
        ? requests.filter((item) => item.unit === user.unit || item.unit.includes('คณะ') || item.unit.includes('ภาควิชา'))
        : requests

  const expenseTotal = expenseItems.reduce((total, item) => total + (Number(item.amount.replace(/,/g, '')) || 0), 0)
  const numericAmount = Number(amount.replace(/,/g, '')) || 0
  const roleBudget = roleBudgets[user.id] ?? { total: 0, used: 0, scope: 'ไม่มีงบที่กำหนด' }
  const budgetTotalNumber = roleBudget.total
  const budgetUsedNumber = roleBudget.used
  const committedAmount = createdRequests.reduce((total, item) => {
    if (!('requesterId' in item) || item.requesterId !== user.id) return total
    if (item.status === 'ฉบับร่าง' || item.status === 'ไม่อนุมัติ') return total
    return total + (Number(item.amount) || 0)
  }, 0)
  const budgetRemaining = Math.max(0, budgetTotalNumber - budgetUsedNumber - committedAmount)
  const categoryDocumentOptions = requestTiming === 'เบิกล่วงหน้า'
    ? category === 'จัดซื้อวัสดุและครุภัณฑ์'
      ? ['ใบเสนอราคา', 'เปรียบเทียบราคา', 'รายงานความจำเป็น', 'เอกสารงบประมาณ', 'อื่นๆ']
      : category === 'ค่าจ้างและค่าบริการ'
        ? ['ข้อเสนอการให้บริการ', 'สัญญาหรือใบแจ้งราคา', 'รายงานความจำเป็น', 'เอกสารโครงการ / TOR', 'อื่นๆ']
        : category === 'ฝึกอบรมและสัมมนา'
          ? ['โปรแกรมการอบรม', 'รายชื่อผู้เข้าร่วม', 'ใบเสนอราคาสถานที่หรือวิทยากร', 'เอกสารงบประมาณ', 'อื่นๆ']
          : category === 'โครงการวิจัยและพัฒนา'
            ? ['ข้อเสนอโครงการวิจัย', 'แผนการใช้จ่ายงบ', 'เอกสารโครงการ / TOR', 'รายงานความจำเป็น', 'อื่นๆ']
            : ['รายงานตรวจสอบงานซ่อม', 'ใบประมาณราคา', 'รายงานความจำเป็น', 'เอกสารงบประมาณ', 'อื่นๆ']
    : category === 'จัดซื้อวัสดุและครุภัณฑ์'
      ? ['ใบเสร็จรับเงิน', 'ใบสั่งซื้อ', 'ใบส่งของ', 'หลักฐานการโอนหรือชำระเงิน', 'อื่นๆ']
      : category === 'ค่าจ้างและค่าบริการ'
        ? ['ใบเสร็จรับเงิน', 'ใบแจ้งหนี้', 'หลักฐานการโอนหรือชำระเงิน', 'รายงานผลการให้บริการ', 'อื่นๆ']
        : category === 'ฝึกอบรมและสัมมนา'
          ? ['ใบเสร็จรับเงิน', 'หลักฐานการโอนหรือชำระเงิน', 'หลักฐานการเข้าร่วมอบรม', 'รายงานสรุปผลการอบรม', 'อื่นๆ']
          : category === 'โครงการวิจัยและพัฒนา'
            ? ['ใบเสร็จรับเงิน', 'หลักฐานการโอนหรือชำระเงิน', 'รายงานความก้าวหน้า', 'รายงานสรุปโครงการ', 'อื่นๆ']
            : ['ใบเสร็จรับเงิน', 'ใบส่งของหรือใบรับงาน', 'หลักฐานการโอนหรือชำระเงิน', 'รายงานผลการซ่อมแซม', 'อื่นๆ']
  const categoryDocumentHint = requestTiming === 'เบิกล่วงหน้า'
    ? 'ควรแนบเอกสารก่อนดำเนินการเพื่อใช้เปรียบเทียบและอนุมัติวงเงิน'
    : 'ต้องแนบหลักฐานหลังดำเนินการอย่างน้อยใบเสร็จหรือหลักฐานการโอน/ชำระเงิน'
  const approvalRoute = user.id === 'executive'
    ? ['คณะกรรมการตรวจสอบ', 'ฝ่ายการเงิน']
    : numericAmount <= 10000
    ? ['หัวหน้าแผนก', 'ฝ่ายการเงิน']
    : numericAmount <= 100000
      ? ['หัวหน้าแผนก', 'ผู้อำนวยการฝ่าย', 'ฝ่ายการเงิน']
      : numericAmount <= 1000000
        ? ['หัวหน้าแผนก', 'คณบดี', 'ฝ่ายการเงิน']
        : ['หัวหน้าแผนก', 'ผู้บริหาร', 'ฝ่ายการเงิน']

  const addAttachment = () => {
    if (!selectedAttachment) {
      setMessage('กรุณาเลือกไฟล์เอกสารประกอบก่อนเพิ่มรายการ')
      return
    }
    if (selectedAttachment.size > 10 * 1024 * 1024) {
      setMessage('ไฟล์เอกสารต้องมีขนาดไม่เกิน 10 MB')
      return
    }
    setAttachments((items) => [...items, { type: documentType, name: selectedAttachment.name, size: selectedAttachment.size }])
    setSelectedAttachment(null)
    setMessage('เพิ่มเอกสารประกอบเรียบร้อยแล้ว')
  }

  /* =========================================
     ส่วนที่ 2 — สมาชิกคนที่ 2 พรีเซนต์ฟอร์มสร้างคำขอ
     โค้ดหลักยังอยู่ในไฟล์นี้เพื่อให้ระบบเดโมทำงานต่อเนื่อง
     หน้าที่: ตรวจข้อมูลงบประมาณ บันทึกฉบับร่าง และส่งคำขออนุมัติ
     ========================================= */
  const submitRequest = (submit: boolean) => {
    if (!canCreateRequest) {
      setMessage('แอดมินไม่มีสิทธิ์สร้างคำขออนุมัติ')
      return
    }
    // สามารถบันทึกฉบับร่างได้แม้ยังกรอกข้อมูลไม่ครบ เพื่อแก้ไขภายหลัง
    if (!submit) {
      const draftAmount = numericAmount > 0 ? numericAmount : 0
      const draftExpenseItems = expenseItems.map((item) => ({ ...item }))
      const code = `REQ-2026-${String(120 + createdRequests.length).padStart(4, '0')}`
      const draftRequest = {
        code,
        title: title.trim() || 'ฉบับร่างไม่มีชื่อ',
        requester: user.name,
        requesterId: user.id,
        requesterRole: user.label,
        requesterUsername: user.username,
        requestTiming,
        unit: user.unit,
        amount: draftAmount,
        status: 'ฉบับร่าง',
        date: '29 ต.ค. 2569',
        approvalHistory: [],
        category,
        description,
        projectName,
        requestType,
        financeReferenceNo: finance ? financeReferenceNo.trim() : '',
        financePurpose: finance ? financePurpose.trim() : '',
        recipientName,
        taxId,
        bankName,
        accountNumber,
        accountName,
        settlementDate,
        requestDate,
        neededDate,
        budgetYear,
        expenseItems: draftExpenseItems,
        attachments: attachments.map((item) => ({ ...item })),
      }
      const nextRequests = [draftRequest, ...createdRequests]
      setCreatedRequests(nextRequests)
      sessionStorage.setItem('budget-created-requests', JSON.stringify(nextRequests))
      setMessage(`บันทึกฉบับร่าง ${code} เรียบร้อยแล้ว สามารถแก้ไขและส่งอนุมัติภายหลังได้`)
      return
    }
    // ตรวจข้อมูลจำเป็น ยอดรายการ วงเงิน และเงื่อนไขของบทบาทก่อนส่งอนุมัติ
    const invalidExpense = expenseItems.some((item) => !item.name.trim() || !item.detail.trim() || !(Number(item.amount.replace(/,/g, '')) > 0))
    if (!title.trim() || numericAmount <= 0 || !description.trim() || invalidExpense) {
      setMessage('กรุณากรอกชื่อรายการ เหตุผล และรายการค่าใช้จ่ายพร้อมจำนวนเงินให้ครบถ้วน')
      return
    }
    if (!recipientName.trim() || !taxId.trim() || !bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      setMessage('กรุณากรอกข้อมูลผู้รับเงินและข้อมูลบัญชีธนาคารให้ครบถ้วน')
      return
    }
    if (requestType === 'เงินสดยืม' && !settlementDate) {
      setMessage('กรุณากำหนดวันที่ต้องเคลียร์เงินสดยืม')
      return
    }
    if (finance && requestType !== 'เบิกจ่าย') {
      setMessage('ฝ่ายการเงินต้องสร้างคำขอในรูปแบบขอเบิกจ่ายงบประมาณเท่านั้น ไม่มีสิทธิ์ขอทดรองเงินสดยืมในฐานะผู้ขอ')
      return
    }
    if (finance && (!financeReferenceNo.trim() || !financePurpose.trim())) {
      setMessage('กรณีฝ่ายการเงินต้องระบุเลขที่รายการการเงินและกรอบการจ่ายเงินให้ครบถ้วน')
      return
    }
    if (numericAmount > budgetRemaining) {
      setMessage(`วงเงินที่ขอเกินงบคงเหลือ ${budgetRemaining.toLocaleString('th-TH')} บาท`)
      return
    }
    if (expenseTotal !== numericAmount) {
      setMessage(`ยอดรายการค่าใช้จ่าย (${expenseTotal.toLocaleString('th-TH')} บาท) ต้องตรงกับวงเงินที่ขออนุมัติ (${numericAmount.toLocaleString('th-TH')} บาท)`)
      return
    }
    const hasRetrospectiveProof = attachments.some((item) => ['ใบเสร็จรับเงิน', 'หลักฐานการโอนหรือชำระเงิน'].includes(item.type))
    if (submit && requestTiming === 'เบิกย้อนหลัง' && !hasRetrospectiveProof) {
      setMessage('กรุณาแนบใบเสร็จรับเงินหรือหลักฐานการโอนเพื่อการเบิกย้อนหลัง')
      return
    }
    const code = `REQ-2026-${String(120 + createdRequests.length).padStart(4, '0')}`
    const newRequest = {
      code,
      title: title.trim(),
      requester: user.name,
      requesterId: user.id,
      requesterRole: user.label,
      requesterUsername: user.username,
      requestTiming,
      unit: user.unit,
      amount: numericAmount,
      status: submit ? getApprovalSteps(numericAmount, user.id)[0].status : 'ฉบับร่าง',
      date: '29 ต.ค. 2569',
      approvalHistory: submit ? [{ step: 'ส่งคำขอ', label: 'ผู้ขอส่งคำขออนุมัติ', status: getApprovalSteps(numericAmount, user.id)[0].status, date: '29 ต.ค. 2569', result: 'ส่งแล้ว' }] : [],
      category,
      description,
      projectName,
      requestType,
      financeReferenceNo: finance ? financeReferenceNo.trim() : '',
      financePurpose: finance ? financePurpose.trim() : '',
      recipientName,
      taxId,
      bankName,
      accountNumber,
      accountName,
      settlementDate,
      requestDate,
      neededDate,
      budgetYear,
      expenseItems,
      attachments: attachments.map((item) => ({ ...item })),
    }
    const nextRequests = [newRequest, ...createdRequests]
    setCreatedRequests(nextRequests)
    sessionStorage.setItem('budget-created-requests', JSON.stringify(nextRequests))
    setMessage(submit ? `ส่งคำขอ ${code} เรียบร้อยแล้ว` : `บันทึกฉบับร่าง ${code} เรียบร้อยแล้ว`)
    setTitle('')
    setCategory('จัดซื้อวัสดุและครุภัณฑ์')
    setDescription('')
    setAmount('')
    setFinanceReferenceNo('')
    setFinancePurpose('')
    setRecipientName('')
    setTaxId('')
    setBankName('')
    setAccountNumber('')
    setAccountName('')
    setSettlementDate('')
    setProjectName('')
    setNeededDate('')
    setRequestTiming('เบิกล่วงหน้า')
    setExpenseItems([{ name: '', detail: '', amount: '' }])
    setDocumentType('ใบเสนอราคา')
    setSelectedAttachment(null)
    setAttachments([])
  }

  // ส่วนอนุมัติและการส่งต่อคำขอตามบทบาทผู้ใช้งาน
  const isApprovalPage = active.includes('อนุมัติ') || active.includes('รออนุมัติ') || active === 'ตรวจสอบการเงิน'
  const approvalScopeDescription = admin
    ? 'แอดมินจัดการบัญชีและสิทธิ์เท่านั้น ไม่มีสิทธิ์อนุมัติคำขอ'
    : employee
      ? 'พนักงานสร้างและติดตามคำขอของตนเองเท่านั้น ไม่มีสิทธิ์อนุมัติ'
      : user.id === 'committee'
        ? 'ตรวจและอนุมัติคำขอของผู้บริหารเพื่อป้องกันการอนุมัติด้วยตนเอง ก่อนส่งต่อฝ่ายการเงิน'
      : user.id === 'department-head'
        ? 'อนุมัติคำขอในแผนกตัวเอง วงเงินไม่เกิน 10,000 บาท'
        : user.id === 'director'
          ? 'อนุมัติคำขอในฝ่ายตัวเอง วงเงิน 10,001–100,000 บาท'
          : user.id === 'dean'
            ? 'อนุมัติคำขอของคณะ/หน่วยงาน วงเงิน 100,001–1,000,000 บาท'
          : user.id === 'executive'
              ? 'อนุมัติคำขอของหน่วยงานเกิน 1,000,000 บาท แต่คำขอของผู้บริหารเองต้องผ่านคณะกรรมการตรวจสอบก่อนส่งฝ่ายการเงิน'
              : 'ตรวจสอบงบและอนุมัติเป็นขั้นกลางทุกคำขอที่ผ่านมาถึงฝ่ายการเงิน'

  const approvalCandidates = [...createdRequests, ...requests]
    .filter((item: any) => {
      const currentStatus = approvalOverrides[item.code] ?? item.status
      if (['อนุมัติแล้ว', 'ไม่อนุมัติ', 'ส่งแก้ไข', 'ฉบับร่าง'].includes(currentStatus)) return false
      if (admin || employee) return false
      if (finance) return currentStatus === 'รอฝ่ายการเงิน'
      if (user.id === 'committee') return currentStatus === 'รอคณะกรรมการตรวจสอบ'
      if (user.id === 'department-head') return currentStatus === 'รอหัวหน้าแผนก' && item.unit === user.unit && item.amount <= 10000
      if (user.id === 'director') return currentStatus === 'รอผู้อำนวยการฝ่าย' && item.amount > 10000 && item.amount <= 100000 && (item.unit === user.unit || item.unit.includes(user.unit.replace('ฝ่าย', '').trim()) || item.unit.includes('แผนก'))
      if (user.id === 'dean') return currentStatus === 'รอคณบดี' && item.amount > 100000 && item.amount <= 1000000 && (item.unit === user.unit || item.unit.includes('คณะ') || item.unit.includes('ภาควิชา'))
      if (user.id === 'executive') return currentStatus === 'รอผู้บริหาร' && item.amount > 1000000
      return false
    })

  const processApproval = (code: string, result: string) => {
    const sourceItem: any = [...createdRequests, ...requests].find((item) => item.code === code)
    if (!sourceItem) return

    const steps = getApprovalSteps(sourceItem.amount, sourceItem.requesterId)
    const currentStatus = approvalOverrides[code] ?? sourceItem.status
    let nextStatus = result
    let historyResult = result

    if (result === 'อนุมัติแล้ว') {
      const currentIndex = steps.findIndex((step) => step.status === currentStatus)
      if (currentIndex >= 0 && currentIndex < steps.length - 1) nextStatus = steps[currentIndex + 1].status
      else nextStatus = 'อนุมัติแล้ว'
      historyResult = 'อนุมัติ'
    } else if (result === 'ส่งแก้ไข') {
      nextStatus = 'ส่งแก้ไข'
      historyResult = 'ส่งแก้ไข'
    } else {
      historyResult = 'ไม่อนุมัติ'
    }

    setApprovalOverrides((items) => {
      const updatedOverrides = { ...items, [code]: nextStatus }
      sessionStorage.setItem('budget-approval-overrides', JSON.stringify(updatedOverrides))
      return updatedOverrides
    })
    const updated = createdRequests.map((item: any) => {
      if (item.code !== code) return item
      const history = item.approvalHistory ?? []
      const currentStep = steps.find((step) => step.status === currentStatus)
      return {
        ...item,
        status: nextStatus,
        approvalHistory: [...history, {
          step: currentStep?.label ?? currentStatus,
          label: currentStep?.label ?? currentStatus,
          status: nextStatus,
          date: '29 ต.ค. 2569',
          result: historyResult,
        }],
      }
    }) as typeof requests
    setCreatedRequests(updated)
    setSelectedRequest(null)
    sessionStorage.setItem('budget-created-requests', JSON.stringify(updated))
    setMessage(`${code}: ${result === 'อนุมัติแล้ว' ? `อนุมัติแล้ว ส่งต่อไปยัง “${nextStatus}”` : result}`)
  }

  return <main className="dashboard-layout">
    <aside className="sidebar">
      <div className="sidebar-brand"><div className="sidebar-logo">▦</div><div><strong>Budget System</strong><small>ระบบอนุมัติงบประมาณ</small></div></div>
      <nav className="side-menu" aria-label="เมนูหลัก">
        <p className="menu-label">เมนูหลัก</p>
        {menu.map((item) => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}><span>{item.includes('คำขอ') || item.includes('อนุมัติ') ? '▤' : item.includes('รายงาน') ? '◫' : '⚙'}</span>{item}</button>)}
      </nav>
      <button className="sidebar-logout" onClick={logout}>↪ ออกจากระบบ</button>
    </aside>

    <section className="dashboard-main">
      <header className="dashboard-header">
        <div><p className="breadcrumb">หน้าหลัก / {active}</p><h1>{active}</h1></div>
        <div className="header-actions"><button className="bell-button" aria-label="แจ้งเตือน">♢<span>3</span></button><div className="user-avatar">{user.name.charAt(0)}</div><div className="header-user"><strong>{user.name}</strong><small>{user.label}</small></div></div>
      </header>

      <div className="dashboard-content">
        {active === 'สร้างคำขอใหม่' && canCreateRequest ? (
          <section className="request-form-layout">
            <form className="request-form panel" onSubmit={(event) => { event.preventDefault(); submitRequest(true) }}>
              <div className="panel-header"><div><h2>สร้างคำของบประมาณ</h2><p>กรอกข้อมูลให้ครบถ้วนเพื่อส่งคำขออนุมัติ</p></div><span className="draft-badge">แบบคำขอใหม่</span></div>
              <div className="form-body">
                {message && <div className={`form-message ${message.includes('กรุณา') || message.includes('ไม่มีสิทธิ์') ? 'error' : ''}`} role="status">{message}</div>}
                <div className="creation-policy"><span>สิทธิ์การสร้างคำขอ</span><strong>{creationPolicy}</strong></div>
                {/* ส่วนที่ 2.1 ข้อมูลรายการ ประเภทการเบิก วันที่ และผู้ขอ */}
                <div className="request-document-form">
                  <div className="request-info-grid">
                    <section className="request-info-box">
                      <div className="request-type-row"><label><input type="radio" checked={requestType === 'เงินสดยืม'} disabled={finance} onChange={() => setRequestType('เงินสดยืม')} /> ขอทดรองเงินสดยืม{finance && <small> — ไม่มีสิทธิ์สำหรับฝ่ายการเงิน</small>}</label><label><input type="radio" checked={requestType === 'เบิกจ่าย'} onChange={() => setRequestType('เบิกจ่าย')} /> ขอเบิกจ่ายงบประมาณ</label></div>
                      {finance && <section className="finance-request-note"><strong>เงื่อนไขการเบิกเฉพาะฝ่ายการเงิน</strong><span>อนุญาตเฉพาะการเบิกจ่ายงบประมาณ และไม่อนุญาตให้ทดรองเป็นเงินสดยืม กรุณาระบุเลขที่รายการและกรอบการจ่ายเงินด้านล่าง</span><div className="document-field-row"><label className="document-field"><span>เลขที่รายการ / เลขที่หนังสือการเงิน <b>*</b></span><input value={financeReferenceNo} onChange={(event) => setFinanceReferenceNo(event.target.value)} placeholder="เช่น FIN-2569-001 หรือเลขหนังสือภายใน" /></label><label className="document-field"><span>กรอบการจ่ายเงิน <b>*</b></span><input value={financePurpose} onChange={(event) => setFinancePurpose(event.target.value)} placeholder="เช่น จ่ายตามใบสำคัญ / ภาษี / งบค่าบริการ" /></label></div></section>}
                      <div className="request-type-row timing-row"><strong>รูปแบบการเบิก</strong><label><input type="radio" checked={requestTiming === 'เบิกล่วงหน้า'} onChange={() => { setRequestTiming('เบิกล่วงหน้า'); setDocumentType(category === 'จัดซื้อวัสดุและครุภัณฑ์' ? 'ใบเสนอราคา' : 'รายงานความจำเป็น'); setAttachments([]) }} /> เบิกล่วงหน้า</label><label><input type="radio" checked={requestTiming === 'เบิกย้อนหลัง'} onChange={() => { setRequestTiming('เบิกย้อนหลัง'); setDocumentType('ใบเสร็จรับเงิน'); setAttachments([]) }} /> เบิกย้อนหลัง</label></div>
                      <label className="document-field full"><span>รายการ / โครงการ <b>*</b></span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ระบุชื่อรายการหรือโครงการ" /></label>
                      <div className="document-field-row"><label className="document-field"><span>ผู้ขอ</span><input value={user.name} readOnly /></label><label className="document-field"><span>หน่วยงาน</span><input value={user.unit} readOnly /></label></div>
                      <div className="document-field-row"><label className="document-field"><span>วันที่ขอ</span><input type="date" value={requestDate} onChange={(event) => setRequestDate(event.target.value)} /></label><label className="document-field"><span>ต้องการใช้งานภายใน</span><input type="date" value={neededDate} onChange={(event) => setNeededDate(event.target.value)} /></label></div>
                    </section>
                    <section className="request-info-box budget-info-box">
                      <label className="document-field"><span>ปีงบประมาณ</span><input value={budgetYear} onChange={(event) => setBudgetYear(event.target.value)} /></label>
                      <div className="budget-scope"><strong>{roleBudget.scope}</strong><span>งบปี {budgetYear}</span></div>
                      <div className="budget-display-grid"><div><span>งบทั้งหมด</span><strong>{budgetTotalNumber.toLocaleString('th-TH')} บาท</strong></div><div><span>ใช้งบไปแล้ว</span><strong>{budgetUsedNumber.toLocaleString('th-TH')} บาท</strong></div><div className="remaining"><span>งบคงเหลือ</span><strong>{budgetRemaining.toLocaleString('th-TH')} บาท</strong></div></div>
                      {committedAmount > 0 && <div className="budget-warning">มีงบกันไว้จากคำขอที่รออนุมัติแล้ว {committedAmount.toLocaleString('th-TH')} บาท</div>}
                      <label className="document-field"><span>วงเงินที่ขออนุมัติ <b>*</b></span><div className="amount-input"><input type="text" inputMode="numeric" value={amount} onChange={(event) => { const digits = event.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''); setAmount(digits ? Number(digits).toLocaleString('en-US') : '') }} placeholder="เช่น 50,000" /><span>บาท</span></div></label>
                      {numericAmount > budgetRemaining && <div className="budget-warning">วงเงินเกินงบคงเหลือ {budgetRemaining.toLocaleString('th-TH')} บาท</div>}
                                            {numericAmount > 0 && expenseTotal !== numericAmount && <div className="budget-warning">ยอดรายการค่าใช้จ่าย {expenseTotal.toLocaleString('th-TH')} บาท ยังไม่ตรงกับวงเงินที่ขอ</div>}
                    </section>
                  </div>

                  {/* ส่วนที่ 2.2 ประเภทงบ วัตถุประสงค์ และรายการค่าใช้จ่าย */}
                  <label className="document-field"><span>ประเภทงบประมาณ <b>*</b></span><select value={category} onChange={(event) => { setCategory(event.target.value); setAttachments([]); setDocumentType(requestTiming === 'เบิกล่วงหน้า' ? (event.target.value === 'จัดซื้อวัสดุและครุภัณฑ์' ? 'ใบเสนอราคา' : 'รายงานความจำเป็น') : 'ใบเสร็จรับเงิน') }}><option>จัดซื้อวัสดุและครุภัณฑ์</option><option>ค่าจ้างและค่าบริการ</option><option>ฝึกอบรมและสัมมนา</option><option>โครงการวิจัยและพัฒนา</option><option>ซ่อมแซมและปรับปรุง</option></select></label>
                  <div className="compatibility-note"><strong>ความเข้ากันได้</strong><span>รูปแบบเบิกล่วงหน้าและเบิกย้อนหลังใช้ได้กับทุกประเภทงบประมาณทุกรูปแบบการจ่ายเงิน การเลือกประเภทงบจะกรองเอกสารประกอบให้ตรงกับลักษณะงาน</span></div>
                  <label className="document-field"><span>ชื่อโครงการหรือกิจกรรม (ถ้ามี)</span><input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="ระบุชื่อโครงการ" /></label>
                  <label className="document-field"><span>วัตถุประสงค์และเหตุผลความจำเป็น <b>*</b></span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="ระบุวัตถุประสงค์ ประโยชน์ และเหตุผลของการขออนุมัติ" /></label>

                  {/* ส่วนที่ 2.3 ตรรกะรายการย่อยและยอดรวมสำหรับตรวจกับวงเงินที่ขอ */}
                  <section className="expense-section"><div className="expense-heading"><div><strong>รายการค่าใช้จ่าย / รายการขอเบิก</strong><span>ระบุรายการและจำนวนเงิน</span></div><button type="button" onClick={() => setExpenseItems((items) => [...items, { name: '', detail: '', amount: '' }])}>+ เพิ่มรายการ</button></div><div className="expense-table"><div className="expense-row expense-header"><span>ลำดับ</span><span>รายการ</span><span>รายละเอียด</span><span>จำนวนเงิน (บาท)</span><span /></div>{expenseItems.map((item, index) => <div className="expense-row" key={index}><span>{index + 1}</span><input value={item.name} onChange={(event) => setExpenseItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, name: event.target.value } : row))} placeholder="ชื่อรายการ" /><input value={item.detail} onChange={(event) => setExpenseItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, detail: event.target.value } : row))} placeholder="รายละเอียด" /><input type="text" inputMode="numeric" value={item.amount} onChange={(event) => { const digits = event.target.value.replace(/[^0-9]/g, ''); setExpenseItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, amount: digits ? Number(digits).toLocaleString('en-US') : '' } : row)) }} placeholder="0" /><button type="button" aria-label="ลบรายการ" disabled={expenseItems.length === 1} onClick={() => setExpenseItems((items) => items.filter((_, rowIndex) => rowIndex !== index))}>×</button></div>)}<div className="expense-total"><span>รวมเงิน</span><strong>{expenseTotal.toLocaleString('th-TH')} บาท</strong></div></div></section>

                  {/* ส่วนที่ 2.4 ข้อมูลผู้รับเงินและการชำระเงิน */}
                  <section className="payment-section"><div className="payment-heading"><div><strong>ข้อมูลผู้รับเงินและบัญชีธนาคาร</strong><span>ใช้สำหรับโอนเงินหรือเงินสดยืมตามสิทธิ์ผู้รับผิดชอบ</span></div></div><div className="document-field-row"><label className="document-field"><span>ชื่อผู้รับเงิน <b>*</b></span><input value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="ชื่อผู้รับเงิน" /></label><label className="document-field"><span>เลขประจำตัวผู้เสียภาษี / บัตรประชาชน <b>*</b></span><input value={taxId} onChange={(event) => setTaxId(event.target.value.replace(/[^0-9]/g, ''))} placeholder="13 หลักหรือเลขบัตรประชาชน" /></label></div><div className="document-field-row"><label className="document-field"><span>ธนาคาร <b>*</b></span><input value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="ชื่อธนาคาร" /></label><label className="document-field"><span>เลขที่บัญชี <b>*</b></span><input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/[^0-9-]/g, ''))} placeholder="กรอกเลขที่บัญชี" /></label></div><div className="document-field-row"><label className="document-field"><span>ชื่อบัญชีธนาคาร <b>*</b></span><input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="ชื่อเจ้าของบัญชี" /></label>{requestType === 'เงินสดยืม' ? <label className="document-field"><span>วันที่ต้องเคลียร์เงินสดยืม <b>*</b></span><input type="date" value={settlementDate} onChange={(event) => setSettlementDate(event.target.value)} /></label> : <label className="document-field"><span>วันที่ชำระโดยประมาณ</span><input type="date" value={settlementDate} onChange={(event) => setSettlementDate(event.target.value)} /></label>}</div></section>

                  {/* ส่วนที่ 2.5 เอกสารประกอบ ตรวจรูปแบบไฟล์และประเภทเอกสาร */}
                  <div className="form-field full attachment-field">
                                      <span>เอกสารประกอบ</span>
                    <div className="attachment-form">
                      <label><span>ประเภทเอกสาร</span><select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>{categoryDocumentOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                      <label><span>แนบไฟล์</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" onChange={(event) => setSelectedAttachment(event.target.files?.[0] ?? null)} /></label>
                      <button type="button" className="add-attachment" onClick={addAttachment} disabled={!selectedAttachment}>เพิ่มเอกสาร</button>
                    </div>
                    <small>{categoryDocumentHint} • รองรับ PDF, JPG, PNG หรือเอกสาร Office ไม่เกิน 10 MB</small>
                    {attachments.length > 0 && <div className="attachment-list">{attachments.map((item, index) => <div className="attachment-item" key={`${item.name}-${index}`}><div><strong>{item.type}</strong><span>{item.name}</span></div><button type="button" aria-label={`ลบ ${item.name}`} onClick={() => setAttachments((items) => items.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}</div>}
                  </div>
                </div>
              </div>
              {/* ส่วนที่ 2.6 ปุ่มจัดการคำขอ: ฉบับร่างหรือส่งอนุมัติ */}
              <div className="form-actions"><button type="button" className="secondary-action" onClick={() => submitRequest(false)}>บันทึกฉบับร่าง</button><button type="submit" className="submit-action">ส่งคำขออนุมัติ</button></div>
            </form>

            <aside className="request-side">
              <article className="panel route-card"><div className="panel-header"><div><h2>สายอนุมัติ</h2><p>คำนวณจากวงเงินอัตโนมัติ</p></div></div>{user.id === 'executive' && <div className="budget-warning">ข้อยกเว้นผู้บริหาร: คำขอข้ามหัวหน้าแผนกและส่งคณะกรรมการตรวจสอบเพื่อไม่อนุมัติด้วยตนเอง</div>}<div className="route-list">{approvalRoute.map((step, index) => <div className="route-step" key={step}><span className="route-number">{index + 1}</span><div><strong>{step}</strong><small>{index === 0 ? (step === 'คณะกรรมการตรวจสอบ' ? 'ผู้อนุมัติอิสระ' : 'ผู้อนุมัติระดับแผนก') : index === approvalRoute.length - 1 && step === 'ผู้บริหาร' ? 'ผู้มีอำนาจสูงสุด' : 'ผู้อนุมัติตามลำดับ'}</small></div>{index < approvalRoute.length - 1 && <span className="route-arrow">↓</span>}</div>)}</div></article>
              {user.id === 'executive' ? <article className="panel budget-guide"><h2>ข้อยกเว้นสำหรับผู้บริหาร</h2><p>คำขอของผู้บริหารเอง</p><strong>คณะกรรมการตรวจสอบ → การเงิน</strong><hr/><p>คำขอหน่วยงานทั่วไปเกิน 1,000,000 บาท</p><strong>หัวหน้าแผนก → ผู้บริหาร → การเงิน</strong></article> : <article className="panel budget-guide"><h2>วงเงินและสายอนุมัติ</h2><p>ไม่เกิน 10,000 บาท</p><strong>หัวหน้าแผนก → การเงิน</strong><hr/><p>10,001–100,000 บาท</p><strong>หัวหน้าแผนก → ผู้อำนวยการฝ่าย → การเงิน</strong><hr/><p>100,001–1,000,000 บาท</p><strong>หัวหน้าแผนก → คณบดี → การเงิน</strong><hr/><p>เกิน 1,000,000 บาท</p><strong>หัวหน้าแผนก → ผู้บริหาร → การเงิน</strong></article>}
            </aside>
          </section>
        ) : isApprovalPage ? (
          <section className="approval-page panel">
            <div className="panel-header"><div><h2>คำขอในขอบเขตอำนาจ</h2><p>อนุมัติตามบทบาทและวงเงินที่กำหนด</p></div></div>
            <div className="approval-scope"><strong>ขอบเขตสิทธิ์: {user.label}</strong><span>{approvalScopeDescription}</span></div>
            <div className="table-wrap"><table><thead><tr><th>เลขที่คำขอ</th><th>รายการ</th><th>หน่วยงาน</th><th>วงเงิน</th><th>การดำเนินการ</th></tr></thead><tbody>{approvalCandidates.map((item) => <tr key={item.code}><td><strong>{item.code}</strong><small>{item.date}</small></td><td><strong>{item.title}</strong><small>{item.requester}</small></td><td>{item.unit}</td><td>{money(item.amount)}</td><td><div className="approval-actions"><button type="button" className="view-detail" onClick={() => setSelectedRequest(item)}>ดูรายละเอียด</button><button type="button" className="approve" onClick={() => processApproval(item.code, 'อนุมัติแล้ว')}>อนุมัติ</button><button type="button" className="revise" onClick={() => processApproval(item.code, 'ส่งแก้ไข')}>ส่งแก้ไข</button><button type="button" className="reject" onClick={() => processApproval(item.code, 'ไม่อนุมัติ')}>ไม่อนุมัติ</button></div></td></tr>)}</tbody></table>{approvalCandidates.length === 0 && <div className="empty-approval">ไม่มีคำขออยู่ในขอบเขตอำนาจของคุณในขณะนี้</div>}</div>
            {selectedRequest && <div className="request-detail-backdrop" role="presentation" onClick={() => setSelectedRequest(null)}><article className="request-detail-modal" role="dialog" aria-modal="true" aria-labelledby="request-detail-title" onClick={(event) => event.stopPropagation()}><div className="request-detail-header"><div><span>รายละเอียดคำขอ</span><h2 id="request-detail-title">{selectedRequest.title}</h2><small>{selectedRequest.code} • {selectedRequest.date}</small></div><button type="button" aria-label="ปิดรายละเอียด" onClick={() => setSelectedRequest(null)}>×</button></div><div className="request-detail-body"><div className="request-detail-summary"><div><span>ผู้ขอ</span><strong>{selectedRequest.requester}</strong></div><div><span>หน่วยงาน</span><strong>{selectedRequest.unit}</strong></div><div><span>ประเภทงบ</span><strong>{selectedRequest.category ?? 'ยังไม่ระบุ'}</strong></div><div><span>วงเงิน</span><strong>{money(selectedRequest.amount)}</strong></div></div><section><span>เหตุผลความจำเป็น</span><p>{selectedRequest.description ?? 'จำลองข้อมูลสำหรับการนำเสนอ เพื่อรองรับงานและภารกิจของหน่วยงานตามงบประมาณที่ได้รับ'}</p></section><section><span>รายการค่าใช้จ่าย</span><div className="detail-expense-list">{(selectedRequest.expenseItems?.length ? selectedRequest.expenseItems : [{ name: selectedRequest.title, detail: 'รายการตัวอย่างสำหรับการพรีเซนต์', amount: String(selectedRequest.amount) }]).map((item: any, index: number) => <div key={index}><span>{index + 1}</span><div><strong>{item.name}</strong><small>{item.detail}</small></div><b>{Number(String(item.amount).replace(/,/g, '') || 0).toLocaleString('th-TH')} บาท</b></div>)}</div></section><section><span>เอกสารประกอบ</span><div className="detail-attachments">{(selectedRequest.attachments?.length ? selectedRequest.attachments : [{ type: 'เอกสารตัวอย่าง', name: 'เอกสารประกอบคำขอ.pdf' }]).map((item: any, index: number) => <div key={index}><strong>{item.type}</strong><small>{item.name}</small></div>)}</div></section><section><span>ประวัติการอนุมัติ</span><div className="detail-history">{(selectedRequest.approvalHistory?.length ? selectedRequest.approvalHistory : []).length > 0 ? selectedRequest.approvalHistory.map((item: any, index: number) => <div key={index}><span>{index + 1}</span><div><strong>{item.label ?? item.step}</strong><small>{item.result}</small></div></div>) : <p>ยังไม่มีประวัติการอนุมัติก่อนหน้า</p>}</div></section></div><div className="request-detail-actions"><button type="button" className="detail-reject" onClick={() => processApproval(selectedRequest.code, 'ไม่อนุมัติ')}>ไม่อนุมัติ</button><button type="button" className="detail-revise" onClick={() => processApproval(selectedRequest.code, 'ส่งแก้ไข')}>ส่งแก้ไข</button><button type="button" className="detail-approve" onClick={() => processApproval(selectedRequest.code, 'อนุมัติแล้ว')}>อนุมัติคำขอ</button></div></article></div>}
          </section>
        ) : (
          <>
            <section className="role-banner"><div><p>ยินดีต้อนรับกลับมา</p><h2>คุณ{user.name}</h2><span>{user.unit} • {user.label}</span></div>{!admin && <button className="primary-action" onClick={() => setActive(employee || finance ? 'สร้างคำขอใหม่' : executive ? 'อนุมัติองค์กร' : 'รายการคำขอ')}>{employee || finance ? '+ สร้างคำขอใหม่' : executive ? 'ดูคำขอองค์กร' : 'ดูคำขอรออนุมัติ'}</button>}</section>
            <section className="stats-grid">{stats.map((stat, index) => <article className="stat-card" key={stat[0]}><div className={`stat-icon color-${index}`}>{['▦', '✓', '↻', '฿'][index]}</div><div><p>{stat[0]}</p><strong>{stat[1]}</strong><small>{stat[2]}</small></div></article>)}</section>
            <section className="overview-grid"><article className="panel overview-workflow"><div className="panel-header"><div><h2>กระบวนการคำขอ</h2><p>ภาพรวมภารกิจตามบทบาทของคุณวันนี้</p></div><span className="live-badge">อัปเดตสด</span></div><div className="workflow-cards"><div><span className="workflow-icon submitted">↗</span><div><strong>{approvalCandidates.length}</strong><small>{'คำขอรอดำเนินการ'}</small></div></div><div><span className="workflow-icon approved">✓</span><div><strong>63</strong><small>อนุมัติแล้วเดือนนี้</small></div></div><div><span className="workflow-icon revised">↺</span><div><strong>13</strong><small>คำขอต้องแก้ไข</small></div></div></div><div className="workflow-route"><div className="workflow-route-head"><strong>สภาวะการอนุมัติ</strong><span>ระบบเดือนตุลาคม 2569</span></div><div className="pipeline-bars"><div><span>ส่งคำขอ</span><i><b style={{ width: '92%' }} /></i><strong>128</strong></div><div><span>ตรวจสอบ</span><i><b style={{ width: '68%' }} /></i><strong>52</strong></div><div><span>อนุมัติ</span><i><b style={{ width: '49%' }} /></i><strong>63</strong></div></div></div></article><article className="panel overview-budget"><div className="panel-header"><div><h2>งบประมาณที่รับผิดชอบ</h2><p>{roleBudget.scope}</p></div><span className="budget-year-badge">ปีงบ {budgetYear}</span></div>{admin ? <div className="admin-overview-note"><strong>โหมดผู้ดูแลระบบ</strong><span>ติดตามผู้ใช้ สิทธิ์ หน่วยงาน และประวัติระบบ ไม่มีสิทธิ์สร้างหรืออนุมัติคำขอ</span></div> : <><div className="budget-ring" style={{ background: `conic-gradient(#245cbe 0 ${roleBudget.total ? Math.min(100, Math.round(roleBudget.used / roleBudget.total * 100)) : 0}%, #edf1f7 0)` }}><div><strong>{roleBudget.total ? Math.round(roleBudget.used / roleBudget.total * 100) : 0}%</strong><span>ใช้งบไปแล้ว</span></div></div><div className="budget-legend"><div><span>งบทั้งหมด</span><strong>{roleBudget.total.toLocaleString('th-TH')} บาท</strong></div><div><span>ใช้งบไปแล้ว</span><strong>{roleBudget.used.toLocaleString('th-TH')} บาท</strong></div><div><span>คงเหลือโดยประมาณ</span><strong>{Math.max(0, roleBudget.total - roleBudget.used - committedAmount).toLocaleString('th-TH')} บาท</strong></div></div></>}</article></section><section className="panel overview-tasks"><div className="panel-header"><div><h2>{admin ? 'งานดูแลระบบวันนี้' : 'สิ่งที่ต้องดำเนินการ'}</h2><p>{admin ? 'รายการตรวจสอบและกำหนดสิทธิ์' : 'ภารกิจประจำบทบาทที่เกี่ยวข้องกับคำขอและงบประมาณ'}</p></div></div><div className="task-list"><div className="task-item"><span className="task-number">01</span><div><strong>{finance ? 'ตรวจคำขอที่ส่งมาที่ฝ่ายการเงิน' : 'ตรวจคำขอในขอบเขตอำนาจ'}</strong><p>{`มี ${approvalCandidates.length} คำขอรอการพิจารณาในระบบ`}</p></div><button type="button" onClick={() => setActive(finance ? 'ตรวจสอบการเงิน' : approvalMenuItem)}>เปิดรายการ</button></div><div className="task-item"><span className="task-number">02</span><div><strong>ตรวจวงเงินงบประมาณปีงบ {budgetYear}</strong><p>{admin ? 'ตรวจสอบผู้ใช้และบทบาทที่มีสิทธิ์ในระบบ' : 'ตรวจงบคงเหลือก่อนสร้างหรืออนุมัติคำขอ'}</p></div><button type="button" onClick={() => setActive(admin ? 'บทบาทและสิทธิ์' : 'รายงานงบประมาณ')}>ดูภาพรวม</button></div><div className="task-item"><span className="task-number">03</span><div><strong>จัดเตรียมเอกสารประกอบคำขอ</strong><p>เอกสารต้องตรงกับประเภทงบ รูปแบบการเบิก และเงื่อนไขการจ่าย</p></div><button type="button" onClick={() => setActive(canCreateRequest ? 'สร้างคำขอใหม่' : 'ประวัติระบบ')}>{canCreateRequest ? 'สร้างคำขอ' : 'ดูประวัติ'}</button></div>            </div></section><section className="panel overview-request-table"><div className="panel-header"><div><h2>{'คำขอที่เกี่ยวข้องล่าสุด'}</h2><p>{'รวมคำขอที่อยู่ในขอบเขตการทำงานของบทบาทคุณ'}</p></div><button type="button" onClick={() => setActive(approvalMenuItem)}>ดูรายละเอียดทั้งหมด</button></div><div className="table-wrap"><table><thead><tr><th>เลขที่คำขอ</th><th>รายการ</th><th>หน่วยงาน</th><th>วงเงิน</th><th>สถานะ</th></tr></thead><tbody>{(visibleRequests).slice(0, 6).map((item) => <tr key={item.code}><td><strong>{item.code}</strong><small>{item.date}</small></td><td><strong>{item.title}</strong><small>{item.requester ?? user.name}</small></td><td>{item.unit}</td><td>{money(item.amount)}</td><td><span className="status">{approvalOverrides[item.code] ?? item.status}</span></td></tr>)}</tbody></table>{visibleRequests.length === 0 && <div className="empty-approval">ยังไม่มีคำขอในขอบเขตนี้</div>}</div></section>
          </>
        )}
      </div>
    </section>
  </main>
}
