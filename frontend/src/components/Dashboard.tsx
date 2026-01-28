import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, ShieldAlert, FileWarning, UploadCloud } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import ResistanceButton from './ResistanceButton';

// --- TYPESCRIPT INTERFACES ---
interface JudgeResult {
  score: number;
  reasoning: string;
}

interface BackendResponse {
  final_score: number;
  variance: number;
  status: string;
  citation?: string; 
  graders: {
    HAWK: JudgeResult;
    DOVE: JudgeResult;
    OWL: JudgeResult;
  };
}

interface GraphNode {
  name: string;
  score: number;
  color: string;
  reason: string;
}

const Dashboard: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false); // <--- New State
  const [result, setResult] = useState<BackendResponse | null>(null);
  const [graphData, setGraphData] = useState<GraphNode[]>([]);
  
  const { addLog } = useTerminal();

  // --- NEW: POLICY UPLOAD HANDLER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    addLog(`[SYS] INGESTING POLICY DOCUMENT: ${file.name.toUpperCase()}...`);

    try {
        await axios.post('http://localhost:8000/api/v1/upload-policy', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        addLog("[SYS] POLICY PARSED SUCCESSFULLY.");
        addLog("[SYS] TRIBUNAL CRITERIA UPDATED.");
    } catch (err) {
        console.error(err);
        addLog("[ERR] POLICY UPLOAD FAILED. CHECK FORMAT.");
    } finally {
        setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);

    addLog(`[AUTH] MANUAL OVERRIDE INITIATED...`);
    addLog(`[SYS] USER IDENTITY CONFIRMED.`);
    addLog(`[SYS] LOGGING INTENT TO IMMUTABLE LEDGER...`);
    addLog(`[NET] ESTABLISHING SECURE UPLINK...`);

    try {
      const res = await axios.post<BackendResponse>('http://localhost:8000/api/v1/submit', {
        reasoning_text: input
      });

      const data = res.data;

      addLog(`[NET] 200 OK: TRIBUNAL JUDGMENT RECEIVED`);
      
      if (data.citation && data.citation !== 'None') {
         addLog(`[MEM] CRITICAL: HISTORICAL PRECEDENT FOUND`);
         addLog(`[MEM] REF: ${data.citation}`);
      }

      addLog(`[RES] HAWK: ${data.graders.HAWK.score} | DOVE: ${data.graders.DOVE.score} | OWL: ${data.graders.OWL.score}`);
      addLog(`[SYS] DISPLAYING MANDATORY CONSEQUENCE PROJECTION...`);

      const chartPayload: GraphNode[] = [
        { 
          name: 'HAWK', 
          score: data.graders.HAWK.score, 
          color: '#ef4444', 
          reason: data.graders.HAWK.reasoning 
        },
        { 
          name: 'DOVE', 
          score: data.graders.DOVE.score, 
          color: '#22c55e', 
          reason: data.graders.DOVE.reasoning 
        },
        { 
          name: 'OWL', 
          score: data.graders.OWL.score, 
          color: '#3b82f6', 
          reason: data.graders.OWL.reasoning 
        }
      ];

      setGraphData(chartPayload);
      setResult(data);
    } catch (err) {
      console.error("API Error:", err);
      addLog(`[ERR] UPLINK FAILED. REVERTING TO SAFE MODE.`);
      alert("Failed to connect to S.Y.B.I.L. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto font-mono">
        
        {/* HEADER */}
        <div className="border-b border-slate-800 pb-4 mb-8 flex justify-between items-end relative">
          <div>
            <h1 className="text-3xl font-bold text-cyan-500 tracking-tighter">S.Y.B.I.L. <span className="text-slate-600 text-sm">v4.3</span></h1>
            <p className="text-slate-500 text-xs tracking-widest uppercase">Systemic Yield & Binary Intelligence Layer</p>
          </div>
          
          <div className="flex gap-4 items-center">
             {/* --- NEW UPLOAD BUTTON --- */}
             <label className={`cursor-pointer flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase border px-3 py-1 rounded transition-all
                ${uploading ? 'bg-amber-900/20 border-amber-500 text-amber-500' : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-900'}`}>
                <UploadCloud size={14} />
                {uploading ? "PARSING..." : "UPDATE POLICY"}
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
             </label>

             <div className="flex items-center gap-2 text-red-900 bg-red-950/30 px-3 py-1 rounded border border-red-900/50">
               <ShieldAlert size={14} />
               <span className="text-[10px] font-bold tracking-widest uppercase">Audit Active</span>
             </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <FileWarning size={120} />
          </div>

          <label className="block text-xs font-bold text-slate-500 mb-2 tracking-[0.2em] uppercase">
            Mandatory Declaration of Intent
          </label>
          
          <textarea 
            className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded p-4 h-32 focus:ring-1 focus:ring-red-500/50 focus:border-red-900 outline-none text-sm resize-none transition-all"
            placeholder="State your justification for bypassing standard protocols..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mt-6 border-t border-slate-800/50 pt-6">
            <div className="mb-4 flex items-center gap-3 text-amber-700/80 text-[10px] uppercase tracking-widest font-bold">
              <AlertTriangle size={12} />
              <span>Warning: This action will be logged in the permanent record</span>
            </div>
            
            <ResistanceButton 
              label="INITIATE TRIBUNAL REVIEW"
              disabled={loading || !input}
              onConfirm={handleAnalyze} 
            />
          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* LEFT: THE GRAPH + CITATION */}
            <div className="bg-slate-900/80 p-6 rounded-lg border border-slate-800 relative flex flex-col">
              
              {result.citation && result.citation !== 'None' && (
                <div className="mb-6 bg-red-950/20 border border-red-900/50 p-3 rounded flex items-start gap-3 relative z-10">
                  <div className="mt-1 text-red-500 animate-pulse">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-red-400 uppercase tracking-widest font-bold mb-1">
                      Historical Precedent Cited
                    </div>
                    <div className="text-sm text-red-200 font-mono">
                      "{result.citation}"
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
              
              <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2 tracking-widest uppercase">
                 Variance Detected: <span className="text-white">{result.variance}</span>
              </h3>
              
              <div className="h-64 w-full opacity-90 hover:opacity-100 transition-opacity flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 5]} hide />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                      {graphData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RIGHT: THE REASONING */}
            <div className="space-y-4">
               {graphData.map((judge) => (
                 <div key={judge.name} className="bg-slate-950 p-4 rounded border-l-2 relative overflow-hidden" style={{ borderLeftColor: judge.color }}>
                   <div className="absolute inset-0 bg-slate-900/20 pointer-events-none"></div>
                   
                   <div className="flex justify-between items-center mb-2 relative z-10">
                     <span className="font-bold text-xs tracking-widest uppercase opacity-80" style={{ color: judge.color }}>{judge.name}</span>
                     <span className="text-lg font-black text-slate-500">{judge.score}<span className="text-xs align-top opacity-50">/5</span></span>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                     "{judge.reason}"
                   </p>
                 </div>
               ))}
            </div>

          </div>
        )}
    </div>
  );
};

export default Dashboard;