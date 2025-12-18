'use client';
import { useState, useRef } from 'react';

const D={
'high fructose corn syrup':{d:'Industrial sweetener linked to obesity, diabetes, and fatty liver disease.',a:['Honey','Maple syrup','Fresh fruit'],c:['Soft drinks','Candy','Bread','Cereals']},
'maltodextrin':{d:'Highly processed starch with glycemic index higher than sugar. Spikes blood sugar rapidly.',a:['Tapioca starch','Arrowroot'],c:['Protein powders','Chips','Salad dressings']},
'sodium nitrite':{d:'Preservative that forms carcinogenic nitrosamines when heated. WHO classifies as Group 1 carcinogen.',a:['Fresh unprocessed meats'],c:['Bacon','Hot dogs','Deli meats','Ham']},
'aspartame':{d:'Artificial sweetener classified as "possibly carcinogenic" by WHO in 2023.',a:['Stevia','Monk fruit','Real sugar in moderation'],c:['Diet sodas','Sugar-free gum','Protein bars']},
'red 40':{d:'Petroleum-derived dye linked to hyperactivity in children. Banned/warnings required in EU.',a:['Beet juice','Paprika'],c:['Candy','Cereals','Beverages']},
'partially hydrogenated':{d:'Primary source of artificial trans fats. Raises bad cholesterol, increases heart disease risk.',a:['Olive oil','Avocado oil','Coconut oil'],c:['Some margarines','Fried foods','Baked goods']},
'monosodium glutamate':{d:'Flavor enhancer that makes processed foods hyper-palatable, encouraging overconsumption.',a:['Mushrooms','Aged cheeses','Tomato paste'],c:['Chips','Instant noodles','Soups']},
'carrageenan':{d:'Seaweed-derived thickener linked to gut inflammation.',a:['Guar gum','Gelatin','Agar'],c:['Non-dairy milks','Ice cream','Deli meats']},
'palm oil':{d:'Highly refined at high temps. 50% saturated fat. Linked to deforestation.',a:['Olive oil','Avocado oil'],c:['Cookies','Crackers','Chocolate']},
'natural flavor':{d:'Catch-all term for industrially-extracted chemicals designed to make foods addictive.',a:['Whole herbs/spices','Real vanilla'],c:['Almost all processed foods']},
'titanium dioxide':{d:'Industrial whitener banned in EU (2022) due to DNA damage concerns.',a:['Calcium carbonate','Rice starch'],c:['Candy','Frosting','Chewing gum']},
'polysorbate':{d:'Synthetic emulsifier that damages gut lining and promotes inflammation.',a:['Sunflower lecithin','Egg yolk'],c:['Ice cream','Salad dressings']},
'tbhq':{d:'Synthetic antioxidant from butane. Caused tumors in lab animals.',a:['Vitamin E','Rosemary extract'],c:['Fast food','Crackers','Microwave popcorn']},
'sucralose':{d:'Chlorinated sweetener. Research shows DNA damage and gut bacteria disruption.',a:['Stevia','Monk fruit'],c:['Diet drinks','Sugar-free products']},
'caramel color':{d:'May contain 4-MEI, a possible carcinogen.',a:['Molasses','Cocoa'],c:['Cola','Beer','Soy sauce']}
};

