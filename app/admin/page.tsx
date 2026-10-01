'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Stats = { searches:number; clicks:number; revenue:number; pending:number; currency:string; providers:any[]; sources:any[] };

export default function Admin() {
  const [authed,setAuthed]=useState<boolean|null>(null); const [password,setPassword]=useState(''); const [stats,setStats]=useState<Stats|null>(null); const [error,setError]=useState('');
  async function load(){ const r=await fetch('/api/admin/stats',{cache:'no-store'}); if(r.status===401){setAuthed(false);return;} const d=await r.json(); setAuthed(true); setStats(d.stats); }
  useEffect(()=>{load()},[]);
  async function login(e:React.FormEvent){e.preventDefault();setError('');const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});if(!r.ok){setError('كلمة المرور غير صحيحة');return;}setPassword('');load();}
  async function logout(){await fetch('/api/admin/logout',{method:'POST'});setAuthed(false);setStats(null)}
  if(authed===null) return <main className="adminPage"><div className="adminBox">جارٍ التحقق…</div></main>;
  if(!authed) return <main className="adminPage"><form className="adminBox" onSubmit={login}><span className="eyebrow">FINDCHECK ADMIN</span><h1>لوحة التحكم</h1><p>هذه المنطقة خاصة بك. لا تشارك كلمة المرور.</p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة مرور الإدارة" autoComplete="current-password"/><button>دخول</button>{error&&<div className="adminError">{error}</div>}</form></main>;
  return <main className="adminPage"><header className="adminHeader"><div><span className="eyebrow">FINDCHECK ADMIN</span><h1>لوحة التحكم</h1></div><div className="adminActions"><a href="/">فتح الموقع ↗</a><button onClick={logout}>خروج</button></div></header><section className="statGrid"><Stat label="عمليات البحث" value={stats?.searches??0}/><Stat label="النقرات" value={stats?.clicks??0}/><Stat label="إيرادات مؤكدة" value={`$${(stats?.revenue??0).toFixed(2)}`}/><Stat label="قيد الانتظار" value={`$${(stats?.pending??0).toFixed(2)}`}/></section><section className="adminGrid"><Panel title="مزودو البحث والذكاء"><div className="rows">{(stats?.providers??[]).map(p=><div className="row" key={p.id}><div><b>{p.name}</b><small>{p.kind} · {p.usage_count}/{p.monthly_limit??'∞'}</small></div><span className={p.enabled?'on':'off'}>{p.enabled?'ON':'OFF'}</span></div>)}{!(stats?.providers??[]).length&&<p className="muted">لم تتم إضافة مزودي API بعد.</p>}</div></Panel><Panel title="مصادر الإيرادات"><div className="rows">{(stats?.sources??[]).map(s=><div className="row" key={s.id}><div><b>{s.name}</b><small>{s.kind} · {s.payout_provider??'وسيلة السحب غير محددة'}</small></div><span className={s.enabled?'on':'off'}>{s.enabled?'ACTIVE':'OFF'}</span></div>)}{!(stats?.sources??[]).length&&<p className="muted">سنضيف Affiliate / Sponsored / Ads / Premium.</p>}</div></Panel></section><section className="notice"><b>الأسرار لا تظهر هنا.</b> مفاتيح Tavily/Groq/OpenAI وSupabase تُحفظ كـ Secret Environment Variables في Vercel، وليس في المتصفح أو GitHub.</section></main>;
}
function Stat({label,value}:{label:string;value:any}){return <div className="stat"><span>{label}</span><strong>{value}</strong></div>}
function Panel({title,children}:{title:string;children:ReactNode}){return <div className="panel"><h2>{title}</h2>{children}</div>}
