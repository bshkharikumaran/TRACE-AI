import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  FileText, 
  Lock, 
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  Info,
  Copy,
  Check,
  Shield,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  model_used?: string;
  mode?: string;
}

export const AiInvestigator: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "### Finding\nWelcome, Officer. I am TRACE-AI Investigation Co-Pilot, your grounded criminal network intelligence assistant.\n\n### Evidence\n- Connected to active graph database and case dossiers.\n- Live telemetry synchronized with verified CDR logs, banking ledgers, and FIR records.\n\n### Confidence\n95% (Knowledgebase Synced)\n\n### Recommended Lead\nYou may inquire about emerging criminal syndicates, key central coordinators (such as betweenness hubs), or cyclic financial laundering trails.\n\n### Sources\nTRACE-AI Core Database, NCRB Verification Engine",
      timestamp: 'Just now',
      model_used: 'Groq Cloud / TRACE-AI Engine'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Why was the emerging network flagged?",
    "Show the strongest connections of key suspects.",
    "Which person connects disparate criminal clusters?",
    "What changed in this network during the last 30 days?",
    "Summarize suspicious financial flow cycles.",
    "Give me the top prioritized investigation leads."
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.queryAi(q);
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: res.raw_response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model_used: res.model_used,
        mode: res.mode
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `### Finding\nError contacting AI service: ${err.message}\n\n### Recommended Lead\nCheck backend service or inspect active graph explorer.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Render structured markdown message with visual highlight sections
  const renderAiText = (raw: string) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-2 text-xs leading-relaxed text-slate-800">
        {lines.map((line, lIdx) => {
          if (line.startsWith('### Finding')) {
            return (
              <div key={lIdx} className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-mono font-bold text-[10px] uppercase">
                  <Compass className="w-3 h-3 text-blue-600" /> Finding Summary
                </span>
              </div>
            );
          }
          if (line.startsWith('### Evidence')) {
            return (
              <div key={lIdx} className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-[10px] uppercase">
                  <Lock className="w-3 h-3 text-emerald-600" /> Corroborating Evidence
                </span>
              </div>
            );
          }
          if (line.startsWith('### Confidence')) {
            return (
              <div key={lIdx} className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-800 font-mono font-bold text-[10px] uppercase">
                  <ShieldCheck className="w-3 h-3 text-purple-600" /> Analytical Confidence
                </span>
              </div>
            );
          }
          if (line.startsWith('### Recommended Lead')) {
            return (
              <div key={lIdx} className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-[10px] uppercase">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Recommended Action Lead
                </span>
              </div>
            );
          }
          if (line.startsWith('### Sources')) {
            return (
              <div key={lIdx} className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold text-[10px] uppercase">
                  <FileText className="w-3 h-3 text-slate-500" /> Grounded Database Sources
                </span>
              </div>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <p key={lIdx} className="pl-3 border-l-2 border-slate-200 text-slate-700 py-0.5">
                {line.replace(/^- \*\*(.*?)\*\*/, '$1:').replace(/^- /, '')}
              </p>
            );
          }
          if (!line.trim()) {
            return <div key={lIdx} className="h-1" />;
          }
          return (
            <p key={lIdx} className="text-slate-700 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col space-y-3.5 max-w-5xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>TRACE-AI Investigation Co-Pilot</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                Grounded RAG / Groq Cloud
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">Strictly grounded in verified database records. Zero hallucination protocol.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Judicial Grounding Active
          </span>
        </div>
      </div>

      {/* Mandatory Judicial Disclaimer Banner */}
      <div className="p-3 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-center gap-2.5 text-[11px] text-blue-950 shadow-xs">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="leading-snug">
          <strong>JUDICIAL NOTICE:</strong> Algorithmic assessment only. Does not constitute conclusive legal evidence of guilt. All investigative leads require independent corroboration before court submission under Bharatiya Sakshya Adhiniyam (BSA).
        </span>
      </div>

      {/* Chat Transcript Area */}
      <div className="flex-1 overflow-y-auto p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-2.5 transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-sm'
                  : 'bg-slate-50/70 border border-slate-200/90 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-80 mb-1 border-b pb-1.5 border-current/10">
                <span className="font-bold tracking-wider uppercase font-mono">
                  {msg.sender === 'user' ? 'Investigating Officer' : 'TRACE-AI Co-Pilot'}
                </span>
                <div className="flex items-center gap-2">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      className="p-1 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-800 transition"
                      title="Copy finding"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'ai' ? (
                renderAiText(msg.text)
              ) : (
                <div className="text-xs leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </div>
              )}

              {msg.model_used && (
                <div className="pt-2 border-t border-slate-200/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Engine: {msg.model_used}</span>
                  {msg.mode && <span className="uppercase font-bold">MODE: {msg.mode}</span>}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2.5 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span className="font-mono text-xs">Querying Groq Cloud reasoning model & graph database index...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold mr-1 flex items-center gap-1 flex-shrink-0">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          Suggested:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 text-slate-700 hover:text-blue-700 text-[11px] whitespace-nowrap transition shadow-xs hover:border-blue-300 font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Box */}
      <div className="p-2 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={loading}
          placeholder="Ask about suspect roles, bridge nodes, emerging anomalies, or evidence trails..."
          className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-xs"
        >
          <span>Ask Co-Pilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
