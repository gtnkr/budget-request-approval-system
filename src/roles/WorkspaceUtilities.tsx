import type { DemoUser, RoleRequest } from './types'

export type WorkspaceNotification = {
  id: string
  title: string
  detail: string
  destination: string
  request?: RoleRequest
}

export type NotificationPreferences = {
  requestUpdates: boolean
  approvalTasks: boolean
  systemUpdates: boolean
}

export function NotificationsPage({
  notifications,
  readIds,
  onMarkRead,
  onMarkAllRead,
  onSelect,
}: {
  notifications: WorkspaceNotification[]
  readIds: string[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onSelect: (notification: WorkspaceNotification) => void
}) {
  const unreadCount = notifications.filter((notification) => !readIds.includes(notification.id)).length

  return (
    <section className="panel utility-page notifications-page">
      <div className="panel-header">
        <div><h2>การแจ้งเตือน</h2><p>{unreadCount ? `ยังไม่ได้อ่าน ${unreadCount} รายการ` : 'อ่านการแจ้งเตือนทั้งหมดแล้ว'}</p></div>
        <button type="button" onClick={onMarkAllRead} disabled={unreadCount === 0}>อ่านทั้งหมด</button>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => {
          const isRead = readIds.includes(notification.id)
          return (
            <article className={`notification-item ${isRead ? 'is-read' : 'is-unread'}`} key={notification.id}>
              <span className="notification-indicator" aria-hidden="true">{isRead ? '✓' : '●'}</span>
              <button type="button" className="notification-copy" onClick={() => onSelect(notification)}>
                <strong>{notification.title}</strong>
                <span>{notification.detail}</span>
                {notification.request && <small>{notification.request.code} • {notification.request.title}</small>}
              </button>
              {!isRead && <button type="button" className="notification-mark-read" onClick={() => onMarkRead(notification.id)}>ทำเครื่องหมายว่าอ่านแล้ว</button>}
            </article>
          )
        })}
        {notifications.length === 0 && (
          <div className="utility-empty-state">
            <strong>ยังไม่มีการแจ้งเตือน</strong>
            <span>เมื่อมีงานที่ต้องดำเนินการหรือสถานะคำขอเปลี่ยนแปลง รายการจะแสดงที่นี่</span>
          </div>
        )}
      </div>
    </section>
  )
}

export function ProfileSettingsPage({
  user,
  preferences,
  onPreferenceChange,
}: {
  user: DemoUser
  preferences: NotificationPreferences
  onPreferenceChange: (key: keyof NotificationPreferences, value: boolean) => void
}) {
  const options: Array<{ key: keyof NotificationPreferences; label: string; detail: string }> = [
    { key: 'requestUpdates', label: 'ความคืบหน้าคำขอของฉัน', detail: 'แจ้งเมื่อคำขอถูกอนุมัติ ส่งแก้ไข หรือเปลี่ยนสถานะ' },
    { key: 'approvalTasks', label: 'งานที่รอฉันดำเนินการ', detail: 'แจ้งเมื่อมีรายการใหม่ในคิวอนุมัติหรือตรวจสอบ' },
    { key: 'systemUpdates', label: 'กิจกรรมและข้อมูลระบบ', detail: 'แจ้งกิจกรรมระบบที่เกี่ยวข้องกับบทบาทของคุณ' },
  ]

  return (
    <div className="utility-page profile-settings-page">
      <section className="panel">
        <div className="panel-header"><div><h2>โปรไฟล์ผู้ใช้</h2><p>ข้อมูลบัญชีที่ใช้ในระบบ</p></div></div>
        <div className="profile-details">
          <div className="profile-avatar" aria-hidden="true">{user.name.charAt(0)}</div>
          <dl>
            <div><dt>ชื่อผู้ใช้</dt><dd>{user.name}</dd></div>
            <div><dt>บัญชี</dt><dd>{user.username}</dd></div>
            <div><dt>บทบาท</dt><dd>{user.label}</dd></div>
            <div><dt>หน่วยงาน</dt><dd>{user.unit}</dd></div>
          </dl>
        </div>
        <p className="utility-note">ข้อมูลโปรไฟล์แสดงจากบัญชีสาธิต และแก้ไขได้โดยผู้ดูแลระบบเท่านั้น</p>
      </section>

      <section className="panel">
        <div className="panel-header"><div><h2>ตั้งค่าการแจ้งเตือน</h2><p>เลือกรายการที่ต้องการแสดงในศูนย์แจ้งเตือน</p></div></div>
        <div className="preference-list">
          {options.map((option) => (
            <label className="preference-row" key={option.key}>
              <span><strong>{option.label}</strong><small>{option.detail}</small></span>
              <input
                type="checkbox"
                checked={preferences[option.key]}
                onChange={(event) => onPreferenceChange(option.key, event.target.checked)}
              />
            </label>
          ))}
        </div>
        <p className="utility-note">การตั้งค่าจะถูกบันทึกไว้ในเบราว์เซอร์นี้ การแจ้งเตือนภายนอก เช่น อีเมล ยังไม่เชื่อมต่อในระบบสาธิต</p>
      </section>
    </div>
  )
}

