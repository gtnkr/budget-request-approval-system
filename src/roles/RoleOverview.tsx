import { getStatusToneClass, type HomeScreenProps, type RoleRequest } from './types'
import { formatThaiDate } from './dateFormat'

type Props = HomeScreenProps & {
  title: string
  description: string
  showBudget?: boolean
}

type RequestListProps = {
  title: string
  requests: RoleRequest[]
  formatMoney: (amount: number) => string
  onSelectRequest: (request: RoleRequest) => void
  onOpenList: () => void
  emptyMessage: string
}

function RequestList({ title, requests, formatMoney, onSelectRequest, onOpenList, emptyMessage }: RequestListProps) {
  return (
    <article className="panel role-request-panel">
      <div className="panel-header">
        <div><h2>{title}</h2><p>{requests.length} รายการ</p></div>
        <button type="button" className="role-request-see-all" onClick={onOpenList}>ดูทั้งหมด</button>
      </div>
      <div className="role-request-list">
        {requests.map((request) => (
          <button
            className="role-request-row"
            key={request.code}
            type="button"
            onClick={() => onSelectRequest(request)}
            aria-label={`ดูรายละเอียดคำขอ ${request.code}: ${request.title}`}
          >
            <div className="role-request-copy">
              <strong>{request.title || 'คำขอไม่ระบุชื่อ'}</strong>
              <small>{request.code} • {request.requester} • {formatThaiDate(request.date)}</small>
            </div>
            <span className={`status ${getStatusToneClass(request.status)}`}>{request.status}</span>
            <strong className="role-request-amount">{formatMoney(Number(request.amount || 0))}</strong>
          </button>
        ))}
        {requests.length === 0 && <p className="role-empty-state">{emptyMessage}</p>}
      </div>
    </article>
  )
}

export function RoleOverview({
  user,
  stats,
  myRequests,
  urgentRequests,
  urgentTitle,
  roleBudget,
  committedAmount,
  formatMoney,
  onOpenList,
  onOpenMyRequests,
  showMyRequests,
  onSelectRequest,
  title,
  description,
  showBudget = true,
}: Props) {
  const remainingBudget = Math.max(0, roleBudget.total - roleBudget.used - committedAmount)
  const budgetUsage = roleBudget.total
    ? Math.min(100, Math.round((roleBudget.used / roleBudget.total) * 100))
    : 0
  return (
    <div className="role-overview">
      <section className="role-banner">
        <div>
          <p>{title}</p>
          <h2>คุณ{user.name}</h2>
          <span>{user.unit} • {user.label}</span>
        </div>
      </section>

      <p className="role-overview-description">{description}</p>

      <section className="stats-grid" aria-label="สรุปภาพรวม">
        {stats.map((stat, index) => (
          <article className="stat-card" key={stat[0]}>
            <div className={`stat-icon color-${index}`}>{['▦', '✓', '↻', '฿'][index % 4]}</div>
            <div><p>{stat[0]}</p><strong>{stat[1]}</strong><small>{stat[2]}</small></div>
          </article>
        ))}
      </section>

      <section className={`role-overview-primary ${showBudget ? '' : 'without-budget'}`} aria-label="สรุปงานเร่งด่วน">
        {showBudget && (
          <article className="panel role-budget-panel">
            <div className="panel-header">
              <div><h2>วงเงินที่รับผิดชอบ</h2><p>{roleBudget.scope}</p></div>
            </div>
            <div
              className="budget-ring"
              style={{ background: `conic-gradient(#245cbe 0 ${budgetUsage}%, #edf1f7 ${budgetUsage}% 100%)` }}
            >
              <div><strong>{budgetUsage}%</strong><span>ใช้งบไปแล้ว</span></div>
            </div>
            <div className="budget-legend">
              <div><span>วงเงินทั้งหมด</span><strong>{formatMoney(roleBudget.total)}</strong></div>
              <div><span>ใช้งบไปแล้ว</span><strong>{formatMoney(roleBudget.used)}</strong></div>
              <div><span>กันไว้ในคำขอ</span><strong>{formatMoney(committedAmount)}</strong></div>
              <div><span>คงเหลือประมาณ</span><strong>{formatMoney(remainingBudget)}</strong></div>
            </div>
          </article>
        )}

        <RequestList
          title={urgentTitle}
          requests={urgentRequests.slice(0, 3)}
          formatMoney={formatMoney}
          onSelectRequest={onSelectRequest}
          onOpenList={onOpenList}
          emptyMessage="ไม่มีรายการเร่งด่วนในขณะนี้"
        />
      </section>

      {showMyRequests && (
        <section className="role-overview-my-requests" aria-label="คำขอของฉัน">
          <RequestList
            title="คำขอของฉัน"
            requests={myRequests.slice(0, 3)}
            formatMoney={formatMoney}
            onSelectRequest={onSelectRequest}
            onOpenList={onOpenMyRequests}
            emptyMessage="ยังไม่มีคำขอที่คุณสร้าง"
          />
        </section>
      )}

    </div>
  )
}
