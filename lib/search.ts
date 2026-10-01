import { Result } from './demo';

function extractPrice(text: string) {
  const m = text.match(/(?:\$|€|£)\s?\d[\d,.]*/);
  return m?.[0];
}

export async function tavilySearch(query: string, country: string): Promise<Result[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error('TAVILY_API_KEY missing');
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      query: `${query} ${country === 'DZ' ? 'Algeria' : country}`,
      search_depth: 'basic',
      topic: 'general',
      max_results: 8,
      include_answer: false,
      include_raw_content: false,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Tavily ${response.status}`);
  const data = await response.json();
  return (data.results ?? []).map((r: any) => ({
    title: String(r.title ?? 'Untitled'),
    url: String(r.url ?? '#'),
    source: (() => { try { return new URL(r.url).hostname.replace(/^www\./, ''); } catch { return 'Web'; } })(),
    description: String(r.content ?? '').slice(0, 500),
    price: extractPrice(String(r.content ?? '')),
    type: 'web',
    sponsored: false,
    evidence: ['نتيجة من مصدر ويب خارجي', 'رابط المصدر الأصلي متاح'],
    risk: [],
  }));
}

export async function enrichWithGroq(query: string, results: Result[]): Promise<Result[]> {
  const key = process.env.GROQ_API_KEY;
  if (!key || !results.length) return results;
  const payload = results.slice(0, 6).map((r, i) => ({ i, title: r.title, description: r.description, url: r.url }));
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'You are a neutral result-analysis layer. Return ONLY valid JSON array. Do not declare a company a scam or trustworthy. Identify concrete evidence and uncertainty from supplied snippets.' },
        { role: 'user', content: JSON.stringify({ query, results: payload }) },
      ],
      max_tokens: 1800,
    }),
    cache: 'no-store',
  });
  if (!response.ok) return results;
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const notes = JSON.parse(cleaned) as Array<{i:number;evidence?:string[];risk?:string[]}>;
    return results.map((r, idx) => {
      const n = notes.find(x => x.i === idx);
      return n ? { ...r, evidence: [...r.evidence, ...(n.evidence ?? [])].slice(0, 5), risk: (n.risk ?? []).slice(0, 4) } : r;
    });
  } catch { return results; }
}
