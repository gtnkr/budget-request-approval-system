import { useRef, useState } from 'react'
import {
  Bell,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  FilePlus,
  Files,
  HandCoins,
  History,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { BuddhistDatePicker } from './BuddhistDatePicker'
import { FinanceReview, RequestDetails } from './finance/FinanceReview'
import { StatusBadge } from './StatusBadge'
import { DataTable } from './DataTable'
import { FINANCE_REVIEW_MENU } from './types'
import type { ApprovalDetails, DemoUser, RequestRecord } from './types'
import { currentLocalISODate, money } from './utils'
import './Dashboard.css'

/* ข้อมูลจำลองสำหรับงานนำเสนอ แยกออกจากคำขอที่ผู้ใช้สร้างใน sessionStorage */
const requests = [
  { code: 'REQ-2026-0118', title: 'จัดซื้ออุปกรณ์คอมพิวเตอร์', requester: 'นภาพร ทองดี', unit: 'แผนกเทคโนโลยี', amount: 84500, status: 'รอผู้บริหาร', date: '29 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0117', title: 'อบรมพัฒนาทักษะด้าน AI', requester: 'พิชญา วงศ์ดี', unit: 'แผนกทรัพยากรบุคคล', amount: 128000, status: 'รอผู้บริหาร', date: '28 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0115', title: 'ปรับปรุงห้องปฏิบัติการ', requester: 'กิตติชัย แสงใส', unit: 'ภาควิชาวิศวกรรม', amount: 760000, status: 'รอผู้บริหาร', date: '27 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0109', title: 'โครงการวิจัยประจำปี', requester: 'ศุภกาญจน์ มีชัย', unit: 'คณะวิศวกรรมศาสตร์', amount: 1850000, status: 'รอผู้บริหาร', date: '25 ต.ค. 2569', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0102', title: 'จัดซื้อระบบรักษาความปลอดภัย', requester: 'วรินทร กล้าหาญ', unit: 'ฝ่ายบริหาร', amount: 2450000, status: 'รอผู้บริหาร', date: '24 ต.ค. 2569' },
  { code: 'REQ-2026-0201', title: 'จัดซื้อเครื่องพิมพ์สำนักงาน', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 8500, status: 'อนุมัติแล้ว', date: '29 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }, { step: 'ฝ่ายการเงิน', label: 'ฝ่ายการเงิน', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0202', title: 'จัดซื้อวัสดุสำนักงานประจำเดือน', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 6500, status: 'รอหัวหน้าแผนก', date: '29 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย' },
  { code: 'REQ-2026-0203', title: 'อบรมพัฒนาทักษะการใช้งานโปรแกรม', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 45000, status: 'รอผู้บริหาร', date: '28 ต.ค. 2569', category: 'ฝึกอบรมและสัมมนา', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0204', title: 'ค่าบริการซ่อมระบบเครือข่าย', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 180000, status: 'รอผู้บริหาร', date: '27 ต.ค. 2569', category: 'ซ่อมแซมและปรับปรุง', requestTiming: 'เบิกย้อนหลัง', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0205', title: 'โครงการวิจัยนวัตกรรมดิจิทัล', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 1250000, status: 'รอผู้บริหาร', date: '26 ต.ค. 2569', category: 'โครงการวิจัยและพัฒนา', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0206', title: 'ทดรองค่าเดินทางปฏิบัติงาน', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 22000, status: 'รอฝ่ายการเงิน', date: '25 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เงินสดยืม', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }, { step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'อนุมัติ' }] },
  { code: 'REQ-2026-0207', title: 'ปรับปรุงระบบสำรองข้อมูล', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 120000, status: 'ส่งแก้ไข', date: '24 ต.ค. 2569', category: 'ซ่อมแซมและปรับปรุง', requestTiming: 'เบิกย้อนหลัง', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ' }, { step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'ส่งแก้ไข' }] },
  { code: 'REQ-2026-0208', title: 'จัดจ้างติดตั้งอุปกรณ์เสริม', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 35000, status: 'ไม่อนุมัติ', date: '23 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'ไม่อนุมัติ' }] },
  { code: 'REQ-2026-0209', title: 'จัดซื้ออุปกรณ์เก็บข้อมูลชั่วคราว', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 4800, status: 'ฉบับร่าง', date: '22 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย' },
  { code: 'REQ-2026-0301', title: 'เช่าเจ้าหน้าที่ประเมินความเสี่ยงองค์กร', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 1250000, status: 'รอคณะกรรมการตรวจสอบ', date: '29 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', description: 'จ้างผู้เชี่ยวชาญภายนอกประเมินความเสี่ยงด้านการบริหาร งบประมาณ และการกำกับดูแล เพื่อเสนอมาตรการป้องกันต่อคณะกรรมการตรวจสอบ', expenseItems: [{ name: 'ค่าจ้างที่ปรึกษาผู้ประเมิน', detail: 'ประเมินความเสี่ยงองค์กรและจัดทำรายงาน', amount: '1,250,000' }], attachments: [{ type: 'ข้อเสนอการให้บริการ', name: 'ข้อเสนอประเมินความเสี่ยง.pdf', size: 820000 }] },
  { code: 'REQ-2026-0310', title: 'ค่าบริการบำรุงรักษาระบบการเงิน', requester: 'มนัสวิน ดีงาม', requesterId: 'finance', unit: 'ฝ่ายการเงิน', amount: 58000, status: 'รอผู้บริหาร', date: '21 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ส่งคำขอ', label: 'ฝ่ายการเงินผู้ขอ', result: 'ส่งแล้ว' }] },
  { code: 'REQ-2026-0311', title: 'จัดซื้ออุปกรณ์ประชุมแผนก', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 24000, status: 'รอผู้บริหาร', date: '20 ต.ค. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestTiming: 'เบิกล่วงหน้า', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ส่งคำขอ', label: 'หัวหน้าแผนกผู้ขอ', result: 'ส่งแล้ว' }] },
  { code: 'REQ-2026-0312', title: 'ทดรองค่าเดินทางตรวจรับอุปกรณ์', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 12000, status: 'รอตรวจเคลียร์เงินยืม', date: '18 ต.ค. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เงินสดยืม', settlementDate: '2026-11-30', paymentReference: 'PAY-DEMO-2569-004', paymentDate: '2026-10-25', settlementReference: 'SET-DEMO-2569-012', submittedSettlementDate: '2026-11-05', approvalHistory: [
    { step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ', actor: 'สมชาย ใจดี', date: '19 ต.ค. 2569' },
    { step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'อนุมัติ', actor: 'ประเสริฐ รัตนชัย', date: '20 ต.ค. 2569' },
    { step: 'ฝ่ายการเงิน', label: 'ฝ่ายการเงิน', result: 'จ่ายเงินยืมแล้ว', actor: 'มนัสวิน ดีงาม', date: '25 ต.ค. 2569' },
    { step: 'ผู้ขอส่งหลักฐานเคลียร์เงินยืม', label: 'ผู้ขอ', result: 'ส่งหลักฐานแล้ว', actor: 'นภาพร ทองดี', date: '5 พ.ย. 2569' },
  ] },
  { code: 'REQ-2026-0313', title: 'ทดรองค่าเดินทางติดตามโครงการ', requester: 'นภาพร ทองดี', requesterId: 'employee', unit: 'แผนกเทคโนโลยี', amount: 9000, status: 'รอเคลียร์เงินยืม', date: '10 พ.ย. 2569', category: 'ค่าจ้างและค่าบริการ', requestTiming: 'เบิกล่วงหน้า', requestType: 'เงินสดยืม', settlementDate: '2026-11-30', paymentReference: 'PAY-DEMO-2569-005', paymentDate: '2026-11-10', approvalHistory: [
    { step: 'หัวหน้าแผนก', label: 'หัวหน้าแผนก', result: 'อนุมัติ', actor: 'สมชาย ใจดี', date: '6 พ.ย. 2569' },
    { step: 'ฝ่ายการเงิน', label: 'ฝ่ายการเงิน', result: 'จ่ายเงินยืมแล้ว', actor: 'มนัสวิน ดีงาม', date: '10 พ.ย. 2569' },
  ] },
  { code: 'REQ-2026-0320', title: 'จัดซื้ออุปกรณ์จัดเก็บเอกสารแผนก', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 8500, status: 'รอฝ่ายการเงิน', date: '11 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ส่งคำขอ', label: 'หัวหน้าแผนกผู้ขอ', result: 'ส่งคำขออนุมัติ', actor: 'สมชาย ใจดี' }] },
  { code: 'REQ-2026-0321', title: 'ปรับปรุงระบบเครือข่ายประจำแผนก', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 45000, status: 'รอผู้บริหาร', date: '10 พ.ย. 2569', category: 'ซ่อมแซมและปรับปรุง', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ส่งคำขอ', label: 'หัวหน้าแผนกผู้ขอ', result: 'ส่งคำขออนุมัติ', actor: 'สมชาย ใจดี' }] },
  { code: 'REQ-2026-0322', title: 'จัดซื้ออุปกรณ์ความปลอดภัยห้องปฏิบัติการ', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 18000, status: 'อนุมัติแล้ว', date: '8 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'อนุมัติ', actor: 'ประเสริฐ รัตนชัย' }, { step: 'ฝ่ายการเงิน', label: 'ฝ่ายการเงิน', result: 'อนุมัติ', actor: 'มนัสวิน ดีงาม' }] },
  { code: 'REQ-2026-0323', title: 'จัดจ้างตรวจสอบระบบสำรองไฟ', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 32000, status: 'ส่งแก้ไข', date: '7 พ.ย. 2569', category: 'ค่าจ้างและค่าบริการ', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'ส่งแก้ไข', comment: 'กรุณาแนบขอบเขตงานและใบเสนอราคาเปรียบเทียบ', actor: 'ประเสริฐ รัตนชัย' }] },
  { code: 'REQ-2026-0324', title: 'จัดซื้อจอภาพสำหรับห้องประชุม', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 28000, status: 'ไม่อนุมัติ', date: '6 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'ไม่อนุมัติ', comment: 'วงเงินโครงการถูกจัดสรรให้รายการเร่งด่วนแล้ว', actor: 'ประเสริฐ รัตนชัย' }] },
  { code: 'REQ-2026-0325', title: 'ฉบับร่างจัดซื้อวัสดุสำนักงานแผนก', requester: 'สมชาย ใจดี', requesterId: 'department-head', unit: 'แผนกเทคโนโลยี', amount: 6200, status: 'ฉบับร่าง', date: '5 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย' },
  { code: 'REQ-2026-0330', title: 'จัดซื้อระบบติดตามงบประมาณองค์กร', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 380000, status: 'รอฝ่ายการเงิน', date: '9 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'คณะกรรมการตรวจสอบ', label: 'คณะกรรมการตรวจสอบ', result: 'อนุมัติ', actor: 'คณะกรรมการตรวจสอบภายใน' }] },
  { code: 'REQ-2026-0331', title: 'โครงการทบทวนแผนยุทธศาสตร์องค์กร', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 250000, status: 'อนุมัติแล้ว', date: '8 พ.ย. 2569', category: 'ฝึกอบรมและสัมมนา', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'คณะกรรมการตรวจสอบ', label: 'คณะกรรมการตรวจสอบ', result: 'อนุมัติ', actor: 'คณะกรรมการตรวจสอบภายใน' }, { step: 'ฝ่ายการเงิน', label: 'ฝ่ายการเงิน', result: 'อนุมัติ', actor: 'มนัสวิน ดีงาม' }] },
  { code: 'REQ-2026-0332', title: 'จ้างที่ปรึกษาจัดทำกรอบบริหารความเสี่ยง', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 160000, status: 'ส่งแก้ไข', date: '7 พ.ย. 2569', category: 'ค่าจ้างและค่าบริการ', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'คณะกรรมการตรวจสอบ', label: 'คณะกรรมการตรวจสอบ', result: 'ส่งแก้ไข', comment: 'ขอเพิ่มรายละเอียดผลลัพธ์และตัวชี้วัดของงานที่ปรึกษา', actor: 'คณะกรรมการตรวจสอบภายใน' }] },
  { code: 'REQ-2026-0333', title: 'จัดงานประชุมผู้บริหารประจำปี', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 95000, status: 'ไม่อนุมัติ', date: '6 พ.ย. 2569', category: 'ฝึกอบรมและสัมมนา', requestType: 'เบิกจ่าย', approvalHistory: [{ step: 'คณะกรรมการตรวจสอบ', label: 'คณะกรรมการตรวจสอบ', result: 'ไม่อนุมัติ', comment: 'ไม่พบความเชื่อมโยงเพียงพอกับแผนงานที่ได้รับอนุมัติ', actor: 'คณะกรรมการตรวจสอบภายใน' }] },
  { code: 'REQ-2026-0334', title: 'ฉบับร่างโครงการพัฒนาบุคลากร', requester: 'ประเสริฐ รัตนชัย', requesterId: 'executive', unit: 'ผู้บริหารองค์กร', amount: 70000, status: 'ฉบับร่าง', date: '5 พ.ย. 2569', category: 'ฝึกอบรมและสัมมนา', requestType: 'เบิกจ่าย' },
  { code: 'REQ-2026-0340', title: 'ค่าบริการพัฒนาระบบรายงานการเงิน', requester: 'มนัสวิน ดีงาม', requesterId: 'finance', unit: 'ฝ่ายการเงิน', amount: 68000, status: 'อนุมัติแล้ว', date: '8 พ.ย. 2569', category: 'ค่าจ้างและค่าบริการ', requestType: 'เบิกจ่าย', financeReferenceNo: 'FIN-DEMO-2569-040', financePurpose: 'ปรับปรุงระบบรายงานเพื่อรองรับการปิดบัญชี', approvalHistory: [{ step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'อนุมัติ', actor: 'ประเสริฐ รัตนชัย' }] },
  { code: 'REQ-2026-0341', title: 'จัดซื้อเครื่องอ่านเอกสารฝ่ายการเงิน', requester: 'มนัสวิน ดีงาม', requesterId: 'finance', unit: 'ฝ่ายการเงิน', amount: 24500, status: 'ส่งแก้ไข', date: '7 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย', financeReferenceNo: 'FIN-DEMO-2569-041', financePurpose: 'อุปกรณ์ประกอบการจัดเก็บเอกสาร', approvalHistory: [{ step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'ส่งแก้ไข', comment: 'กรุณาแนบใบเสนอราคาเปรียบเทียบและยืนยันความจำเป็น', actor: 'ประเสริฐ รัตนชัย' }] },
  { code: 'REQ-2026-0342', title: 'จ้างปรับปรุงระบบจัดเก็บใบสำคัญ', requester: 'มนัสวิน ดีงาม', requesterId: 'finance', unit: 'ฝ่ายการเงิน', amount: 115000, status: 'ไม่อนุมัติ', date: '6 พ.ย. 2569', category: 'ซ่อมแซมและปรับปรุง', requestType: 'เบิกจ่าย', financeReferenceNo: 'FIN-DEMO-2569-042', financePurpose: 'ปรับปรุงระบบจัดเก็บเอกสารการเงิน', approvalHistory: [{ step: 'ผู้บริหาร', label: 'ผู้บริหาร', result: 'ไม่อนุมัติ', comment: 'รายการซ้ำกับโครงการที่ได้รับอนุมัติในรอบงบประมาณนี้', actor: 'ประเสริฐ รัตนชัย' }] },
  { code: 'REQ-2026-0343', title: 'ฉบับร่างจัดซื้อวัสดุสำนักงานฝ่ายการเงิน', requester: 'มนัสวิน ดีงาม', requesterId: 'finance', unit: 'ฝ่ายการเงิน', amount: 5200, status: 'ฉบับร่าง', date: '5 พ.ย. 2569', category: 'จัดซื้อวัสดุและครุภัณฑ์', requestType: 'เบิกจ่าย', financeReferenceNo: 'FIN-DEMO-2569-043', financePurpose: 'วัสดุสำนักงานตามแผนเบิกจ่าย' },
]

