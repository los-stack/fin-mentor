import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, LockKeyhole, Mail, Wallet } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const errorCode = hash.get('error_code')
    const errorDescription = hash.get('error_description')
    if (errorCode || errorDescription) {
      setMessage(errorCode === 'otp_expired' ? 'Посилання вже недійсне. Запросіть нове підтвердження email.' : 'Не вдалося підтвердити email. Спробуйте надіслати посилання ще раз.')
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage('')
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName }, emailRedirectTo: import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/` } })
    setLoading(false)
    if (result.error) setMessage(mode === 'signin' ? 'Перевірте email і пароль.' : 'Не вдалося створити акаунт. Перевірте дані.')
    else if (mode === 'signup' && !result.data.session) setMessage('Перевірте пошту та підтвердіть email.')
  }

  return <main className="auth-shell"><div className="auth-card">
    <div className="auth-brand"><span className="auth-logo"><Wallet size={19} /></span><span>FinMentor</span></div>
    <span className="eyebrow">Ваш фінансовий простір</span>
    <h1>{mode === 'signin' ? 'Раді вас бачити' : 'Створіть свій акаунт'}</h1>
    <p className="auth-copy">Зберігайте операції, налаштування та прогрес навчання в одному безпечному просторі.</p>
    <form onSubmit={submit} className="auth-form">
      {mode === 'signup' && <label><span>Ваше імʼя</span><input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Олексій" required /></label>}
      <label><span>Email</span><div className="auth-input"><Mail size={16}/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div></label>
      <label><span>Пароль</span><div className="auth-input"><LockKeyhole size={16}/><input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Мінімум 6 символів" required /></div></label>
      {message && <p className="auth-message">{message}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Зачекайте…' : mode === 'signin' ? 'Увійти' : 'Зареєструватися'} <ArrowRight size={17}/></button>
    </form>
    <button className="auth-switch" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage('') }}>{mode === 'signin' ? 'Ще немає акаунта? Зареєструватися' : 'Вже маєте акаунт? Увійти'}</button>
  </div></main>
}