export function HelpCenterPage({ user }: { user: DemoUser }) {
  const guidance: Record<string, { heading: string; steps: string[] }> = {
    employee: {
      heading: 'พนักงาน',
      steps: ['สร้างคำขอและแนบเอกสารประกอบให้ครบถ้วน', 'ติดตามสถานะและเปิดรายละเอียดจากเมนูคำขอของฉัน', 'ดำเนินการแก้ไขหรือส่งหลักฐานเคลียร์เงินยืมเมื่อระบบแจ้ง'],
    },
    'department-head': {
      heading: 'หัวหน้าแผนก',
      steps: ['ตรวจรายละเอียดและวงเงินของคำขอในหน่วยงาน', 'อนุมัติหรือส่งกลับแก้ไขพร้อมระบุเหตุผล', 'ติดตามคำขอของตนเองได้จากเมนูคำขอของฉัน'],
    },
    executive: {
      heading: 'ผู้บริหาร',
      steps: ['ตรวจความจำเป็น วงเงิน และประวัติการพิจารณา', 'อนุมัติหรือส่งกลับแก้ไขพร้อมระบุเหตุผล', 'ติดตามคำขอของตนเองแยกจากคิวอนุมัติ'],
    },
    finance: {
      heading: 'ฝ่ายการเงิน',
      steps: ['ตรวจคำขอที่ผ่านการอนุมัติและรายละเอียดการจ่าย', 'บันทึกข้อมูลการจ่ายหรือการตรวจหลักฐานเงินยืม', 'ติดตามคำขอที่สร้างในบัญชีของตนเองได้แยกจากคิวตรวจสอบ'],
    },
    committee: {
      heading: 'คณะกรรมการตรวจสอบ',
      steps: ['ตรวจคำขอที่ส่งถึงคณะกรรมการและประวัติการอนุมัติ', 'พิจารณาข้อมูลประกอบก่อนอนุมัติหรือส่งกลับแก้ไข', 'ติดตามรายการที่รอคณะกรรมการจากคิวงานและการแจ้งเตือน'],
    },
    admin: {
      heading: 'ผู้ดูแลระบบ',
      steps: ['ดูแลบัญชีผู้ใช้ บทบาท หน่วยงาน และวงเงิน', 'ตรวจประวัติกิจกรรมและติดตามสถานะคำขอ', 'บัญชีผู้ดูแลไม่มีสิทธิ์อนุมัติคำขอ'],
    },
  }
  const roleGuide = guidance[user.id] ?? guidance.employee

  return (
    <section className="panel utility-page help-center-page">
      <div className="panel-header"><div><h2>ศูนย์ช่วยเหลือ</h2><p>แนวทางใช้งานสำหรับ{roleGuide.heading}</p></div></div>
      <div className="help-content">
        <h3>งานที่ทำได้ในบทบาทของคุณ</h3>
        <ol>{roleGuide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <div className="help-contact">
          <strong>ต้องการความช่วยเหลือเพิ่มเติม?</strong>
          <p>ติดต่อผู้ดูแลระบบของหน่วยงานเพื่อสอบถามสิทธิ์หรือปัญหาการใช้งาน ระบบสาธิตนี้ยังไม่มีช่องทางติดต่อหรือระบบรับแจ้งปัญหาในตัว</p>
        </div>
      </div>
    </section>
  )
}