const completeSampleRequest = (request: any, index: number) => {
  const category = request.category
    ?? (request.title.includes('อบรม') ? 'ฝึกอบรมและสัมมนา'
      : request.title.includes('วิจัย') ? 'โครงการวิจัยและพัฒนา'
        : request.title.includes('ซ่อม') || request.title.includes('ปรับปรุง') ? 'ซ่อมแซมและปรับปรุง'
          : request.title.includes('บริการ') || request.title.includes('จัดจ้าง') || request.title.includes('เช่า') ? 'ค่าจ้างและค่าบริการ'
            : 'จัดซื้อวัสดุและครุภัณฑ์')
  const requestType = request.requestType ?? (request.code === 'REQ-2026-0206' ? 'เงินสดยืม' : 'เบิกจ่าย')
  const requestTiming = request.requestTiming ?? (['REQ-2026-0204', 'REQ-2026-0207'].includes(request.code) ? 'เบิกย้อนหลัง' : 'เบิกล่วงหน้า')
  const requesterId = request.requesterId ?? (request.requester === 'นภาพร ทองดี' ? 'employee' : undefined)
  const requesterRoles: Record<string, string> = {
    executive: 'ผู้บริหาร',
    'department-head': 'หัวหน้าแผนก',
    finance: 'ฝ่ายการเงิน',
    employee: 'พนักงาน',
  }
  const requesterRole = request.requesterRole ?? requesterRoles[String(requesterId ?? '')] ?? 'พนักงาน'
  const amount = Number(request.amount)
  const firstItemAmount = Math.floor(amount * 0.65)
  const expenseItems = request.expenseItems?.length ? request.expenseItems : [
    { name: request.title, detail: `ค่าใช้จ่ายหลักสำหรับ${request.title} ของ${request.unit}`, amount: String(firstItemAmount) },
    { name: 'ค่าใช้จ่ายประกอบและภาษี', detail: 'ค่าอุปกรณ์ประกอบ ค่าขนส่ง หรือค่าใช้จ่ายที่เกี่ยวข้องตามใบเสนอราคา', amount: String(amount - firstItemAmount) },
  ]
  const proofTypes = requestTiming === 'เบิกย้อนหลัง'
    ? ['ใบเสร็จรับเงิน', 'หลักฐานการโอนหรือชำระเงิน']
    : category === 'ฝึกอบรมและสัมมนา'
      ? ['โปรแกรมการอบรม', 'ใบเสนอราคาสถานที่หรือวิทยากร']
      : category === 'โครงการวิจัยและพัฒนา'
        ? ['ข้อเสนอโครงการวิจัย', 'แผนการใช้จ่ายงบ']
        : category === 'ซ่อมแซมและปรับปรุง'
          ? ['ใบประมาณราคา', 'รายงานตรวจสอบงานซ่อม']
          : category === 'ค่าจ้างและค่าบริการ'
            ? ['ข้อเสนอการให้บริการ', 'เอกสารโครงการ / TOR']
            : ['ใบเสนอราคา', 'เปรียบเทียบราคา']
  const attachments = request.attachments?.length ? request.attachments : proofTypes.map((type, attachmentIndex) => ({
    type,
    name: `${request.code}-${attachmentIndex + 1}-${type}.pdf`,
    size: 350000 + index * 12000 + attachmentIndex * 45000,
  }))
  const approvalHistory = (request.approvalHistory ?? []).map((item: any, historyIndex: number) => ({
    ...item,
    step: item.step ?? item.label ?? 'ส่งคำขอ',
    label: item.label ?? item.step ?? 'ส่งคำขอ',
    result: item.result ?? 'ส่งแล้ว',
    date: item.date ?? request.date,
    actor: item.actor ?? (item.label === 'หัวหน้าแผนก' || item.step === 'หัวหน้าแผนก'
      ? 'สมชาย ใจดี'
      : item.label === 'ผู้บริหาร' || item.step === 'ผู้บริหาร'
        ? 'ประเสริฐ รัตนชัย'
        : item.label === 'ฝ่ายการเงิน' || item.step === 'ฝ่ายการเงิน'
          ? 'มนัสวิน ดีงาม'
          : item.label === 'คณะกรรมการตรวจสอบ' || item.step === 'คณะกรรมการตรวจสอบ'
            ? 'คณะกรรมการตรวจสอบภายใน'
            : item.step === 'ส่งคำขอ' || item.label?.includes('ผู้ขอ') ? request.requester : `ผู้พิจารณาลำดับที่ ${historyIndex + 1}`),
  }))
  if (approvalHistory.length === 0 && !['ฉบับร่าง', 'ส่งแก้ไข'].includes(request.status)) {
    approvalHistory.push({
      step: 'ส่งคำขอ',
      label: `${requesterRole} ผู้ขอ`,
      result: 'ส่งคำขออนุมัติ',
      date: request.date,
      actor: request.requester,
    })
  }

  return {
    ...request,
    requesterId,
    requesterRole,
    category,
    requestType,
    requestTiming,
    requestDate: request.requestDate ?? `2026-10-${String(Math.max(1, 29 - index)).padStart(2, '0')}`,
    neededDate: request.neededDate ?? `2026-11-${String(Math.min(28, index + 3)).padStart(2, '0')}`,
    budgetYear: request.budgetYear ?? '2569',
    projectName: request.projectName ?? (category === 'โครงการวิจัยและพัฒนา' || category === 'ฝึกอบรมและสัมมนา' ? request.title : ''),
    description: request.description ?? `ขออนุมัติงบประมาณ${request.title} เพื่อให้${request.unit}ดำเนินงานได้ตามแผนและระยะเวลาที่กำหนด รายละเอียดวงเงินประกอบด้วยค่าใช้จ่ายหลักและค่าใช้จ่ายที่เกี่ยวข้อง โดยอ้างอิงเอกสารแนบ`,
    recipientName: request.recipientName ?? `ผู้รับเงินตามเอกสารของ${request.unit}`,
    taxId: request.taxId ?? '0000000000000',
    bankName: request.bankName ?? 'ธนาคารตัวอย่าง (ข้อมูลสาธิต)',
    accountNumber: request.accountNumber ?? 'xxx-x-xxxxx-x (ปกปิดข้อมูล)',
    accountName: request.accountName ?? `ผู้รับเงินตามเอกสารของ${request.unit}`,
    settlementDate: request.settlementDate ?? (requestType === 'เงินสดยืม' ? '2026-11-30' : ''),
    financeReferenceNo: request.financeReferenceNo ?? (requesterId === 'finance' ? 'FIN-DEMO-2569-001' : ''),
    financePurpose: request.financePurpose ?? (requesterId === 'finance' ? 'จ่ายตามใบสำคัญและเอกสารประกอบ (ข้อมูลสาธิต)' : ''),
    expenseItems,
    attachments,
    approvalHistory,
  }
}

const sampleRequests = requests.map(completeSampleRequest)

const currentThaiDate = () => new Date().toLocaleDateString('th-TH')
const currentThaiDateTime = () => new Date().toLocaleString('th-TH')

