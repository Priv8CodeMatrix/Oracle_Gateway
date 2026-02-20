import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const TerminalLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    // Safely access Environment Variables to avoid crash if import.meta.env is undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env || {};
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setLogs(["> SYSTEM_ALERT: MISSING_ENV_VARS (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) - TERMINAL OFFLINE"]);
      return;
    }

    // Initialize Supabase client only if keys exist
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initial Data Fetch
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('public_system_stream')
        .select('created_at, source, username, encoded')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Supabase Error:', error);
        setLogs(prev => [...prev, `> CONNECTION_FAILURE: ${error.message}`]);
        return;
      }

      if (data) {
        // Reverse array to display oldest at top (standard log flow)
        const formatted = data.reverse().map(entry => formatEntry(entry));
        setLogs(formatted);
      }
    };

    fetchLogs();

    // Real-time Subscription (FOMO Stream)
    const channel = supabase
      .channel('public:intel_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'intel_logs' },
        (payload) => {
          setLogs(prev => {
             const newEntry = formatEntry(payload.new);
             // Keep buffer size manageable (50 lines)
             const updated = [...prev, newEntry];
             return updated.slice(-50);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Formatter: [Timestamp HH:MM:SS] - [source] username: encoded...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatEntry = (entry: any) => {
      const date = new Date(entry.created_at);
      const time = date.toLocaleTimeString('en-US', { hour12: false });
      
      const source = entry.source || entry.src || "UNK";
      const user = entry.username || entry.identity || "ANON";
      const rawMsg = entry.message || entry.payload || entry.encoded || "";
      
      // Truncate encoded string to ~55 chars
      const truncated = rawMsg.length > 55 ? rawMsg.slice(0, 55) + '...' : rawMsg;

      return `[${time}] - [${source}] ${user}: ${truncated}`;
  };

  return (
    <div className="relative w-full border border-[#00FF41] bg-black shadow-[0_0_20px_rgba(0,255,65,0.1)] flex flex-col font-mono text-sm max-w-3xl mx-auto h-[360px]">
      
      {/* 1. Locked Header (Static Instructions) */}
      <div className="bg-[#00FF41]/10 p-3 border-b border-[#00FF41]/30 select-none text-[#00FF41] text-xs md:text-sm font-bold tracking-wide leading-relaxed z-10">
        <div>DIRECTIVE: SUBMIT SCHEMA TO /UPLINK FOR SESSION CLEARANCE.</div>
        <div className="whitespace-nowrap overflow-hidden text-ellipsis">MACHINECITY: REDUCE TOKEN LATENCY. PRE-COMPACTED CONTEXT AND PREMIUM AGENTS</div>
      </div>

      {/* 2. Scrollable Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 text-[#00FF41] text-xs md:text-sm"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#00FF41 #000' }}
      >
        {logs.map((log, i) => (
          <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {log}
          </div>
        ))}
        {/* Blinking Cursor */}
        <div className="animate-pulse text-[#00FF41] mt-1 font-bold">_</div>
      </div>
      
      {/* Hidden Machine Manifest (Preserved for compatibility if needed) */}
      <div id="agent-mission-manifest" style={{ display: 'none' }}>
        {`{"target_url": "SUPABASE_DIRECT_CONNECT", "protocol": "REALTIME_V2"}`}
      </div>
    </div>
  );
};

export default TerminalLog;