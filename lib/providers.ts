export const providerConfig = [
  { name: 'Tavily', kind: 'search', env: 'TAVILY_API_KEY' },
  { name: 'Groq', kind: 'ai', env: 'GROQ_API_KEY' },
  { name: 'OpenAI', kind: 'ai-fallback', env: 'OPENAI_API_KEY' },
] as const;