const demoAccounts = [
  { role: 'พนักงาน', login: 'พนักงาน', name: 'นภาพร ทองดี', unit: 'แผนกเทคโนโลยี', permissions: 'สร้างและติดตามคำขอของตนเอง' },
  { role: 'หัวหน้าแผนก', login: 'หัวหน้าแผนก', name: 'สมชาย ใจดี', unit: 'แผนกเทคโนโลยี', permissions: 'สร้าง/ติดตามคำขอ และอนุมัติคำขอแผนกในลำดับแรก' },
  { role: 'ผู้บริหาร', login: 'ผู้บริหาร', name: 'ประเสริฐ รัตนชัย', unit: 'ผู้บริหารองค์กร', permissions: 'สร้างคำขอ และอนุมัติคำขอเกิน 10,000 บาท' },
  { role: 'ฝ่ายการเงิน', login: 'ฝ่ายการเงิน', name: 'มนัสวิน ดีงาม', unit: 'ฝ่ายการเงิน', permissions: 'สร้างคำขอเบิกจ่าย และตรวจสอบการจ่ายโดยไม่อนุมัติคำขอตนเอง' },
  { role: 'คณะกรรมการตรวจสอบ', login: 'คณะกรรมการตรวจสอบ', name: 'คณะกรรมการตรวจสอบภายใน', unit: 'คณะกรรมการอิสระ', permissions: 'อนุมัติคำขอของผู้บริหาร' },
  { role: 'แอดมิน', login: 'แอดมิน', name: 'ผู้ดูแลระบบ', unit: 'ฝ่ายระบบสารสนเทศ', permissions: 'ดูแลข้อมูลสาธิต ผู้ใช้งาน บทบาท หน่วยงาน และวงเงิน' },
]

const rolePermissionRows = [
  ['พนักงาน', 'สร้างคำขอ', 'ติดตามคำขอตนเอง', '—'],
  ['หัวหน้าแผนก', 'สร้างคำขอ', 'ติดตามคำขอตนเอง', 'อนุมัติคำขอแผนกในลำดับแรก'],
  ['ผู้บริหาร', 'สร้างคำขอ', 'ติดตามคำขอตนเอง', 'อนุมัติ > 10,000 บาท'],
  ['ฝ่ายการเงิน', 'สร้างคำขอเบิกจ่าย', 'ติดตามคำขอตนเอง', 'ตรวจสอบการจ่าย ยกเว้นคำขอตนเอง'],
  ['คณะกรรมการตรวจสอบ', '—', '—', 'อนุมัติคำขอผู้บริหาร'],
  ['แอดมิน', '—', '—', 'ดูแลข้อมูลระบบ ไม่มีสิทธิ์อนุมัติ'],
]

// คำนวณสายอนุมัติตามวงเงินที่ผู้ขอระบุ
const getApprovalSteps = (amount: number, requesterId?: string) => {
  if (requesterId === 'executive') {
    return [
      { key: 'committee', label: 'คณะกรรมการตรวจสอบ', status: 'รอคณะกรรมการตรวจสอบ' },
      { key: 'finance', label: 'ฝ่ายการเงิน', status: 'รอฝ่ายการเงิน' },
    ]
  }
  if (requesterId === 'finance') {
    return [{ key: 'executive', label: 'ผู้บริหาร', status: 'รอผู้บริหาร' }]
  }
  const steps: Array<{ key: string; label: string; status: string }> = []
  if (requesterId !== 'department-head') {
    steps.push({ key: 'department-head', label: 'หัวหน้าแผนก', status: 'รอหัวหน้าแผนก' })
  }
  if (amount > 10000 && requesterId !== 'executive') {
    steps.push({ key: 'executive', label: 'ผู้บริหาร', status: 'รอผู้บริหาร' })
  }
  if (requesterId !== 'finance') {
    steps.push({ key: 'finance', label: 'ฝ่ายการเงิน', status: 'รอฝ่ายการเงิน' })
  }
  return steps
}

