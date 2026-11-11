export const FINANCE_REVIEW_MENU = ['ตรวจสอบการเงิน', 'ติดตามเงินยืม'] as const

export type DemoUser = {
  id: string
  username: string
  password: string
  label: string
  name: string
  unit: string
  canCreateRequest?: boolean
}

export type ApprovalDetails = {
  comment: string
  paymentReference: string
  paymentDate: string
  settlementReference: string
  settlementDate: string
}

export type RequestExpenseItem = {
  name: string
  detail: string
  amount: string | number
}

export type RequestAttachment = {
  type: string
  name: string
  size?: number
}

export type ApprovalHistoryEntry = {
  step: string
  label?: string
  actor?: string
  result: string
  date?: string
  comment?: string
}

export type RequestRecord = {
  code: string
  title: string
  requester: string
  requesterRole?: string
  requesterId?: string
  unit: string
  amount: number
  date: string
  status: string
  category?: string
  requestType?: string
  requestTiming?: string
  budgetYear?: string
  requestDate?: string
  neededDate?: string
  projectName?: string
  description?: string
  financeReferenceNo?: string
  financePurpose?: string
  paymentReference?: string
  paymentDate?: string
  settlementReference?: string
  submittedSettlementDate?: string
  settlementCloseReference?: string
  actualSettlementDate?: string
  expenseItems?: RequestExpenseItem[]
  recipientName?: string
  taxId?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  settlementDate?: string
  attachments?: RequestAttachment[]
  approvalHistory?: ApprovalHistoryEntry[]
}

export type FinanceSummaryStat = [label: string, value: string, description: string]
