import { useState, type FormEvent } from 'react'
import './App.css'
import { Dashboard } from './Dashboard'

// บัญชีสาธิต: ใช้ชื่อ role ภาษาไทยเป็นทั้งชื่อผู้ใช้และรหัสผ่าน
const accounts = [
  {
    id: 'employee',
    username: 'พนักงาน',
    password: 'พนักงาน',
    label: 'พนักงาน',
    name: 'นภาพร ทองดี',
    unit: 'แผนกเทคโนโลยี',
    canCreateRequest: true,
  },
  {
    id: 'department-head',
    username: 'หัวหน้าแผนก',
    password: 'หัวหน้าแผนก',
    label: 'หัวหน้าแผนก',
    name: 'สมชาย ใจดี',
    unit: 'แผนกเทคโนโลยี',
    canCreateRequest: true,
  },
  {
    id: 'executive',
    username: 'ผู้บริหาร',
    password: 'ผู้บริหาร',
    label: 'ผู้บริหาร',
    name: 'ประเสริฐ รัตนชัย',
    unit: 'ผู้บริหารองค์กร',
    canCreateRequest: true,
  },
  {
    id: 'finance',
    username: 'ฝ่ายการเงิน',
    password: 'ฝ่ายการเงิน',
    label: 'ฝ่ายการเงิน',
    name: 'มนัสวิน ดีงาม',
    unit: 'ฝ่ายการเงิน',
    canCreateRequest: true,
  },
  {
    id: 'committee',
    username: 'คณะกรรมการตรวจสอบ',
    password: 'คณะกรรมการตรวจสอบ',
    label: 'คณะกรรมการตรวจสอบ',
    name: 'คณะกรรมการตรวจสอบภายใน',
    unit: 'คณะกรรมการอิสระ',
    canCreateRequest: false,
  },
  {
    id: 'admin',
    username: 'แอดมิน',
    password: 'แอดมิน',
    label: 'แอดมิน',
    name: 'ผู้ดูแลระบบ',
    unit: 'ฝ่ายระบบสารสนเทศ',
    canCreateRequest: false,
  },
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
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    const savedUserId = sessionStorage.getItem(sessionKey)
    return accounts.find((account) => account.id === savedUserId) ?? null
  })

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const account = accounts.find(
      (item) =>
        item.username.toLowerCase() === username.trim().toLowerCase() &&
        item.password === password,
    )

    if (!account) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      return
    }

    sessionStorage.setItem(sessionKey, account.id)
    setDemoUser(account)
    setError('')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  function handleLogout() {
    sessionStorage.removeItem(sessionKey)
    setDemoUser(null)
    setUsername('')
    setPassword('')
    setError('')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  if (demoUser) {
    return <Dashboard key={demoUser.id} user={demoUser} logout={handleLogout} />
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark">
          <BudgetIcon />
        </div>
        <div className="login-heading">
          <p className="eyebrow">Budget Management System</p>
          <h1 id="login-title">ระบบคำขอและอนุมัติงบประมาณ</h1>
          <p>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            <span>ชื่อผู้ใช้</span>
            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                setError('')
              }}
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
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              placeholder="กรอกรหัสผ่าน"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-button login-submit">
            เข้าสู่ระบบ
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