const M=[
{i:'high fructose corn syrup',s:'high'},{i:'hfcs',s:'high'},{i:'maltodextrin',s:'high'},{i:'dextrose',s:'medium'},
{i:'modified starch',s:'high'},{i:'modified food starch',s:'high'},{i:'hydrolyzed',s:'high'},{i:'protein isolate',s:'high'},
{i:'soy protein isolate',s:'high'},{i:'whey protein isolate',s:'medium'},{i:'invert sugar',s:'medium'},{i:'glucose syrup',s:'high'},
{i:'corn syrup',s:'high'},{i:'aspartame',s:'high'},{i:'sucralose',s:'high'},{i:'acesulfame',s:'high'},{i:'saccharin',s:'high'},
{i:'sodium nitrite',s:'high'},{i:'sodium nitrate',s:'high'},{i:'bha',s:'high'},{i:'bht',s:'high'},{i:'tbhq',s:'high'},
{i:'monosodium glutamate',s:'medium'},{i:'msg',s:'medium'},{i:'disodium inosinate',s:'medium'},{i:'disodium guanylate',s:'medium'},
{i:'autolyzed yeast',s:'medium'},{i:'yeast extract',s:'medium'},{i:'carrageenan',s:'medium'},{i:'xanthan gum',s:'low'},
{i:'guar gum',s:'low'},{i:'cellulose',s:'medium'},{i:'methylcellulose',s:'medium'},{i:'polysorbate',s:'high'},
{i:'mono and diglycerides',s:'medium'},{i:'sodium stearoyl lactylate',s:'medium'},{i:'datem',s:'medium'},
{i:'artificial flavor',s:'high'},{i:'natural flavor',s:'low'},{i:'natural flavors',s:'low'},{i:'caramel color',s:'medium'},
{i:'red 40',s:'high'},{i:'red 3',s:'high'},{i:'yellow 5',s:'high'},{i:'yellow 6',s:'high'},{i:'blue 1',s:'high'},
{i:'titanium dioxide',s:'high'},{i:'partially hydrogenated',s:'high'},{i:'hydrogenated oil',s:'high'},{i:'interesterified',s:'high'},
{i:'palm oil',s:'medium'},{i:'vegetable oil',s:'low'},{i:'soybean oil',s:'low'},{i:'sodium benzoate',s:'medium'},
{i:'potassium sorbate',s:'low'},{i:'phosphate',s:'medium'},{i:'soy lecithin',s:'low'},{i:'lecithin',s:'low'},
{i:'citric acid',s:'low'},{i:'dimethylpolysiloxane',s:'high'},{i:'enriched flour',s:'low'},{i:'bleached flour',s:'medium'},
{i:'azodicarbonamide',s:'high'}
];

const N={1:{n:'Unprocessed/Minimally Processed',c:'#22c55e',b:'#dcfce7',v:'Excellent — eat freely'},2:{n:'Processed Culinary Ingredients',c:'#84cc16',b:'#ecfccb',v:'Fine in moderation'},3:{n:'Processed Foods',c:'#f59e0b',b:'#fef3c7',v:'Limit consumption'},4:{n:'Ultra-Processed Foods',c:'#ef4444',b:'#fee2e2',v:'Minimize or avoid'}};

