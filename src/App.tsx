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
    name: 'พิมพ์ชนก วัฒนากุล',
    unit: 'แผนกเทคโนโลยี',
    canCreateRequest: true,
  },
  {
    id: 'department-head',
    username: 'หัวหน้าแผนก',
    password: 'หัวหน้าแผนก',
    label: 'หัวหน้าแผนก',
    name: 'ธนกร ศรีสวัสดิ์',
    unit: 'แผนกเทคโนโลยี',
    canCreateRequest: true,
  },
  {
    id: 'executive',
    username: 'ผู้บริหาร',
    password: 'ผู้บริหาร',
    label: 'ผู้บริหาร',
    name: 'กิตติพงษ์ วัฒนชัย',
    unit: 'ผู้บริหารองค์กร',
    canCreateRequest: true,
  },
  {
    id: 'finance',
    username: 'ฝ่ายการเงิน',
    password: 'ฝ่ายการเงิน',
    label: 'ฝ่ายการเงิน',
    name: 'อรทัย พูลสวัสดิ์',
    unit: 'ฝ่ายการเงิน',
    canCreateRequest: true,
  },
  {
    id: 'committee',
    username: 'คณะกรรมการตรวจสอบ',
    password: 'คณะกรรมการตรวจสอบ',
    label: 'คณะกรรมการตรวจสอบ',
    name: 'ณัฐกานต์ วงศ์ประเสริฐ',
    unit: 'คณะกรรมการตรวจสอบภายใน',
    canCreateRequest: false,
  },
  {
    id: 'admin',
    username: 'แอดมิน',
    password: 'แอดมิน',
    label: 'แอดมิน',
    name: 'ภาคิน นาคเจริญ',
    unit: 'ฝ่ายระบบสารสนเทศ',
    canCreateRequest: false,
  },
] as const

type DemoUser = (typeof accounts)[number]
const sessionKey = 'budget-demo-user'

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
          <img src={`${import.meta.env.BASE_URL}budget-mark.svg`} alt="ระบบคำขอและอนุมัติงบประมาณ" />
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
        <details className="login-demo">
          <summary>บัญชีสำหรับทดลองใช้งาน</summary>
          <p>ใช้ชื่อบทบาทเป็นทั้งชื่อผู้ใช้และรหัสผ่าน</p>
          <div className="login-demo-roles">
            {accounts.map((account) => (
              <span key={account.id}>{account.label}</span>
            ))}
          </div>
        </details>
      </section>
    </main>
  )
}

export default App
