'use client';
import { FormEvent, useState } from 'react';

type Result={title:string;url:string;source:string;description:string;price?:string;type:string;sponsored:boolean;evidence:string[];risk:string[]};

export default function Home(){
 const [q,setQ]=useState(''); const [country,setCountry]=useState('DZ'); const [results,setResults]=useState<Result[]>([]); const [loading,setLoading]=useState(false); const [searched,setSearched]=useState(false); const [open,setOpen]=useState<number|null>(null); const [demo,setDemo]=useState(false); const [error,setError]=useState(''); const [warning,setWarning]=useState('');
 async function search(e?:FormEvent){
  e?.preventDefault();
  const query=q.trim();
  if(!query){setError('اكتب ما الذي تبحث عنه أولاً.');return;}
  setLoading(true);setSearched(true);setOpen(null);setError('');setWarning('');
  try{
    const r=await fetch('/api/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,country})});
    const raw=await r.text();
    let d:any;
    try{d=JSON.parse(raw)}catch{throw new Error(`SEARCH_API_NON_JSON_${r.status}`)}
    if(!r.ok)throw new Error(d?.error||`SEARCH_API_${r.status}`);
    setResults(Array.isArray(d.results)?d.results:[]);
    setDemo(Boolean(d.demo));
    setWarning(d.warning||'');
  }catch(err){
    setResults([]);setDemo(false);
    setError(err instanceof Error?err.message:'تعذر الاتصال بمحرك البحث');
  }finally{setLoading(false)}
}
 return <main>
  <nav className="nav"><div className="brand"><span className="logo">✓</span> FindCheck</div><div className="navlinks"><span>Find</span><span>Compare</span><span>Check</span></div><button type="button" className="ghost">كيف يعمل؟</button></nav>
  <section className="hero"><div className="eyebrow">GLOBAL DECISION ENGINE</div><h1>ابحث. قارن. <em>تحقّق.</em></h1><p>قل لنا ما الذي تريده. FindCheck يساعدك على العثور على الخيارات، مقارنتها، وفهم الأدلة ومؤشرات المخاطر قبل أن تتخذ قرارك.</p>
   <form onSubmit={search} className="searchbox"><div className="searchicon">⌕</div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="مثال: لابتوب أقل من 700$ يشحن إلى الجزائر"/><select value={country} onChange={e=>setCountry(e.target.value)}><option value="DZ">🇩🇿 الجزائر</option><option value="SA">🇸🇦 السعودية</option><option value="AE">🇦🇪 الإمارات</option><option value="US">🇺🇸 USA</option></select><button type="submit">{loading?'جارٍ البحث…':'ابحث الآن'}</button></form>
   <div className="chips"><button type="button" onClick={()=>{setQ('لابتوب أقل من 700$');}}>💻 لابتوب</button><button type="button" onClick={()=>{setQ('وظيفة عن بعد للمبتدئين');}}>💼 وظيفة</button><button type="button" onClick={()=>{setQ('هل هذا الموقع موثوق؟');}}>🛡️ تحقق من موقع</button><button type="button" onClick={()=>{setQ('أفضل دورة مجانية لتعلم تحليل البيانات');}}>🎓 دورة</button></div>
  </section>
  <section className="how"><div><b>01</b><h3>Find</h3><p>نحوّل طلبك إلى بحث مفهوم.</p></div><div><b>02</b><h3>Compare</h3><p>نضع الخيارات جنباً إلى جنب.</p></div><div><b>03</b><h3>Check</h3><p>نعرض الأدلة ومؤشرات المخاطر.</p></div><div><b>04</b><h3>Connect</h3><p>تذهب إلى المصدر الأصلي.</p></div></section>
  {error&&<div className="error">تعذر تنفيذ البحث: {error}</div>}{warning&&<div className="warning">تنبيه: تعذر الوصول إلى البحث المباشر، لذلك عُرضت نتائج تجريبية.</div>}{searched&&<section className="results"><div className="resulthead"><div><span className="eyebrow">RESULTS</span><h2>نتائج البحث</h2></div>{demo&&<span className="demo">MVP DEMO</span>}</div>{results.map((r,i)=><article className="card" key={i}><div className="cardtop"><span className="source">{r.source}</span>{r.sponsored&&<span className="sponsored">مُموّل</span>}</div><h3>{r.title}</h3><p>{r.description}</p><div className="meta">{r.price&&<strong>{r.price}</strong>}<span>✓ {r.evidence.length} دليل</span><span>{r.risk.length?`⚠ ${r.risk.length} مؤشر`:'✓ لا توجد مؤشرات في البيانات التجريبية'}</span></div><div className="actions"><button onClick={()=>setOpen(open===i?null:i)}>تحقق من الأدلة</button><a href={r.url} target="_blank" rel="noreferrer">فتح المصدر ↗</a></div>{open===i&&<div className="evidence"><b>الأدلة</b>{r.evidence.map((x,j)=><div key={j}>✓ {x}</div>)}{r.risk.map((x,j)=><div className="risk" key={'r'+j}>⚠ {x}</div>)}<small>ملاحظة: هذه النسخة لا تصدر حكماً بأن جهة ما موثوقة أو احتيالية؛ بل تعرض أدلة وإشارات للتحقق.</small></div>}</article>)}</section>}
  <footer><b>FindCheck</b><span>ابحث عن أي شيء. افهمه قبل أن تقرر.</span><small>نسخة MVP — لا توجد مدفوعات أو محافظ أو حفظ أموال.</small></footer>
 </main>
}