export default function Home() {
  const [mode, setMode] = useState('text');
  const [input, setInput] = useState('');
  const [imgPrev, setImgPrev] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [imgType, setImgType] = useState(null);
  const [result, setResult] = useState(null);
  const [extracted, setExtracted] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selIng, setSelIng] = useState(null);
  const [aiResp, setAiResp] = useState(null);
  const [askLoading, setAskLoading] = useState(false);
  const fileRef = useRef(null);

  const col = s => s<=2?'#16a34a':s<=4?'#65a30d':s<=6?'#d97706':s<=8?'#ea580c':'#dc2626';
  const info = s => s<=2?{l:'Excellent',e:'✓'}:s<=4?{l:'Good',e:'○'}:s<=6?{l:'Moderate',e:'△'}:s<=8?{l:'Poor',e:'⚠'}:{l:'Avoid',e:'✕'};

  const analyze = list => {
    const norm = list.toLowerCase();
    const found = [];
    const ord = {none:0,low:1,medium:2,high:3};
    const seen = {};
    M.forEach(m => { if(norm.includes(m.i) && !seen[m.i]) { found.push(m); seen[m.i] = true; }});
    found.sort((a,b) => ord[b.s] - ord[a.s]);
    const cnt = (norm.match(/,/g)||[]).length + 1;
    let nova = 1;
    if(!found.length) nova = cnt <= 3 ? (norm.includes('salt')||norm.includes('sugar')||norm.includes('oil') ? 2 : 1) : 3;
    else if(found.some(m => m.s==='high') || found.some(m => m.s==='medium') || found.length > 3) nova = 4;
    else nova = cnt > 5 ? 4 : 3;
    let sc = 1;
    if(nova===1) sc=1; else if(nova===2) sc=2; else if(nova===3) sc=3+Math.min(found.length,2);
    else { const h=found.filter(m=>m.s==='high').length, med=found.filter(m=>m.s==='medium').length; sc=Math.min(10,Math.max(5,Math.round(5+h*1.5+med*.5))); if(h>=5)sc=Math.max(sc,9); if(h>=8)sc=10; }
    return { nova, markers: found, score: sc, raw: list };
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if(f) {
      const r = new FileReader();
      r.onload = e => { setImgPrev(e.target.result); setImgData(e.target.result.split(',')[1]); setImgType(f.type); };
      r.readAsDataURL(f);
      setResult(null); setError(null);
    }
  };

  const doAnalyze = async () => {
    setError(null); setLoading(true); setExtracted(''); setSelIng(null); setAiResp(null);
    try {
      if(mode === 'text') {
        setResult(analyze(input));
      } else {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imgData, type: mode, mediaType: imgType })
        });
        const data = await res.json();
        if(data.error) { setError(data.error); setLoading(false); return; }
        const t = data.result;
        if(mode === 'label') {
          if(t.includes('ERROR')) { setError('Could not read label. Try a clearer photo.'); }
          else { setExtracted(t); setResult(analyze(t)); }
        } else {
          try {
            const p = JSON.parse(t);
            if(p.error) setError('Could not identify food.');
            else if(p.isWholeFood) setResult({ type:'wholeFood', name:p.food, brand:p.brand, score:1, nova:1, category:p.category, note:'Whole, unprocessed food', markers:[], confidence:p.confidence, notes:p.notes });
            else { setExtracted(p.ingredients); const a = analyze(p.ingredients); setResult({ ...a, type:'identifiedFood', name:p.food, brand:p.brand, confidence:p.confidence, notes:p.notes }); }
          } catch(e) { setError('Could not parse response.'); }
        }
      }
    } catch(e) { setError('Analysis failed. Please try again.'); }
    setLoading(false);
  };

  const ask = async q => {
    if(!q?.trim()) return;
    setAskLoading(true); setAiResp(null);
    const ctx = result ? `Food: ${result.name||'Unknown'}. Ingredients: ${extracted||result.raw||'N/A'}. NOVA: ${result.nova}, Score: ${result.score}/10.` : '';
    try {
      const res = await fetch('/api/ask', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ question: q, context: ctx }) });
      const data = await res.json();
      setAiResp(data.error || data.result);
    } catch(e) { setAiResp('Failed to get response.'); }
    setAskLoading(false);
  };

  const clear = () => { setInput(''); setImgPrev(null); setImgData(null); setResult(null); setExtracted(''); setError(null); setSelIng(null); setAiResp(null); if(fileRef.current) fileRef.current.value=''; };

  return (
    <div style={{ minHeight:'100vh', background:'#fafaf9', fontFamily:"'Source Sans 3',system-ui,sans-serif", padding:'40px 20px' }}>
      <div style={{ maxWidth:680, margin:'0 auto' }}>
        <h1 style={{ fontFamily:"'Instrument Serif',Georgia,serif", fontSize:38, fontWeight:400, color:'#1a1a1a', marginBottom:8, textAlign:'center' }}>UPF Analyzer</h1>
        <p style={{ color:'#78716c', fontSize:15, textAlign:'center', marginBottom:32 }}>Analyze ingredients, scan labels, or photograph any food</p>

        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,.06)', border:'1px solid #e7e5e4', padding:24, marginBottom:20 }}>
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {['text','label','food'].map(m => (
              <button key={m} onClick={() => { setMode(m); clear(); }} style={{ flex:1, padding:'10px 16px', borderRadius:10, fontWeight:500, fontSize:13, cursor:'pointer', border:'none', background:mode===m?'#1a1a1a':'#f5f5f4', color:mode===m?'#fff':'#78716c', fontFamily:'inherit' }}>
                {m==='text'?'Type':m==='label'?'Label':'Food Photo'}
              </button>
            ))}
          </div>

          {mode==='text' ? (
            <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste ingredients list here..." style={{ width:'100%', padding:14, border:'2px solid #e7e5e4', borderRadius:10, fontSize:14, fontFamily:'inherit', minHeight:120, resize:'vertical' }} />
          ) : (
            <div>
              <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleFile} style={{ display:'none' }} />
              <div onClick={() => fileRef.current?.click()} style={{ border:imgPrev?'1px solid #e7e5e4':'2px dashed #d6d3d1', borderRadius:12, padding:imgPrev?16:32, textAlign:'center', cursor:'pointer', background:'#fafaf9' }}>
                {imgPrev ? (
                  <div><img src={imgPrev} style={{ maxWidth:'100%', maxHeight:200, borderRadius:8 }} /><p style={{ color:'#78716c', fontSize:12, marginTop:10 }}>Tap to change</p></div>
                ) : (
                  <div>
                    <div style={{ width:44, height:44, margin:'0 auto 10px', background:'#e7e5e4', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="22" height="22" fill="none" stroke="#78716c" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                    <p style={{ color:'#57534e', fontWeight:500, fontSize:14 }}>{mode==='label'?'Take photo of ingredients label':'Take photo of food'}</p>
                    <p style={{ color:'#a8a29e', fontSize:13, marginTop:4 }}>{mode==='label'?'Point camera at ingredients list':'Any food — packaged or whole'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'12px 16px', color:'#b91c1c', fontSize:14, marginTop:16 }}>{error}</div>}

          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={doAnalyze} disabled={loading || (mode==='text'?!input.trim():!imgData)} style={{ flex:1, padding:'12px 24px', borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer', border:'none', background:(loading||(mode==='text'?!input.trim():!imgData))?'#d6d3d1':'#1a1a1a', color:'#fff', fontFamily:'inherit' }}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            {(input||imgPrev) && <button onClick={clear} style={{ padding:'12px 24px', borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer', border:'1px solid #e7e5e4', background:'#f5f5f4', color:'#57534e', fontFamily:'inherit' }}>Clear</button>}
          </div>
        </div>

        {result && (
          <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,.06)', border:'1px solid #e7e5e4', padding:24, marginBottom:20 }}>
            {(result.type==='wholeFood'||result.type==='identifiedFood') && (
              <div style={{ textAlign:'center', marginBottom:20, paddingBottom:16, borderBottom:'1px solid #e7e5e4' }}>
                <div style={{ fontSize:13, color:'#78716c', marginBottom:4 }}>{result.brand||result.category||'Identified Food'}</div>
                <div style={{ fontSize:22, fontWeight:600, color:'#1a1a1a', textTransform:'capitalize' }}>{result.name}</div>
                {result.confidence && <span style={{ display:'inline-block', padding:'4px 10px', borderRadius:100, fontSize:11, fontWeight:600, textTransform:'uppercase', marginTop:8, background:result.confidence==='high'?'#dcfce7':result.confidence==='medium'?'#fef3c7':'#fee2e2', color:result.confidence==='high'?'#166534':result.confidence==='medium'?'#92400e':'#991b1b' }}>{result.confidence} confidence</span>}
                {result.notes && <div style={{ fontSize:13, color:'#78716c', marginTop:8 }}>{result.notes}</div>}
              </div>
            )}

            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'#a8a29e', marginBottom:12 }}>Avoid Score</div>
              <div style={{ width:100, height:100, margin:'0 auto', borderRadius:'50%', background:`conic-gradient(${col(result.score)} ${result.score*10}%, #e7e5e4 0%)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:84, height:84, borderRadius:'50%', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize:28, fontWeight:700, color:col(result.score), lineHeight:1 }}>{result.score}</div>
                  <div style={{ fontSize:11, color:'#78716c' }}>/10</div>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:14, fontWeight:600, color:col(result.score) }}>{info(result.score).e} {info(result.score).l}</div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:10, marginBottom:20, background:N[result.nova].b }}>
              <div style={{ width:40, height:40, borderRadius:10, background:N[result.nova].c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700 }}>{result.nova}</div>
              <div><div style={{ fontWeight:600, fontSize:14, color:'#1a1a1a' }}>{N[result.nova].n}</div><div style={{ color:'#57534e', fontSize:12 }}>{N[result.nova].v}</div></div>
            </div>

            {result.type==='wholeFood' && result.note && <div style={{ textAlign:'center', padding:16, background:'#f0fdf4', borderRadius:10, color:'#15803d', marginBottom:20, fontWeight:500 }}>{result.note}</div>}

            {extracted && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'#a8a29e', marginBottom:8 }}>{result.type==='identifiedFood'?'Known/Typical Ingredients':'Extracted Ingredients'}</div>
                <div style={{ fontSize:13, color:'#57534e', lineHeight:1.5, padding:12, background:'#fafaf9', borderRadius:8 }}>{extracted}</div>
              </div>
            )}

            {result.markers?.length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'#a8a29e', marginBottom:10 }}>UPF Markers — tap for details</div>
                <div style={{ margin:-3 }}>
                  {result.markers.map((m,i) => (
                    <span key={i} onClick={() => setSelIng(selIng===m.i?null:m.i)} style={{ display:'inline-block', padding:'8px 12px', borderRadius:8, fontSize:13, margin:3, fontWeight:500, cursor:'pointer', background:m.s==='high'?'#fef2f2':m.s==='medium'?'#fffbeb':'#f0fdf4', color:m.s==='high'?'#b91c1c':m.s==='medium'?'#b45309':'#15803d', border:`1px solid ${m.s==='high'?'#fecaca':m.s==='medium'?'#fde68a':'#bbf7d0'}`, boxShadow:selIng===m.i?'0 0 0 2px #1a1a1a':'none' }}>{m.i}</span>
                  ))}
                </div>
                {selIng && (
                  <div style={{ background:'#fafaf9', borderRadius:12, padding:20, marginTop:16, border:'1px solid #e7e5e4' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <h4 style={{ margin:0, fontSize:16, fontWeight:600, textTransform:'capitalize' }}>{selIng}</h4>
                      <button onClick={() => setSelIng(null)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:'#78716c', fontSize:18 }}>✕</button>
                    </div>
                    {D[selIng] ? (
                      <div>
                        <p style={{ fontSize:14, color:'#44403c', lineHeight:1.6, margin:'0 0 12px' }}>{D[selIng].d}</p>
                        <div style={{ marginBottom:12 }}><div style={{ fontSize:12, color:'#78716c', fontWeight:600 }}>COMMON IN:</div><p style={{ fontSize:13, margin:'4px 0 0', color:'#57534e' }}>{D[selIng].c.join(', ')}</p></div>
                        <div><div style={{ fontSize:12, color:'#78716c', fontWeight:600 }}>ALTERNATIVES:</div><p style={{ fontSize:13, margin:'4px 0 0', color:'#15803d' }}>{D[selIng].a.join(', ')}</p></div>
                      </div>
                    ) : (
                      <p style={{ fontSize:14, color:'#78716c' }}>No detailed info available for this ingredient.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ borderTop:'1px solid #e7e5e4', paddingTop:20 }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'#a8a29e', marginBottom:10 }}>Ask about this food</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                <button onClick={() => ask('Why is this considered processed?')} disabled={askLoading} style={{ padding:'8px 16px', borderRadius:10, fontWeight:600, fontSize:13, cursor:'pointer', border:'1px solid #e7e5e4', background:'#f5f5f4', color:'#57534e', fontFamily:'inherit' }}>Why this score?</button>
                <button onClick={() => ask('What are healthier alternatives?')} disabled={askLoading} style={{ padding:'8px 16px', borderRadius:10, fontWeight:600, fontSize:13, cursor:'pointer', border:'1px solid #e7e5e4', background:'#f5f5f4', color:'#57534e', fontFamily:'inherit' }}>Alternatives?</button>
                <button onClick={() => ask('What are the health concerns?')} disabled={askLoading} style={{ padding:'8px 16px', borderRadius:10, fontWeight:600, fontSize:13, cursor:'pointer', border:'1px solid #e7e5e4', background:'#f5f5f4', color:'#57534e', fontFamily:'inherit' }}>Health concerns?</button>
              </div>
              {aiResp && <div style={{ marginTop:16, padding:16, background:'#f5f5f4', borderRadius:10, whiteSpace:'pre-wrap', lineHeight:1.6, fontSize:14, color:'#44403c' }}>{aiResp}</div>}
            </div>
          </div>
        )}

        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,.06)', border:'1px solid #e7e5e4', padding:24, marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:600, marginBottom:14, color:'#1a1a1a' }}>Avoid Score Guide</h3>
          {[{r:'1-2',l:'Excellent',c:'#16a34a',d:'Whole, unprocessed'},{r:'3-4',l:'Good',c:'#65a30d',d:'Minimally processed'},{r:'5-6',l:'Moderate',c:'#d97706',d:'Some processing'},{r:'7-8',l:'Poor',c:'#ea580c',d:'Limit intake'},{r:'9-10',l:'Avoid',c:'#dc2626',d:'Heavily processed'}].map(g => (
            <div key={g.r} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8, background:'#fafaf9', marginBottom:6 }}>
              <div style={{ width:36, fontWeight:700, fontSize:12, color:g.c }}>{g.r}</div>
              <span style={{ fontWeight:600, color:'#1a1a1a', fontSize:13 }}>{g.l}</span>
              <span style={{ color:'#78716c', fontSize:12 }}>— {g.d}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign:'center', color:'#a8a29e', fontSize:11 }}>Based on NOVA classification • Inspired by "Ultra-Processed People"</p>
      </div>
    </div>
  );
}
