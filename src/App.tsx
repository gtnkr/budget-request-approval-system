import { useState } from 'react'
import './App.css'
import { Dashboard } from './Dashboard'

/* =========================================
   ส่วนที่ 1 — สมาชิกคนที่ 1 พรีเซนต์ระบบล็อกอิน
   โครงสร้างเดิมยังอยู่ในไฟล์นี้ แต่เชื่อมโยงกับส่วนข้อมูลบัญชี demo ในเอกสารโครงสร้างพรีเซนต์
   หน้าที่: ข้อมูลบัญชีทดลอง, การตรวจรหัสผ่าน และการบันทึกผู้ใช้ปัจจุบัน
   ========================================= */
const accounts = [
  { id: 'employee', username: 'employee', password: 'demo1234', label: 'พนักงาน', name: 'นภาพร ทองดี', unit: 'แผนกเทคโนโลยี', canCreateRequest: true },
  { id: 'department-head', username: 'department_head', password: 'demo1234', label: 'หัวหน้าแผนก', name: 'สมชาย ใจดี', unit: 'แผนกเทคโนโลยี', canCreateRequest: true },
  { id: 'director', username: 'director', password: 'demo1234', label: 'ผู้อำนวยการฝ่าย', name: 'วิชิต มีสุข', unit: 'ฝ่ายบริหาร', canCreateRequest: true },
  { id: 'dean', username: 'dean', password: 'demo1234', label: 'คณบดี', name: 'รัตนา วิริยะ', unit: 'คณะวิศวกรรมศาสตร์', canCreateRequest: true },
  { id: 'executive', username: 'executive', password: 'demo1234', label: 'ผู้บริหาร', name: 'ประเสริฐ รัตนชัย', unit: 'ผู้บริหารองค์กร', canCreateRequest: true },
  { id: 'finance', username: 'finance', password: 'demo1234', label: 'ฝ่ายการเงิน', name: 'มนัสวิน ดีงาม', unit: 'ฝ่ายการเงิน', canCreateRequest: true },
  { id: 'committee', username: 'committee', password: 'demo1234', label: 'คณะกรรมการตรวจสอบ', name: 'คณะกรรมการตรวจสอบภายใน', unit: 'คณะกรรมการอิสระ', canCreateRequest: false },
  { id: 'admin', username: 'admin', password: 'demo1234', label: 'แอดมิน', name: 'ผู้ดูแลระบบ', unit: 'ฝ่ายระบบสารสนเทศ', canCreateRequest: false },
] as const

type DemoUser = (typeof accounts)[number]

const sessionKey = 'budget-demo-user'

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M8 7h8M8 11h4M8 15h2M14 15h2M16 18.5V13M13.5 15.5h5" />
    </svg>
  )
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showAccounts, setShowAccounts] = useState(false)
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    const saved = sessionStorage.getItem(sessionKey)
    return accounts.find((account) => account.id === saved) ?? null
  })

  // ตรวจสอบชื่อผู้ใช้และรหัสผ่านจากบัญชี demo ที่กำหนดไว้ด้านบน
  const login = () => {
    const account = accounts.find(
      (item) => item.username.toLowerCase() === username.trim().toLowerCase() && item.password === password,
    )

    if (!account) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      return
    }

    sessionStorage.setItem(sessionKey, account.id)
    setDemoUser(account)
    setShowAccounts(false)
    setError('')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  // ออกจากระบบและล้างข้อมูลผู้ใช้เพื่อป้องกันหน้าเดิมค้างจากบัญชีก่อนหน้า
  const logout = () => {
    sessionStorage.removeItem(sessionKey)
    setDemoUser(null)
    setUsername('')
    setPassword('')
    setShowAccounts(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  // กดบัญชีทดลองแล้วเติมชื่อผู้ใช้และรหัสผ่านลงในฟอร์มล็อกอินอัตโนมัติ
  const fillAccount = (account: DemoUser) => {
    setUsername(account.username)
    setPassword(account.password)
    setError('')
  }

  if (demoUser) {
    return <Dashboard key={demoUser.id} user={demoUser} logout={logout} />
  }

  return (
    <main className="login-page">
      <section className={`login-card ${showAccounts ? 'with-account-list' : ''}`} aria-labelledby="login-title">
        <div className="brand-mark"><BudgetIcon /></div>
        <div className="login-heading">
          <p className="eyebrow">Budget Management System</p>
          <h1 id="login-title">ระบบคำขอและอนุมัติงบประมาณ</h1>
          <p>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        <form className="login-form" onSubmit={(event) => { event.preventDefault(); login() }}>
          <label>
            <span>ชื่อผู้ใช้</span>
            <input
              type="text"
              value={username}
              onChange={(event) => { setUsername(event.target.value); setError('') }}
              placeholder="กรอกชื่อผู้ใช้"
              autoComplete="username"
              autoFocus
            />
          </label>
          <label>
            <span>รหัสผ่าน</span>
            <input
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError('') }}
              placeholder="กรอกรหัสผ่าน"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-button login-submit">เข้าสู่ระบบ</button>
        </form>

        <button type="button" className="account-toggle" onClick={() => setShowAccounts((value) => !value)}>
          {showAccounts ? 'ซ่อนบัญชีทดลอง' : 'ดูบัญชีทดลองทั้งหมด'}
        </button>

        {showAccounts && (
          <div className="account-list" aria-label="บัญชีทดลอง">
            {accounts.map((account) => (
              <button type="button" className="account-row" key={account.id} onClick={() => fillAccount(account)}>
                <span><strong>{account.label}</strong><small>{account.name}</small></span>
                <code>{account.username}</code>
              </button>
            ))}
          </div>
        )}

        <div className="demo-note"><span />โหดนำเสนอ — รหัสผ่านทุกบัญชีคือ <strong>demo1234</strong></div>
      </section>
    </main>
  )
}

export default App