export function Dashboard({ user, logout }: { user: DemoUser; logout: () => void }) {
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const [active, setActive] = useState(() => user.id === 'admin' ? 'ผู้ใช้งาน' : user.id === 'committee' ? 'อนุมัติตรวจสอบ' : user.id === 'finance' ? FINANCE_REVIEW_MENU[0] : 'สร้างคำขอใหม่')
  const [editingRequestCode, setEditingRequestCode] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(0)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('จัดซื้อวัสดุและครุภัณฑ์')
  const [requestType, setRequestType] = useState<'เงินสดยืม' | 'เบิกจ่าย'>('เบิกจ่าย')
  const [requestTiming, setRequestTiming] = useState<'เบิกล่วงหน้า' | 'เบิกย้อนหลัง'>('เบิกล่วงหน้า')
  const [requestDate, setRequestDate] = useState(currentLocalISODate)
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
  const [requestUpdates, setRequestUpdates] = useState<Record<string, any>>(() => {
    const saved = sessionStorage.getItem('budget-request-updates')
    return saved ? JSON.parse(saved) : {}
  })
  const [auditEntries, setAuditEntries] = useState<Array<{ actor: string; action: string; code: string; date: string }>>(() => {
    const saved = sessionStorage.getItem('budget-audit-log')
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
  const recordAudit = (action: string, code: string) => {
    const entry = { actor: user.name, action, code, date: currentThaiDateTime() }
    setAuditEntries((entries) => {
      const nextEntries = [entry, ...entries].slice(0, 100)
      sessionStorage.setItem('budget-audit-log', JSON.stringify(nextEntries))
      return nextEntries
    })
  }
  const creationPolicy = admin
    ? 'แอดมินไม่มีสิทธิ์สร้างหรืออนุมัติคำขอ ใช้สำหรับจัดการผู้ใช้งานและกำหนดสิทธิ์ของระบบ'
    : user.id === 'committee'
      ? 'คณะกรรมการตรวจสอบมีสิทธิ์ตรวจและอนุมัติคำขอของผู้บริหารเท่านั้น ไม่มีสิทธิ์สร้างคำขอ'
      : finance
      ? `ฝ่ายการเงิน (${user.name}) สร้างคำขอได้โดยใช้งบฝ่ายการเงินคนละ 500,000 บาท เบิกจ่ายงบประมาณเท่านั้น คำขอของตนจะไม่ส่งกลับมาตรวจโดยฝ่ายการเงิน`
      : `${user.label} (${user.name}) สามารถสร้างคำขอได้ทุกวงเงิน โดยระบบใช้วงเงินที่ระบุเพื่อคำนวณสายอนุมัติอัตโนมัติ ผู้ขอและหน่วยงานถูกผูกกับบัญชีที่ล็อกอิน ไม่สามารถแก้ไขได้`

  // เลือกชื่อเมนูอนุมัติตามบทบาทเพื่อให้สมาชิกแต่ละคนพรีเซนต์จุดเข้าที่ชัดเจน
  const approvalMenuItem = user.id === 'department-head'
    ? 'รออนุมัติแผนก'
    : finance
      ? FINANCE_REVIEW_MENU[0]
      : executive
        ? 'อนุมัติองค์กร'
        : user.id === 'committee'
          ? 'อนุมัติตรวจสอบ'
          : 'รายการคำขอ'

  const menu = admin
    ? ['ผู้ใช้งาน', 'บทบาทและสิทธิ์', 'หน่วยงาน', 'วงเงินอนุมัติ', 'คำขอทั้งหมด', 'ประวัติระบบ']
    : employee
      ? ['สร้างคำขอใหม่', 'คำขอของฉัน']
      : finance
        ? ['ภาพรวม', 'สร้างคำขอใหม่', 'คำขอของฉัน', ...FINANCE_REVIEW_MENU]
      : canCreateRequest
        ? ['สร้างคำขอใหม่', 'คำขอของฉัน', approvalMenuItem]
        : approvalMenuItem ? [approvalMenuItem] : []

  const allRequests: RequestRecord[] = [
    ...createdRequests,
    ...sampleRequests.filter((request) => !createdRequests.some((createdRequest) => createdRequest.code === request.code)),
  ].map((request) => ({
    ...request,
    ...requestUpdates[request.code],
    status: approvalOverrides[request.code] ?? requestUpdates[request.code]?.status ?? request.status,
  }))
  const myRequests = allRequests.filter((item) => item.requesterId === user.id)
  const visibleRequests = user.id === 'department-head'
    ? allRequests.filter((item) => item.unit === user.unit)
    : employee
      ? myRequests
      : allRequests

  const expenseTotal = expenseItems.reduce((total, item) => total + (Number(item.amount.replace(/,/g, '')) || 0), 0)
  const amount = expenseTotal > 0 ? expenseTotal.toLocaleString('en-US') : ''
  const numericAmount = expenseTotal
  const roleBudget = roleBudgets[user.id] ?? { total: 0, used: 0, scope: 'ไม่มีงบที่กำหนด' }
  const budgetTotalNumber = roleBudget.total
  const budgetUsedNumber = roleBudget.used
  const committedAmount = createdRequests.reduce((total, item) => {
    if (item.code === editingRequestCode) return total
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
  const approvalRoute = getApprovalSteps(numericAmount, user.id).map((step) => step.label)
  const validateRequestStep = (step: number) => {
    if (step === 0) {
      if (!title.trim() || !description.trim()) {
        return 'กรุณากรอกชื่อรายการและวัตถุประสงค์/เหตุผลความจำเป็น'
      }
      if (finance && (!financeReferenceNo.trim() || !financePurpose.trim())) {
        return 'กรณีฝ่ายการเงินต้องระบุเลขที่รายการการเงินและกรอบการจ่ายเงินให้ครบถ้วน'
      }
    }

    if (step === 1) {
      const invalidExpense = expenseItems.some((item) =>
        !item.name.trim() ||
        !item.detail.trim() ||
        !(Number(item.amount.replace(/,/g, '')) > 0),
      )
      if (invalidExpense || numericAmount <= 0) {
        return 'กรุณากรอกรายการค่าใช้จ่าย รายละเอียด และจำนวนเงินให้ครบถ้วน'
      }
      if (!recipientName.trim() || !taxId.trim() || !bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
        return 'กรุณากรอกข้อมูลผู้รับเงินและข้อมูลบัญชีธนาคารให้ครบถ้วน'
      }
      if (!/^\d{13}$/.test(taxId)) {
        return 'เลขประจำตัวผู้เสียภาษีหรือบัตรประชาชนต้องเป็นตัวเลข 13 หลัก'
      }
      if (requestType === 'เงินสดยืม' && !settlementDate) {
        return 'กรุณากำหนดวันที่ต้องเคลียร์เงินสดยืม'
      }
      if (finance && requestType !== 'เบิกจ่าย') {
        return 'ฝ่ายการเงินต้องสร้างคำขอในรูปแบบขอเบิกจ่ายงบประมาณเท่านั้น'
      }
      if (numericAmount > budgetRemaining) {
        return `วงเงินที่ขอเกินงบคงเหลือ ${budgetRemaining.toLocaleString('th-TH')} บาท`
      }
    }

    if (step === 2 && requestTiming === 'เบิกย้อนหลัง') {
      const hasRetrospectiveProof = attachments.some((item) =>
        ['ใบเสร็จรับเงิน', 'หลักฐานการโอนหรือชำระเงิน'].includes(item.type),
      )
      if (!hasRetrospectiveProof) {
        return 'กรุณาแนบใบเสร็จรับเงินหรือหลักฐานการโอนเพื่อการเบิกย้อนหลัง'
      }
    }

    return ''
  }
  const goToNextFormStep = () => {
    const validationMessage = validateRequestStep(formStep)
    if (validationMessage) {
      setMessage(validationMessage)
      return
    }
    setMessage('')
    setFormStep((step) => Math.min(step + 1, 2))
  }

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

  const editRequest = (item: any) => {
    setEditingRequestCode(item.code)
    setTitle(item.title === 'ฉบับร่างไม่มีชื่อ' ? '' : item.title)
    setCategory(item.category ?? 'จัดซื้อวัสดุและครุภัณฑ์')
    setDescription(item.description ?? '')
    setRequestType(item.requestType === 'เงินสดยืม' ? 'เงินสดยืม' : 'เบิกจ่าย')
    setRequestTiming(item.requestTiming === 'เบิกย้อนหลัง' ? 'เบิกย้อนหลัง' : 'เบิกล่วงหน้า')
    setRequestDate(item.requestDate ?? currentLocalISODate())
    setNeededDate(item.neededDate ?? '')
    setBudgetYear(item.budgetYear ?? '2569')
    setProjectName(item.projectName ?? '')
    setFinanceReferenceNo(item.financeReferenceNo ?? '')
    setFinancePurpose(item.financePurpose ?? '')
    setRecipientName(item.recipientName ?? '')
    setTaxId(item.taxId ?? '')
    setBankName(item.bankName ?? '')
    setAccountNumber(item.accountNumber ?? '')
    setAccountName(item.accountName ?? '')
    setSettlementDate(item.settlementDate ?? '')
    setExpenseItems(item.expenseItems?.length ? item.expenseItems : [{ name: '', detail: '', amount: '' }])
    setAttachments((item.attachments ?? []).map((attachment: any) => ({ ...attachment, size: attachment.size ?? 0 })))
    setDocumentType(item.attachments?.[0]?.type ?? 'ใบเสนอราคา')
    setFormStep(0)
    setActive('สร้างคำขอใหม่')
    setMessage(`กำลังแก้ไขคำขอ ${item.code}`)
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
      const code = editingRequestCode ?? `REQ-2026-${String(120 + createdRequests.length).padStart(4, '0')}`
      const draftRequest = {
        ...createdRequests.find((item) => item.code === code),
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
        approvalHistory: createdRequests.find((item) => item.code === code)?.approvalHistory ?? [],
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
      const exists = createdRequests.some((item) => item.code === code)
      const nextRequests = exists
        ? createdRequests.map((item) => item.code === code ? draftRequest : item)
        : [draftRequest, ...createdRequests]
      setCreatedRequests(nextRequests)
      sessionStorage.setItem('budget-created-requests', JSON.stringify(nextRequests))
      setApprovalOverrides((items) => {
        const nextOverrides = { ...items }
        delete nextOverrides[code]
        sessionStorage.setItem('budget-approval-overrides', JSON.stringify(nextOverrides))
        return nextOverrides
      })
      setMessage(`บันทึกฉบับร่าง ${code} เรียบร้อยแล้ว สามารถแก้ไขและส่งอนุมัติภายหลังได้`)
      setEditingRequestCode(code)
      recordAudit('บันทึกฉบับร่าง', code)
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
    if (!/^\d{13}$/.test(taxId)) {
      setMessage('เลขประจำตัวผู้เสียภาษีหรือบัตรประชาชนต้องเป็นตัวเลข 13 หลัก')
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
    const code = editingRequestCode ?? `REQ-2026-${String(120 + createdRequests.length).padStart(4, '0')}`
    const existingRequest = createdRequests.find((item) => item.code === code)
    const route = getApprovalSteps(numericAmount, user.id)
    const history = existingRequest?.approvalHistory ?? []
    const newRequest = {
      ...existingRequest,
      code,
      title: title.trim(),
      requester: user.name,
      requesterId: user.id,
      requesterRole: user.label,
      requesterUsername: user.username,
      requestTiming,
      unit: user.unit,
      amount: numericAmount,
      status: submit ? route[0].status : 'ฉบับร่าง',
      date: existingRequest?.date ?? currentThaiDate(),
      approvalHistory: submit ? [...history, { step: 'ส่งคำขอ', label: 'ผู้ขอส่งคำขออนุมัติ', status: route[0].status, date: currentThaiDate(), result: editingRequestCode ? 'ส่งคำขอแก้ไขแล้ว' : 'ส่งแล้ว' }] : history,
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
    const exists = createdRequests.some((item) => item.code === code)
    const nextRequests = exists
      ? createdRequests.map((item) => item.code === code ? newRequest : item)
      : [newRequest, ...createdRequests]
    setCreatedRequests(nextRequests)
    sessionStorage.setItem('budget-created-requests', JSON.stringify(nextRequests))
    setApprovalOverrides((items) => {
      const nextOverrides = { ...items }
      delete nextOverrides[code]
      sessionStorage.setItem('budget-approval-overrides', JSON.stringify(nextOverrides))
      return nextOverrides
    })
    setMessage(submit ? `ส่งคำขอ ${code} เรียบร้อยแล้ว` : `บันทึกฉบับร่าง ${code} เรียบร้อยแล้ว`)
    recordAudit(editingRequestCode ? 'ส่งคำขอแก้ไข' : submit ? 'ส่งคำขออนุมัติ' : 'บันทึกฉบับร่าง', code)
    setEditingRequestCode(null)
    setFormStep(0)
    setTitle('')
    setCategory('จัดซื้อวัสดุและครุภัณฑ์')
    setDescription('')
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
  const isApprovalPage = active.includes('อนุมัติ') || active.includes('รออนุมัติ') || active === FINANCE_REVIEW_MENU[0] || active === FINANCE_REVIEW_MENU[1]
  const approvalScopeDescription = admin
    ? 'แอดมินจัดการบัญชีและสิทธิ์เท่านั้น ไม่มีสิทธิ์อนุมัติคำขอ'
    : employee
      ? 'พนักงานสร้างและติดตามคำขอของตนเองเท่านั้น ไม่มีสิทธิ์อนุมัติ'
      : user.id === 'committee'
        ? 'ตรวจและอนุมัติคำขอของผู้บริหารเพื่อป้องกันการอนุมัติด้วยตนเอง ก่อนส่งต่อฝ่ายการเงิน'
      : user.id === 'department-head'
        ? 'อนุมัติคำขอของแผนกตัวเองในลำดับแรก และคำขอของตนเองจะข้ามขั้นนี้'
        : user.id === 'executive'
          ? 'อนุมัติคำขอเกิน 10,000 บาททุกหน่วยงาน คำขอของผู้บริหารเองส่งคณะกรรมการตรวจสอบแทน'
          : finance
            ? 'ตรวจสอบการจ่ายเงินหลังผ่านการอนุมัติ โดยไม่อนุมัติคำขอที่ฝ่ายการเงินเป็นผู้ขอ'
            : 'ตรวจและอนุมัติคำขอของผู้บริหารก่อนส่งต่อฝ่ายการเงิน'

  const approvalCandidates = allRequests.filter((item: any) => {
      const currentStatus = item.status
      if (['อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว', 'ไม่อนุมัติ', 'ส่งแก้ไข', 'ฉบับร่าง'].includes(currentStatus)) return false
      if (admin || employee) return false
      if (item.requesterId === user.id) return false
      if (active === FINANCE_REVIEW_MENU[1]) {
        return finance && item.requestType === 'เงินสดยืม' && ['รอเคลียร์เงินยืม', 'รอตรวจเคลียร์เงินยืม'].includes(currentStatus)
      }
      if (finance) return currentStatus === 'รอฝ่ายการเงิน'
      if (user.id === 'committee') return currentStatus === 'รอคณะกรรมการตรวจสอบ'
      if (user.id === 'department-head') return currentStatus === 'รอหัวหน้าแผนก' && item.unit === user.unit
      if (executive) return currentStatus === 'รอผู้บริหาร'
      return false
    })
  const pendingRequestAmount = approvalCandidates.reduce((total, item) => total + Number(item.amount || 0), 0)
  const stats = admin
    ? [['ผู้ใช้งาน', '6 บัญชี', 'บัญชีสาธิต'], ['บทบาท', '6 บทบาท', 'กำหนดสิทธิ์'], ['คำขอทั้งหมด', `${allRequests.length} รายการ`, 'รวมข้อมูลสาธิต'], ['ประวัติระบบ', `${auditEntries.length} รายการ`, 'กิจกรรมล่าสุด']]
    : executive
      ? [['คำขอรออนุมัติ', `${approvalCandidates.length} รายการ`, 'คิวผู้บริหาร'], ['วงเงินรออนุมัติ', money(pendingRequestAmount), 'รวมคำขอในคิว'], ['คำขอของฉันเสร็จแล้ว', `${myRequests.filter((item) => ['อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว'].includes(item.status)).length} รายการ`, 'ผู้ขอบทบาทผู้บริหาร'], ['งบทั้งองค์กร', money(roleBudget.total), 'ปีงบประมาณนี้']]
        : user.id === 'department-head'
        ? [['รออนุมัติแผนก', `${approvalCandidates.length} รายการ`, user.unit], ['คำขอของฉัน', `${myRequests.length} รายการ`, 'สร้างโดยบัญชีนี้'], ['ส่งแก้ไข', `${myRequests.filter((item) => item.status === 'ส่งแก้ไข').length} รายการ`, 'คำขอของหัวหน้าแผนก'], ['งบแผนกคงเหลือ', money(Math.max(0, roleBudget.total - roleBudget.used - committedAmount)), 'โดยประมาณ']]
          : [['คำขอของฉัน', `${myRequests.length} รายการ`, 'รวมทุกสถานะ'], ['รอดำเนินการ', `${myRequests.filter((item) => !['อนุมัติแล้ว', 'ชำระเงินแล้ว', 'ปิดรายการแล้ว', 'ไม่อนุมัติ'].includes(item.status)).length} รายการ`, 'กำลังดำเนินการ'], ['ส่งแก้ไข', `${myRequests.filter((item) => item.status === 'ส่งแก้ไข').length} รายการ`, 'ต้องตรวจสอบ'], ['งบคงเหลือ', money(Math.max(0, roleBudget.total - roleBudget.used - committedAmount)), 'โดยประมาณ']]

  const processApproval = (code: string, result: string, details: ApprovalDetails = { comment: '', paymentReference: '', paymentDate: '', settlementReference: '', settlementDate: '' }) => {
    const sourceItem: any = allRequests.find((item) => item.code === code)
    if (!sourceItem || !approvalCandidates.some((item) => item.code === code)) {
      setMessage('ไม่มีสิทธิ์ดำเนินการกับคำขอนี้ หรือคำขอถูกดำเนินการไปแล้ว')
      return
    }

    const steps = getApprovalSteps(sourceItem.amount, sourceItem.requesterId)
    const currentStatus = sourceItem.status
    if (['ส่งแก้ไข', 'ไม่อนุมัติ'].includes(result) && !details.comment?.trim()) {
      setMessage('กรุณาระบุเหตุผลสำหรับการส่งแก้ไขหรือไม่อนุมัติ')
      return
    }
    let nextStatus = result
    let historyResult = result
    const historyDate = result === 'ส่งแก้ไข' ? currentThaiDateTime() : currentThaiDate()

    if (result === 'ปิดเงินยืม') {
      nextStatus = 'ปิดรายการแล้ว'
      historyResult = 'ตรวจหลักฐานและปิดรายการเงินยืม'
    } else if (result === 'อนุมัติแล้ว' && finance && currentStatus === 'รอฝ่ายการเงิน' && sourceItem.requestType === 'เงินสดยืม') {
      nextStatus = 'รอเคลียร์เงินยืม'
      historyResult = 'จ่ายเงินยืมแล้ว'
    } else if (result === 'อนุมัติแล้ว' && finance && currentStatus === 'รอฝ่ายการเงิน') {
      nextStatus = 'ชำระเงินแล้ว'
      historyResult = 'บันทึกการจ่ายเงินแล้ว'
    } else if (result === 'อนุมัติแล้ว') {
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
    if (finance && result === 'อนุมัติแล้ว' && (!details.paymentReference?.trim() || !details.paymentDate)) {
      setMessage('กรุณาบันทึกเลขอ้างอิงและวันที่จ่ายเงินก่อนยืนยัน')
      return
    }
    if (finance && result === 'ปิดเงินยืม' && (!details.settlementReference?.trim() || !details.settlementDate || currentStatus !== 'รอตรวจเคลียร์เงินยืม')) {
      setMessage('ต้องมีหลักฐานจากผู้ขอ และบันทึกเลขอ้างอิงกับวันที่ตรวจปิดรายการก่อน')
      return
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
      const historyItem = {
        step: currentStep?.label ?? currentStatus,
        label: currentStep?.label ?? currentStatus,
        actor: user.name,
        status: nextStatus,
        date: historyDate,
        result: historyResult,
        comment: details.comment ?? '',
        ...(details.paymentReference ? { paymentReference: details.paymentReference, paymentDate: details.paymentDate } : {}),
        ...(details.settlementReference ? { settlementCloseReference: details.settlementReference, settlementCloseDate: details.settlementDate } : {}),
      }
      return {
        ...item,
        status: nextStatus,
        approvalHistory: [...history, historyItem],
        ...(details.paymentReference ? { paymentReference: details.paymentReference, paymentDate: details.paymentDate } : {}),
        ...(details.settlementReference ? { settlementCloseReference: details.settlementReference, actualSettlementDate: details.settlementDate } : {}),
      }
    }) as typeof requests
    const originalHistory = sourceItem.approvalHistory ?? []
    const currentStep = steps.find((step) => step.status === currentStatus)
    const historyItem = {
      step: currentStep?.label ?? currentStatus,
      label: currentStep?.label ?? currentStatus,
      actor: user.name,
      status: nextStatus,
      date: historyDate,
      result: historyResult,
      comment: details.comment ?? '',
      ...(details.paymentReference ? { paymentReference: details.paymentReference, paymentDate: details.paymentDate } : {}),
      ...(details.settlementReference ? { settlementCloseReference: details.settlementReference, settlementCloseDate: details.settlementDate } : {}),
    }
    const update = {
      approvalHistory: [...originalHistory, historyItem],
      ...(details.paymentReference ? { paymentReference: details.paymentReference, paymentDate: details.paymentDate } : {}),
      ...(details.settlementReference ? { settlementCloseReference: details.settlementReference, actualSettlementDate: details.settlementDate } : {}),
    }
    setRequestUpdates((items) => {
      const nextUpdates = { ...items, [code]: { ...items[code], ...update } }
      sessionStorage.setItem('budget-request-updates', JSON.stringify(nextUpdates))
      return nextUpdates
    })
    setCreatedRequests(updated)
    setSelectedRequest(null)
    sessionStorage.setItem('budget-created-requests', JSON.stringify(updated))
    recordAudit(historyResult, code)
    setMessage(`${code}: ${result === 'ปิดเงินยืม' ? 'ปิดรายการเงินยืมเรียบร้อยแล้ว' : result === 'อนุมัติแล้ว' ? finance ? `ดำเนินการแล้ว (${nextStatus})` : `อนุมัติแล้ว ส่งต่อไปยัง “${nextStatus}”` : result}`)
  }

  const submitCashAdvanceSettlement = (code: string, reference: string, date: string) => {
    const request = myRequests.find((item) => item.code === code && item.requestType === 'เงินสดยืม' && item.status === 'รอเคลียร์เงินยืม')
    if (!employee || !request || !reference.trim() || !date) {
      setMessage('ไม่สามารถส่งหลักฐานได้ กรุณาตรวจสอบสิทธิ์ สถานะ และข้อมูลที่กรอก')
      return
    }
    const historyEntry = {
      step: 'ผู้ขอส่งหลักฐานเคลียร์เงินยืม',
      label: 'ผู้ขอ',
      actor: user.name,
      status: 'รอตรวจเคลียร์เงินยืม',
      date: currentThaiDate(),
      result: 'ส่งหลักฐานแล้ว',
      settlementReference: reference.trim(),
      submittedSettlementDate: date,
    }
    const update = {
      status: 'รอตรวจเคลียร์เงินยืม',
      settlementReference: reference.trim(),
      submittedSettlementDate: date,
      approvalHistory: [...(request.approvalHistory ?? []), historyEntry],
    }
    setApprovalOverrides((items) => {
      const next = { ...items, [code]: 'รอตรวจเคลียร์เงินยืม' }
      sessionStorage.setItem('budget-approval-overrides', JSON.stringify(next))
      return next
    })
    setRequestUpdates((items) => {
      const next = { ...items, [code]: { ...items[code], ...update } }
      sessionStorage.setItem('budget-request-updates', JSON.stringify(next))
      return next
    })
    const updatedRequests = createdRequests.map((item: any) => item.code === code ? { ...item, ...update } : item) as typeof requests
    setCreatedRequests(updatedRequests)
    sessionStorage.setItem('budget-created-requests', JSON.stringify(updatedRequests))
    setSelectedRequest(null)
    recordAudit('ผู้ขอส่งหลักฐานเคลียร์เงินยืม', code)
    setMessage(`${code}: ส่งหลักฐานให้ฝ่ายการเงินตรวจสอบแล้ว`)
  }

  return <main className="dashboard-layout">
    <aside className="sidebar">
      <div className="sidebar-brand"><div className="sidebar-logo">▦</div><div><strong>Budget System</strong><small>ระบบอนุมัติงบประมาณ</small></div></div>
      <nav className="side-menu" aria-label="เมนูหลัก">
        <p className="menu-label">เมนูหลัก</p>
        {menu.map((item) => {
          const pendingMenuCount = item === FINANCE_REVIEW_MENU[0]
            ? allRequests.filter((request) => request.status === 'รอฝ่ายการเงิน' && request.requesterId !== user.id).length
            : item === FINANCE_REVIEW_MENU[1]
              ? allRequests.filter((request) => request.requestType === 'เงินสดยืม' && ['รอเคลียร์เงินยืม', 'รอตรวจเคลียร์เงินยืม'].includes(request.status) && request.requesterId !== user.id).length
              : 0
          const MenuIcon = item === FINANCE_REVIEW_MENU[0]
            ? ClipboardCheck
            : item === FINANCE_REVIEW_MENU[1]
              ? HandCoins
              : item === 'ภาพรวม'
                ? LayoutDashboard
                : item === 'สร้างคำขอใหม่'
                  ? FilePlus
                  : item === 'คำขอของฉัน' || item === 'คำขอทั้งหมด' || item === 'รายการคำขอ'
                    ? Files
                    : item.includes('อนุมัติ') || item.includes('รออนุมัติ')
                      ? ShieldCheck
                      : item === 'ผู้ใช้งาน'
                        ? Users
                        : item === 'หน่วยงาน'
                          ? Building2
                          : item.includes('วงเงิน') || item.includes('งบประมาณ')
                            ? Wallet
                            : item.includes('รายงาน')
                              ? ChartNoAxesCombined
                              : item === 'ประวัติระบบ'
                                ? History
                                : ClipboardList
          return <button key={item} className={active === item ? 'active' : ''} onClick={() => { if (item === 'สร้างคำขอใหม่') setFormStep(0); setActive(item) }}><span className="menu-icon"><MenuIcon aria-hidden="true" size={18} strokeWidth={1.8} /></span>{item}{pendingMenuCount > 0 && <small className="menu-pending-count">{pendingMenuCount}</small>}</button>
        })}
      </nav>
      <button className="sidebar-logout" onClick={logout}>↪ ออกจากระบบ</button>
    </aside>

    <section className="dashboard-main">
      <header className="dashboard-header">
        <div><p className="breadcrumb">หน้าหลัก / {active}</p><h1>{active}</h1></div>
        <div className="header-actions"><button className="bell-button" aria-label="แจ้งเตือน"><Bell aria-hidden="true" size={18} strokeWidth={1.8} /><span>3</span></button><div className="user-avatar">{user.name.charAt(0)}</div><div className="header-user"><strong>{user.name}</strong><small>{user.label}</small></div></div>
      </header>

      <div className="dashboard-content">
        {active === 'สร้างคำขอใหม่' && canCreateRequest ? (
          <section className="request-form-layout">
            <form className="request-form panel" onSubmit={(event) => { event.preventDefault(); if (formStep < 2) { goToNextFormStep(); return } const validationMessage = validateRequestStep(2); if (validationMessage) { setMessage(validationMessage); return } submitRequest(true) }}>
              <div className="panel-header"><div><h2>{editingRequestCode ? `แก้ไขคำขอ ${editingRequestCode}` : 'สร้างคำของบประมาณ'}</h2><p>กรอกข้อมูลให้ครบถ้วนเพื่อส่งคำขออนุมัติ</p></div><span className="draft-badge">{editingRequestCode ? 'กำลังแก้ไข' : 'แบบคำขอใหม่'}</span></div>
              <div className="form-body">
                {message && <div className={`form-message ${message.includes('กรุณา') || message.includes('ไม่มีสิทธิ์') ? 'error' : ''}`} role="status">{message}</div>}
                <div className="creation-policy"><span>สิทธิ์การสร้างคำขอ</span><strong>{creationPolicy}</strong></div>
                <nav className="request-stepper" aria-label="ขั้นตอนการสร้างคำขอ">
                  {['ข้อมูลคำขอ', 'รายการและผู้รับเงิน', 'เอกสารและยืนยัน'].map((step, index) => (
                    <div className={`request-stepper-item ${index === formStep ? 'active' : ''} ${index < formStep ? 'completed' : ''}`} key={step} aria-current={index === formStep ? 'step' : undefined}>
                      <span>{index < formStep ? '✓' : index + 1}</span><strong>{step}</strong>
                    </div>
                  ))}
                </nav>
                <p className="request-step-caption">ขั้นที่ {formStep + 1} จาก 3: {['ข้อมูลคำขอ', 'รายการและผู้รับเงิน', 'เอกสารและยืนยัน'][formStep]}</p>
                {/* ส่วนที่ 2.1 ข้อมูลรายการ ประเภทการเบิก วันที่ และผู้ขอ */}
                <div className="request-document-form">
                  <div className="form-step-content" hidden={formStep !== 0}>
                  <div className="request-info-grid">
                    <section className="request-info-box">
                      <div className="request-type-row"><label><input type="radio" checked={requestType === 'เงินสดยืม'} disabled={finance} onChange={() => setRequestType('เงินสดยืม')} /> ขอทดรองเงินสดยืม{finance && <small> — ไม่มีสิทธิ์สำหรับฝ่ายการเงิน</small>}</label><label><input type="radio" checked={requestType === 'เบิกจ่าย'} onChange={() => setRequestType('เบิกจ่าย')} /> ขอเบิกจ่ายงบประมาณ</label></div>
                      {finance && <section className="finance-request-note"><strong>เงื่อนไขการเบิกเฉพาะฝ่ายการเงิน</strong><span>อนุญาตเฉพาะการเบิกจ่ายงบประมาณ และไม่อนุญาตให้ทดรองเป็นเงินสดยืม กรุณาระบุเลขที่รายการและกรอบการจ่ายเงินด้านล่าง</span><div className="document-field-row"><label className="document-field"><span>เลขที่รายการ / เลขที่หนังสือการเงิน <b>*</b></span><input value={financeReferenceNo} onChange={(event) => setFinanceReferenceNo(event.target.value)} placeholder="เช่น FIN-2569-001" /></label><label className="document-field"><span>กรอบการจ่ายเงิน <b>*</b></span><input value={financePurpose} onChange={(event) => setFinancePurpose(event.target.value)} placeholder="เช่น จ่ายตามใบสำคัญ" /></label></div></section>}
                      <div className="request-type-row timing-row"><strong>รูปแบบการเบิก</strong><label><input type="radio" checked={requestTiming === 'เบิกล่วงหน้า'} onChange={() => { setRequestTiming('เบิกล่วงหน้า'); setDocumentType(category === 'จัดซื้อวัสดุและครุภัณฑ์' ? 'ใบเสนอราคา' : 'รายงานความจำเป็น'); setAttachments([]) }} /> เบิกล่วงหน้า</label><label><input type="radio" checked={requestTiming === 'เบิกย้อนหลัง'} onChange={() => { setRequestTiming('เบิกย้อนหลัง'); setDocumentType('ใบเสร็จรับเงิน'); setAttachments([]) }} /> เบิกย้อนหลัง</label></div>
                      <label className="document-field full"><span>รายการ / โครงการ <b>*</b></span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ระบุชื่อรายการหรือโครงการ" /></label>
                      <div className="document-field-row"><label className="document-field"><span>ผู้ขอ</span><input value={user.name} readOnly /></label><label className="document-field"><span>หน่วยงาน</span><input value={user.unit} readOnly /></label></div>
                      <div className="document-field-row"><label className="document-field"><span>วันที่ขอ</span><BuddhistDatePicker label="วันที่ขอ" value={requestDate} onChange={setRequestDate} /></label><label className="document-field"><span>ต้องการใช้งานภายใน</span><BuddhistDatePicker label="ต้องการใช้งานภายใน" value={neededDate} onChange={setNeededDate} /></label></div>
                    </section>
                    <section className="request-info-box budget-info-box">
                      <label className="document-field"><span>ปีงบประมาณ</span><input value={budgetYear} onChange={(event) => setBudgetYear(event.target.value)} /></label>
                      <div className="budget-scope"><strong>{roleBudget.scope}</strong><span>งบปี {budgetYear}</span></div>
                      <div className="budget-display-grid"><div><span>งบทั้งหมด</span><strong>{budgetTotalNumber.toLocaleString('th-TH')} บาท</strong></div><div><span>ใช้งบไปแล้ว</span><strong>{budgetUsedNumber.toLocaleString('th-TH')} บาท</strong></div><div className="remaining"><span>งบคงเหลือ</span><strong>{budgetRemaining.toLocaleString('th-TH')} บาท</strong></div></div>
                      {committedAmount > 0 && <div className="budget-warning">มีงบกันไว้จากคำขอที่รออนุมัติแล้ว {committedAmount.toLocaleString('th-TH')} บาท</div>}
                      <label className="document-field"><span>วงเงินที่ขออนุมัติ <b>*</b></span><div className="amount-input"><input type="text" inputMode="numeric" value={amount} readOnly placeholder="คำนวณจากรวมเงิน" /><span>บาท</span></div></label>
                      {numericAmount > budgetRemaining && <div className="budget-warning">วงเงินเกินงบคงเหลือ {budgetRemaining.toLocaleString('th-TH')} บาท</div>}
                                            {numericAmount > 0 && expenseTotal !== numericAmount && <div className="budget-warning">ยอดรายการค่าใช้จ่าย {expenseTotal.toLocaleString('th-TH')} บาท ยังไม่ตรงกับวงเงินที่ขอ</div>}
                    </section>
                  </div>

                  {/* ส่วนที่ 2.2 ประเภทงบ วัตถุประสงค์ และรายการค่าใช้จ่าย */}
                  <label className="document-field"><span>ประเภทงบประมาณ <b>*</b></span><select value={category} onChange={(event) => { setCategory(event.target.value); setAttachments([]); setDocumentType(requestTiming === 'เบิกล่วงหน้า' ? (event.target.value === 'จัดซื้อวัสดุและครุภัณฑ์' ? 'ใบเสนอราคา' : 'รายงานความจำเป็น') : 'ใบเสร็จรับเงิน') }}><option>จัดซื้อวัสดุและครุภัณฑ์</option><option>ค่าจ้างและค่าบริการ</option><option>ฝึกอบรมและสัมมนา</option><option>โครงการวิจัยและพัฒนา</option><option>ซ่อมแซมและปรับปรุง</option></select></label>
                  <div className="compatibility-note"><strong>ความเข้ากันได้</strong><span>รูปแบบเบิกล่วงหน้าและเบิกย้อนหลังใช้ได้กับทุกประเภทงบประมาณทุกรูปแบบการจ่ายเงิน การเลือกประเภทงบจะกรองเอกสารประกอบให้ตรงกับลักษณะงาน</span></div>
                  <label className="document-field"><span>ชื่อโครงการหรือกิจกรรม (ถ้ามี)</span><input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="ระบุชื่อโครงการ" /></label>
                  <label className="document-field"><span>วัตถุประสงค์และเหตุผลความจำเป็น <b>*</b></span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="ระบุวัตถุประสงค์ ประโยชน์ และเหตุผลของการขออนุมัติ" /></label>
                  </div>

                  {/* ส่วนที่ 2.3 ตรรกะรายการย่อยและยอดรวมสำหรับตรวจกับวงเงินที่ขอ */}
                  <div className="form-step-content" hidden={formStep !== 1}>
                  <section className="expense-section"><div className="expense-heading"><div><strong>รายการค่าใช้จ่าย / รายการขอเบิก</strong><span>ระบุรายการและจำนวนเงิน</span></div><button type="button" onClick={() => setExpenseItems((items) => [...items, { name: '', detail: '', amount: '' }])}>+ เพิ่มรายการ</button></div><div className="expense-table"><div className="expense-row expense-header"><span>ลำดับ</span><span>รายการ</span><span>รายละเอียด</span><span>จำนวนเงิน (บาท)</span><span /></div>{expenseItems.map((item, index) => <div className="expense-row" key={index}><span>{index + 1}</span><input value={item.name} onChange={(event) => setExpenseItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, name: event.target.value } : row))} placeholder="ชื่อรายการ" /><input value={item.detail} onChange={(event) => setExpenseItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, detail: event.target.value } : row))} placeholder="รายละเอียด" /><input type="text" inputMode="numeric" value={item.amount} onChange={(event) => { const digits = event.target.value.replace(/[^0-9]/g, ''); setExpenseItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, amount: digits ? Number(digits).toLocaleString('en-US') : '' } : row)) }} placeholder="0" /><button type="button" aria-label="ลบรายการ" disabled={expenseItems.length === 1} onClick={() => setExpenseItems((items) => items.filter((_, rowIndex) => rowIndex !== index))}>×</button></div>)}<div className="expense-total"><span>รวมเงิน</span><strong>{expenseTotal.toLocaleString('th-TH')} บาท</strong></div></div></section>

                  {/* ส่วนที่ 2.4 ข้อมูลผู้รับเงินและการชำระเงิน */}
                  <section className="payment-section"><div className="payment-heading"><div><strong>ข้อมูลผู้รับเงินและบัญชีธนาคาร</strong><span>ใช้สำหรับโอนเงินหรือเงินสดยืมตามสิทธิ์ผู้รับผิดชอบ</span></div></div><div className="document-field-row"><label className="document-field"><span>ชื่อผู้รับเงิน <b>*</b></span><input value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="ชื่อผู้รับเงิน" /></label><label className="document-field"><span>เลขประจำตัวผู้เสียภาษี / บัตรประชาชน <b>*</b></span><input value={taxId} onChange={(event) => setTaxId(event.target.value.replace(/[^0-9]/g, ''))} placeholder="13 หลักหรือเลขบัตรประชาชน" /></label></div><div className="document-field-row"><label className="document-field"><span>ธนาคาร <b>*</b></span><input value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="ชื่อธนาคาร" /></label><label className="document-field"><span>เลขที่บัญชี <b>*</b></span><input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/[^0-9-]/g, ''))} placeholder="กรอกเลขที่บัญชี" /></label></div><div className="document-field-row"><label className="document-field"><span>ชื่อบัญชีธนาคาร <b>*</b></span><input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="ชื่อเจ้าของบัญชี" /></label>{requestType === 'เงินสดยืม' ? <label className="document-field"><span>วันที่ต้องเคลียร์เงินสดยืม <b>*</b></span><BuddhistDatePicker label="วันที่ต้องเคลียร์เงินสดยืม" value={settlementDate} onChange={setSettlementDate} /></label> : <label className="document-field"><span>วันที่ชำระโดยประมาณ</span><BuddhistDatePicker label="วันที่ชำระโดยประมาณ" value={settlementDate} onChange={setSettlementDate} /></label>}</div></section>
                  </div>

                  {/* ส่วนที่ 2.5 เอกสารประกอบ ตรวจรูปแบบไฟล์และประเภทเอกสาร */}
                  <div className="form-step-content" hidden={formStep !== 2}>
                  <section className="request-confirmation"><h3>ตรวจสอบข้อมูลก่อนส่งคำขอ</h3><dl><div><dt>รายการ / โครงการ</dt><dd>{title || '—'}</dd></div><div><dt>รูปแบบคำขอ</dt><dd>{requestType} • {requestTiming}</dd></div><div><dt>หน่วยงาน</dt><dd>{user.unit}</dd></div><div><dt>จำนวนรายการ</dt><dd>{expenseItems.length} รายการ</dd></div><div><dt>วงเงินรวม</dt><dd>{numericAmount.toLocaleString('th-TH')} บาท</dd></div></dl></section>
                  <div className="form-field full attachment-field">
                    <span>เอกสารประกอบ</span>
                    <div className="attachment-form">
                      <label><span>ประเภทเอกสาร</span><select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>{categoryDocumentOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                      <div className="attachment-file-control"><span>แนบไฟล์</span><input ref={attachmentInputRef} className="attachment-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" onChange={(event) => setSelectedAttachment(event.target.files?.[0] ?? null)} /><div className="attachment-file-picker"><button type="button" className="choose-attachment" onClick={() => attachmentInputRef.current?.click()}>เลือกไฟล์</button><span className="selected-attachment-name">{selectedAttachment?.name ?? 'ยังไม่ได้เลือกไฟล์'}</span></div></div>
                      <button type="button" className="add-attachment" onClick={addAttachment} disabled={!selectedAttachment}>เพิ่มเอกสาร</button>
                    </div>
                    <small>{categoryDocumentHint} • รองรับ PDF, JPG, PNG หรือเอกสาร Office ไม่เกิน 10 MB</small>
                    {attachments.length > 0 && <div className="attachment-list">{attachments.map((item, index) => <div className="attachment-item" key={`${item.name}-${index}`}><div><strong>{item.type}</strong><span>{item.name}</span></div><button type="button" aria-label={`ลบ ${item.name}`} onClick={() => setAttachments((items) => items.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}</div>}
                  </div>
                  </div>
                </div>
              </div>
              {/* ส่วนที่ 2.6 ปุ่มจัดการคำขอ: ฉบับร่างหรือส่งอนุมัติ */}
              <div className="form-actions">
                {formStep > 0 && <button type="button" className="secondary-action" onClick={() => { setMessage(''); setFormStep((step) => Math.max(step - 1, 0)) }}>ย้อนกลับ</button>}
                <button type="button" className="secondary-action" onClick={() => submitRequest(false)}>บันทึกฉบับร่าง</button>
                {formStep < 2
                  ? <button type="button" className="submit-action" onClick={goToNextFormStep}>ถัดไป</button>
                  : <button type="submit" className="submit-action">{editingRequestCode ? 'บันทึกและส่งคำขออีกครั้ง' : 'ยืนยันและส่งคำขออนุมัติ'}</button>}
              </div>
            </form>

            <aside className="request-side">
              <article className="panel route-card"><div className="panel-header"><div><h2>สายอนุมัติ</h2><p>คำนวณจากวงเงินอัตโนมัติ</p></div></div>{user.id === 'executive' && <div className="budget-warning">ข้อยกเว้นผู้บริหาร: คำขอข้ามหัวหน้าแผนกและส่งคณะกรรมการตรวจสอบเพื่อไม่อนุมัติด้วยตนเอง</div>}<div className="route-list">{approvalRoute.map((step, index) => <div className="route-step" key={step}><span className="route-number">{index + 1}</span><div><strong>{step}</strong><small>{step === 'คณะกรรมการตรวจสอบ' ? 'ผู้อนุมัติอิสระ' : step === 'ผู้บริหาร' ? 'ผู้มีอำนาจสูงสุด' : index === 0 ? 'ผู้อนุมัติระดับแผนก' : 'ผู้อนุมัติตามลำดับ'}</small></div>{index < approvalRoute.length - 1 && <span className="route-arrow">↓</span>}</div>)}</div></article>
              {user.id === 'executive' ? <article className="panel budget-guide"><h2>ข้อยกเว้นสำหรับผู้บริหาร</h2><p>คำขอของผู้บริหารเอง</p><strong>คณะกรรมการตรวจสอบ → การเงิน</strong><hr/><p>คำขอของหน่วยงานอื่นเกิน 10,000 บาท</p><strong>หัวหน้าแผนก → ผู้บริหาร → การเงิน</strong></article> : <article className="panel budget-guide"><h2>สายอนุมัติตามวงเงิน</h2><p>ไม่เกิน 10,000 บาท</p><strong>หัวหน้าแผนก → ฝ่ายการเงิน</strong><hr/><p>มากกว่า 10,000 บาท</p><strong>หัวหน้าแผนก → ผู้บริหาร → ฝ่ายการเงิน</strong><hr/><p>คำขอของหัวหน้าแผนก</p><strong>ข้ามหัวหน้าแผนก → ขั้นถัดไป</strong><hr/><p>คำขอของฝ่ายการเงิน</p><strong>ไม่ส่งกลับมาตรวจโดยผู้ขอ</strong></article>}
            </aside>
          </section>
        ) : isApprovalPage && finance ? (
          <FinanceReview
            mode="review"
            active={active}
            user={user}
            approvalCandidates={approvalCandidates}
            approvalScopeDescription={approvalScopeDescription}
            message={message}
            selectedRequest={selectedRequest}
            approvalOverrides={approvalOverrides}
            onSelectRequest={setSelectedRequest}
            onDecision={(code, result, details) => processApproval(code, result, details)}
          />
        ) : isApprovalPage ? (
          <section className="approval-page panel">
            <div className="panel-header"><div><h2>คำขอในขอบเขตอำนาจ</h2><p>อนุมัติหรือส่งกลับแก้ไขตามบทบาทและวงเงินที่กำหนด</p></div></div>
            {message && <div className="form-message approval-message" role="status">{message}</div>}
            <div className="approval-scope"><strong>ขอบเขตสิทธิ์: {user.label}</strong><span>{approvalScopeDescription}</span></div>
            <DataTable
              rows={approvalCandidates}
              getRowKey={(item) => item.code}
              emptyMessage="ไม่มีคำขออยู่ในขอบเขตอำนาจของคุณในขณะนี้"
              columns={[
                { key: 'code', header: 'เลขที่คำขอ', render: (item) => <><strong>{item.code}</strong><small>{item.date}</small></>, sortValue: (item) => item.code, searchValue: (item) => `${item.code} ${item.date}` },
                { key: 'title', header: 'รายการ', render: (item) => <><strong>{item.title}</strong><small>{item.requester}</small></>, sortValue: (item) => item.title, searchValue: (item) => `${item.title} ${item.requester}` },
                { key: 'unit', header: 'หน่วยงาน', render: (item) => item.unit, sortValue: (item) => item.unit },
                { key: 'amount', header: 'วงเงิน', render: (item) => money(item.amount), sortValue: (item) => Number(item.amount) || 0 },
                { key: 'actions', header: 'การดำเนินการ', render: (item) => <div className="approval-actions"><button type="button" className="view-detail" onClick={() => setSelectedRequest(item)}>ดูรายละเอียดและดำเนินการ</button></div> },
              ]}
            />
            {selectedRequest && <RequestDetails request={{ ...selectedRequest, status: approvalOverrides[selectedRequest.code] ?? selectedRequest.status }} onClose={() => setSelectedRequest(null)} decisionRole={user.id} onDecision={(result, details) => processApproval(selectedRequest.code, result, details)} />}
          </section>
        ) : active === 'คำขอของฉัน' ? (
          <section className="panel management-page">
            <div className="panel-header"><div><h2>คำขอของฉัน</h2><p>ติดตามสถานะและประวัติการพิจารณาของคำขอที่คุณสร้าง</p></div><button type="button" onClick={() => { setEditingRequestCode(null); setFormStep(0); setActive('สร้างคำขอใหม่') }}>+ สร้างคำขอ</button></div>
            <DataTable
              rows={myRequests}
              getRowKey={(item) => item.code}
              emptyMessage="ยังไม่มีคำขอของคุณ"
              columns={[
                { key: 'code', header: 'เลขที่คำขอ', render: (item) => <><strong>{item.code}</strong><small>{item.date}</small></>, sortValue: (item) => item.code, searchValue: (item) => `${item.code} ${item.date}` },
                { key: 'title', header: 'รายการ', render: (item) => <><strong>{item.title}</strong><small>{item.category ?? 'ยังไม่ระบุประเภทงบ'}</small></>, sortValue: (item) => item.title, searchValue: (item) => `${item.title} ${item.category ?? ''}` },
                { key: 'amount', header: 'วงเงิน', render: (item) => money(item.amount), sortValue: (item) => Number(item.amount) || 0 },
                { key: 'status', header: 'สถานะ / ประวัติล่าสุด', render: (item) => {
                  const currentStatus = approvalOverrides[item.code] ?? item.status
                  const latestHistory = item.approvalHistory?.at(-1)
                  return <><StatusBadge status={currentStatus} /><small>{latestHistory ? `${latestHistory.label ?? latestHistory.step}: ${latestHistory.result}${latestHistory.comment ? ` • เหตุผล: ${latestHistory.comment}` : ''}` : 'ยังไม่มีประวัติการอนุมัติ'}</small></>
                }, sortValue: (item) => approvalOverrides[item.code] ?? item.status, searchValue: (item) => `${approvalOverrides[item.code] ?? item.status} ${item.approvalHistory?.at(-1)?.comment ?? ''}` },
                { key: 'actions', header: 'การดำเนินการ', searchValue: () => '', render: (item) => {
                  const currentStatus = approvalOverrides[item.code] ?? item.status
                  const canEdit = ['ฉบับร่าง', 'ส่งแก้ไข'].includes(currentStatus)
                  const canSubmitSettlement = employee && item.requesterId === user.id && item.requestType === 'เงินสดยืม' && currentStatus === 'รอเคลียร์เงินยืม'
                  return <div className="request-row-actions"><button type="button" className="view-detail" onClick={() => setSelectedRequest(item)}>ดูรายละเอียด</button>{canEdit && <button type="button" className="view-detail" onClick={() => editRequest(item)}>แก้ไข / ส่งอีกครั้ง</button>}{canSubmitSettlement && <button type="button" className="view-detail" onClick={() => setSelectedRequest(item)}>ส่งหลักฐานเคลียร์เงินยืม</button>}</div>
                } },
              ]}
            />
            {selectedRequest && <RequestDetails
              request={{ ...selectedRequest, status: approvalOverrides[selectedRequest.code] ?? selectedRequest.status }}
              onClose={() => setSelectedRequest(null)}
              canSubmitSettlement={employee && selectedRequest.requesterId === user.id && selectedRequest.requestType === 'เงินสดยืม' && (approvalOverrides[selectedRequest.code] ?? selectedRequest.status) === 'รอเคลียร์เงินยืม'}
              onSubmitSettlement={(reference, date) => submitCashAdvanceSettlement(selectedRequest.code, reference, date)}
            />}
          </section>
        ) : admin ? (
          <section className="panel management-page">
            <div className="panel-header"><div><h2>{active}</h2><p>ข้อมูลสำหรับบัญชีสาธิตในเบราว์เซอร์นี้</p></div></div>
            {active === 'ผู้ใช้งาน' ? (
              <DataTable
                rows={demoAccounts}
                getRowKey={(account) => account.role}
                emptyMessage="ไม่พบข้อมูลผู้ใช้งาน"
                columns={[
                  { key: 'login', header: 'ชื่อผู้ใช้', render: (account) => <><strong>{account.login}</strong><small>{account.name}</small></>, sortValue: (account) => account.login, searchValue: (account) => `${account.login} ${account.name}` },
                  { key: 'role', header: 'บทบาท', render: (account) => account.role, sortValue: (account) => account.role },
                  { key: 'unit', header: 'หน่วยงาน', render: (account) => account.unit, sortValue: (account) => account.unit },
                  { key: 'permissions', header: 'สิทธิ์โดยสรุป', render: (account) => account.permissions, sortValue: (account) => account.permissions },
                  { key: 'status', header: 'สถานะ', render: () => <StatusBadge status="ใช้งาน" /> },
                ]}
              />
            ) : active === 'บทบาทและสิทธิ์' ? (
              <DataTable
                rows={rolePermissionRows}
                getRowKey={(row) => row[0]}
                emptyMessage="ไม่พบข้อมูลบทบาท"
                columns={[
                  ...['บทบาท', 'สร้างคำขอ', 'ติดตาม', 'อนุมัติ / ตรวจสอบ'].map((header, index) => ({
                    key: `permission-${index}`,
                    header,
                    render: (row: string[]) => row[index],
                    sortValue: (row: string[]) => row[index],
                  })),
                ]}
              />
            ) : active === 'หน่วยงาน' ? (
              <DataTable
                rows={[...new Set([...demoAccounts.map((account) => account.unit), ...allRequests.map((item) => item.unit)])]}
                getRowKey={(unit) => unit}
                emptyMessage="ไม่พบข้อมูลหน่วยงาน"
                columns={[
                  { key: 'unit', header: 'หน่วยงาน', render: (unit) => <strong>{unit}</strong>, sortValue: (unit) => unit },
                  { key: 'users', header: 'บัญชีสาธิต', render: (unit) => demoAccounts.filter((account) => account.unit === unit).length, sortValue: (unit) => demoAccounts.filter((account) => account.unit === unit).length },
                  { key: 'requests', header: 'คำขอในระบบ', render: (unit) => allRequests.filter((item) => item.unit === unit).length, sortValue: (unit) => allRequests.filter((item) => item.unit === unit).length },
                ]}
              />
            ) : active === 'วงเงินอนุมัติ' ? (
              <DataTable
                rows={[
                  { rule: 'ไม่เกิน 10,000 บาท', route: 'หัวหน้าแผนก → ฝ่ายการเงิน', exception: 'ผู้ขอที่เป็นหัวหน้าแผนกข้ามขั้นหัวหน้าแผนก' },
                  { rule: 'มากกว่า 10,000 บาท', route: 'หัวหน้าแผนก → ผู้บริหาร → ฝ่ายการเงิน', exception: 'คำขอหัวหน้าแผนกข้ามขั้นตนเอง; ผู้บริหารอนุมัติคำขอตนเองไม่ได้' },
                  { rule: 'คำขอของผู้บริหาร', route: 'คณะกรรมการตรวจสอบ → ฝ่ายการเงิน', exception: 'แยกผู้อนุมัติออกจากผู้ขอ' },
                  { rule: 'คำขอของฝ่ายการเงิน', route: 'ผู้บริหาร', exception: 'ข้ามการตรวจของหัวหน้าแผนกที่ไม่ตรงหน่วยงาน และไม่ส่งกลับให้ผู้ขออนุมัติการจ่าย' },
                ]}
                getRowKey={(row) => row.rule}
                emptyMessage="ไม่พบเงื่อนไขวงเงิน"
                columns={[
                  { key: 'rule', header: 'เงื่อนไขวงเงิน', render: (row) => row.rule, sortValue: (row) => row.rule },
                  { key: 'route', header: 'สายอนุมัติ', render: (row) => row.route, sortValue: (row) => row.route },
                  { key: 'exception', header: 'ข้อยกเว้น', render: (row) => row.exception, sortValue: (row) => row.exception },
                ]}
              />
            ) : active === 'คำขอทั้งหมด' ? (
              <>
                <DataTable
                  rows={allRequests}
                  getRowKey={(item) => item.code}
                  emptyMessage="ยังไม่มีคำขอในระบบ"
                  columns={[
                    { key: 'code', header: 'เลขที่คำขอ', render: (item) => <><strong>{item.code}</strong><small>{item.date}</small></>, sortValue: (item) => item.code, searchValue: (item) => `${item.code} ${item.date}` },
                    { key: 'title', header: 'รายการ / ผู้ขอ', render: (item) => <><strong>{item.title}</strong><small>{item.requester} • {item.requesterRole}</small></>, sortValue: (item) => item.title, searchValue: (item) => `${item.title} ${item.requester} ${item.requesterRole}` },
                    { key: 'unit', header: 'หน่วยงาน', render: (item) => item.unit, sortValue: (item) => item.unit },
                    { key: 'amount', header: 'วงเงิน', render: (item) => money(item.amount), sortValue: (item) => Number(item.amount) || 0 },
                    { key: 'status', header: 'สถานะ', render: (item) => <StatusBadge status={approvalOverrides[item.code] ?? item.status} />, sortValue: (item) => approvalOverrides[item.code] ?? item.status },
                    { key: 'actions', header: 'รายละเอียด', render: (item) => <button type="button" className="view-detail" onClick={() => setSelectedRequest(item)}>ดูข้อมูลครบ</button> },
                  ]}
                />
                {selectedRequest && <RequestDetails
                  request={{ ...selectedRequest, status: approvalOverrides[selectedRequest.code] ?? selectedRequest.status }}
                  onClose={() => setSelectedRequest(null)}
                  canSubmitSettlement={employee && selectedRequest.requesterId === user.id && selectedRequest.requestType === 'เงินสดยืม' && (approvalOverrides[selectedRequest.code] ?? selectedRequest.status) === 'รอเคลียร์เงินยืม'}
                  onSubmitSettlement={(reference, date) => submitCashAdvanceSettlement(selectedRequest.code, reference, date)}
                />}
              </>
            ) : (
              <DataTable
                rows={auditEntries}
                getRowKey={(entry) => `${entry.code}-${entry.date}-${entry.actor}-${entry.action}`}
                emptyMessage="ยังไม่มีกิจกรรมในประวัติระบบ การสร้างหรือพิจารณาคำขอจะแสดงที่นี่"
                columns={[
                  { key: 'date', header: 'วันเวลา', render: (entry) => entry.date, sortValue: (entry) => entry.date, searchValue: (entry) => entry.date },
                  { key: 'actor', header: 'ผู้ดำเนินการ', render: (entry) => entry.actor, sortValue: (entry) => entry.actor },
                  { key: 'action', header: 'กิจกรรม', render: (entry) => entry.action, sortValue: (entry) => entry.action },
                  { key: 'code', header: 'เลขที่คำขอ', render: (entry) => entry.code, sortValue: (entry) => entry.code },
                ]}
              />
            )}
            <p className="management-note">หน้านี้เป็นข้อมูลสาธิตแบบ client-side ไม่ได้เชื่อมฐานข้อมูลหรือระบบจัดการบัญชีจริง</p>
          </section>
        ) : (
          <>
            <section className="role-banner"><div><p>ยินดีต้อนรับกลับมา</p><h2>คุณ{user.name}</h2><span>{user.unit} • {user.label}</span></div>{!admin && <button className="primary-action" onClick={() => setActive(employee || finance ? 'สร้างคำขอใหม่' : approvalMenuItem)}>{employee || finance ? '+ สร้างคำขอใหม่' : 'ดูคำขอรออนุมัติ'}</button>}</section>
            {finance
              ? <FinanceReview mode="summary" approvalCandidates={approvalCandidates} allRequests={allRequests} myRequests={myRequests} />
              : <section className="stats-grid">{stats.map((stat, index) => <article className="stat-card" key={stat[0]}><div className={`stat-icon color-${index}`}>{['▦', '✓', '↻', '฿'][index]}</div><div><p>{stat[0]}</p><strong>{stat[1]}</strong><small>{stat[2]}</small></div></article>)}</section>}
            <section className="overview-grid"><article className="panel overview-workflow"><div className="panel-header"><div><h2>กระบวนการคำขอ</h2><p>ภาพรวมภารกิจตามบทบาทของคุณวันนี้</p></div><span className="live-badge">อัปเดตสด</span></div><div className="workflow-cards"><div><span className="workflow-icon submitted">↗</span><div><strong>{approvalCandidates.length}</strong><small>{'คำขอรอดำเนินการ'}</small></div></div><div><span className="workflow-icon approved">✓</span><div><strong>63</strong><small>อนุมัติแล้วเดือนนี้</small></div></div><div><span className="workflow-icon revised">↺</span><div><strong>13</strong><small>คำขอต้องแก้ไข</small></div></div></div><div className="workflow-route"><div className="workflow-route-head"><strong>สภาวะการอนุมัติ</strong><span>ระบบเดือนตุลาคม 2569</span></div><div className="pipeline-bars"><div><span>ส่งคำขอ</span><i><b style={{ width: '92%' }} /></i><strong>128</strong></div><div><span>ตรวจสอบ</span><i><b style={{ width: '68%' }} /></i><strong>52</strong></div><div><span>อนุมัติ</span><i><b style={{ width: '49%' }} /></i><strong>63</strong></div></div></div></article><article className="panel overview-budget"><div className="panel-header"><div><h2>งบประมาณที่รับผิดชอบ</h2><p>{roleBudget.scope}</p></div><span className="budget-year-badge">ปีงบ {budgetYear}</span></div>{admin ? <div className="admin-overview-note"><strong>โหมดผู้ดูแลระบบ</strong><span>ติดตามผู้ใช้ สิทธิ์ หน่วยงาน และประวัติระบบ ไม่มีสิทธิ์สร้างหรืออนุมัติคำขอ</span></div> : <><div className="budget-ring" style={{ background: `conic-gradient(#245cbe 0 ${roleBudget.total ? Math.min(100, Math.round(roleBudget.used / roleBudget.total * 100)) : 0}%, #edf1f7 0)` }}><div><strong>{roleBudget.total ? Math.round(roleBudget.used / roleBudget.total * 100) : 0}%</strong><span>ใช้งบไปแล้ว</span></div></div><div className="budget-legend"><div><span>งบทั้งหมด</span><strong>{roleBudget.total.toLocaleString('th-TH')} บาท</strong></div><div><span>ใช้งบไปแล้ว</span><strong>{roleBudget.used.toLocaleString('th-TH')} บาท</strong></div><div><span>คงเหลือโดยประมาณ</span><strong>{Math.max(0, roleBudget.total - roleBudget.used - committedAmount).toLocaleString('th-TH')} บาท</strong></div></div></>}</article></section><section className="panel overview-tasks"><div className="panel-header"><div><h2>{admin ? 'งานดูแลระบบวันนี้' : 'สิ่งที่ต้องดำเนินการ'}</h2><p>{admin ? 'รายการตรวจสอบและกำหนดสิทธิ์' : 'ภารกิจประจำบทบาทที่เกี่ยวข้องกับคำขอและงบประมาณ'}</p></div></div><div className="task-list"><div className="task-item"><span className="task-number">01</span><div><strong>{finance ? 'ตรวจคำขอที่ส่งมาที่ฝ่ายการเงิน' : 'ตรวจคำขอในขอบเขตอำนาจ'}</strong><p>{`มี ${approvalCandidates.length} คำขอรอการพิจารณาในระบบ`}</p></div><button type="button" onClick={() => setActive(finance ? FINANCE_REVIEW_MENU[0] : approvalMenuItem)}>เปิดรายการ</button></div><div className="task-item"><span className="task-number">02</span><div><strong>ตรวจวงเงินงบประมาณปีงบ {budgetYear}</strong><p>{admin ? 'ตรวจสอบผู้ใช้และบทบาทที่มีสิทธิ์ในระบบ' : 'ตรวจงบคงเหลือก่อนสร้างหรืออนุมัติคำขอ'}</p></div><button type="button" onClick={() => setActive(admin ? 'บทบาทและสิทธิ์' : 'รายงานงบประมาณ')}>ดูภาพรวม</button></div><div className="task-item"><span className="task-number">03</span><div><strong>จัดเตรียมเอกสารประกอบคำขอ</strong><p>เอกสารต้องตรงกับประเภทงบ รูปแบบการเบิก และเงื่อนไขการจ่าย</p></div><button type="button" onClick={() => setActive(canCreateRequest ? 'สร้างคำขอใหม่' : 'ประวัติระบบ')}>{canCreateRequest ? 'สร้างคำขอ' : 'ดูประวัติ'}</button></div>            </div></section><section className="panel overview-request-table"><div className="panel-header"><div><h2>{'คำขอที่เกี่ยวข้องล่าสุด'}</h2><p>{'รวมคำขอที่อยู่ในขอบเขตการทำงานของบทบาทคุณ'}</p></div><button type="button" onClick={() => setActive(approvalMenuItem)}>ดูรายละเอียดทั้งหมด</button></div><div className="table-wrap"><table><thead><tr><th>เลขที่คำขอ</th><th>รายการ</th><th>หน่วยงาน</th><th>วงเงิน</th><th>สถานะ</th></tr></thead><tbody>{(visibleRequests).slice(0, 6).map((item) => <tr key={item.code}><td><strong>{item.code}</strong><small>{item.date}</small></td><td><strong>{item.title}</strong><small>{item.requester ?? user.name}</small></td><td>{item.unit}</td><td>{money(item.amount)}</td><td><StatusBadge status={approvalOverrides[item.code] ?? item.status} /></td></tr>)}</tbody></table>{visibleRequests.length === 0 && <div className="empty-approval">ยังไม่มีคำขอในขอบเขตนี้</div>}</div></section>
          </>
        )}
      </div>
    </section>
  </main>
}
