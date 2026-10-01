if (!query) {
  return NextResponse.json({ error: 'الاستعلام مطلوب' }, { status: 400 });
}

const tavilyApiKey = process.env.TAVILY_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

if (!tavilyApiKey || !groqApiKey) {
  return NextResponse.json(
    { error: 'مفاتيح API مفقودة في إعدادات Vercel' },
    { status: 500 }
  );
}

// 1. الاتصال بمحرك Tavily
const tavilyResponse = await fetch('https://tavily.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: tavilyApiKey,
    query: query,
    search_depth: 'advanced',
    include_answer: true,
  }),
});

if (!tavilyResponse.ok) {
  return NextResponse.json({ error: 'فشل الاتصال بمحرك Tavily' }, { status: 502 });
}

const tavilyData = await tavilyResponse.json();

// 2. الاتصال بذكاء Groq AI
const groqResponse = await fetch('https://groq.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${groqApiKey}`,
  },
  body: JSON.stringify({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content: 'أنت خبير محترف في تدقيق الحقائق. قم بتحليل نتائج البحث وقدم تقريراً وافياً وموضوعياً باللغة العربية للتحقق من صحة الادعاءات بناءً على السياق المتاح فقط.',
      },
      {
        role: 'user',
        content:iKey || !groqApiKey) {
  return NextResponse.json(
    { error: 'مفاتيح API مفقودة في إعدادات Vercel' 
      },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  }),
});

if (!groqResponse.ok) {
  return NextResponse.json({ error: 'فشل الاتصال بذكاء Groq' }, { status: 502 });
}

const groqData = await groqResponse.json();
const aiAnswer = groqData.choices?.[0]?.message?.content || 'لم يتم إنشاء تحليل';

return NextResponse.json({
  answer: aiAnswer,
  sources: (tavilyData.results || []).map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.snippet,
  })),
});
