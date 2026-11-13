import type { ApprovalScreenProps } from './types'
import { formatThaiDate } from './dateFormat'

type Props = ApprovalScreenProps & {
  description?: string
}

export function ApprovalQueue({
  activeSection,
  user,
  message,
  approvalScopeDescription,
  candidates,
  formatMoney,
  onSelectRequest,
  requestDetails,
  description,
  queueTitle,
  workflow,
}: Props) {
  const settlementQueue = activeSection === 'ติดตามเงินยืม'

  return (
    <section className="approval-page panel">
      <div className="panel-header">
        <div>
          <h2>{settlementQueue ? 'รายการรอเคลียร์เงินยืม' : queueTitle ?? 'คำขอในขอบเขตอำนาจ'}</h2>
          <p>
            {settlementQueue
              ? 'ตรวจหลักฐานการเคลียร์เงินยืมและปิดรายการ'
              : description ?? 'อนุมัติหรือส่งกลับแก้ไขตามบทบาทและวงเงินที่กำหนด'}
          </p>
        </div>
      </div>
      {message && <div className="form-message approval-message" role="status">{message}</div>}
      {!settlementQueue && (
        <ol className="approval-workflow">
          {workflow.map((step, index) => (
            <li key={step.status}>
              <span>{index + 1}</span>
              <div><strong>{step.label}</strong><small>{step.detail}</small></div>
            </li>
          ))}
        </ol>
      )}
      <div className="approval-scope">
        <strong>ขอบเขตสิทธิ์: {user.label}</strong>
        <span>
          {settlementQueue
            ? 'ฝ่ายการเงินตรวจหลักฐานการเคลียร์เงินยืมและปิดรายการหลังผู้ขอชำระคืน'
            : approvalScopeDescription}
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>เลขที่คำขอ</th>
              <th>รายการ</th>
              <th>หน่วยงาน</th>
              <th>วงเงิน</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((item) => (
              <tr key={item.code}>
                <td><strong>{item.code}</strong><small>{formatThaiDate(item.date)}</small></td>
                <td><strong>{item.title}</strong><small>{item.requester}</small></td>
                <td>{item.unit}</td>
                <td>{formatMoney(Number(item.amount ?? 0))}</td>
                <td>
                  <div className="approval-actions">
                    <button
                      type="button"
                      className="view-detail"
                      onClick={() => onSelectRequest(item)}
                    >
                      ดูรายละเอียดและดำเนินการ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <div className="empty-approval">ไม่มีคำขออยู่ในขอบเขตอำนาจของคุณในขณะนี้</div>
        )}
      </div>
      {requestDetails}
    </section>
  )
}
