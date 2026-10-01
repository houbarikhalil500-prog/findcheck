export type Result = { title:string; url:string; source:string; description:string; price?:string; type:string; sponsored:boolean; evidence:string[]; risk:string[] };

export function demoResults(query:string): Result[] {
  const q=query.toLowerCase();
  if (q.includes('لابتوب') || q.includes('laptop') || q.includes('computer')) return [
    {title:'مثال: متجر إلكترونيات موثوق',url:'https://example.com/product',source:'Demo Source',description:'نتيجة تجريبية لعرض طريقة المقارنة والتحقق. لن نعتبرها توصية فعلية قبل ربط مصادر حقيقية.',price:'$599',type:'product',sponsored:false,evidence:['رابط المصدر الأصلي','السعر ظاهر في المصدر'],risk:[]},
    {title:'مثال: عرض آخر',url:'https://example.com/offer',source:'Demo Source',description:'نتيجة تجريبية ثانية للمقارنة بين السعر والمصدر والأدلة.',price:'$649',type:'product',sponsored:true,evidence:['رابط المصدر الأصلي'],risk:['إعلان مدفوع — يجب فصله بصرياً عن نتيجة التحقق']}
  ];
  if (q.includes('وظيفة') || q.includes('job') || q.includes('عمل')) return [
    {title:'مثال: وظيفة عن بعد',url:'https://example.com/job',source:'Demo Jobs',description:'نتيجة تجريبية لواجهة وظائف جاهزة للمقارنة.',type:'job',sponsored:false,evidence:['صفحة الوظيفة الأصلية'],risk:[]},
    {title:'مثال: منصة وظائف',url:'https://example.com/jobs',source:'Demo Jobs',description:'نتيجة تجريبية ثانية.',type:'job',sponsored:false,evidence:['رابط المصدر'],risk:['تحقق من شروط الأهلية والدفع قبل التقديم']}
  ];
  return [
    {title:`نتيجة تجريبية لـ «${query}»`,url:'https://example.com/result',source:'Demo Source',description:'هذه نسخة MVP. بعد ربط مزودات البحث، ستُستبدل هذه البيانات بنتائج حقيقية مع مصادر وأدلة.',type:'general',sponsored:false,evidence:['مصدر أصلي (تجريبي)'],risk:[]},
    {title:'خيار آخر للمقارنة',url:'https://example.com/alternative',source:'Demo Source',description:'نستخدم هذه النتيجة لاختبار تجربة المقارنة والتحقق.',type:'general',sponsored:false,evidence:['رابط المصدر'],risk:['لا تعتمد على النتيجة قبل التحقق من المصدر الحقيقي']}
  ];
}
