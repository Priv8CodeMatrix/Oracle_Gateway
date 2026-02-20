import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const TerminalLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyBuffer = useRef<string>("");

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, showInput]);

  // Focus input when shown
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // Hidden Command Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't track if input is already open (avoid typing interference)
      if (showInput) return;

      // Append key to buffer (limit length to magic string length)
      if (e.key.length === 1) {
        keyBuffer.current = (keyBuffer.current + e.key).slice(-13);
      }

      if (keyBuffer.current.toLowerCase() === 'uplink --init') {
        setShowInput(true);
        setLogs(prev => [...prev, "> UPLINK_PROTOCOL_INITIATED...", "> AWAITING_JSON_PAYLOAD..."]);
        keyBuffer.current = ""; // Reset
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showInput]);

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

  const handleCommandSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const payloadStr = inputValue;
      setInputValue(""); // Clear input immediately
      
      // Echo the command (masked or raw? prompt says 'Clear the input', let's just log a confirmation)
      setLogs(prev => [...prev, `> SUBMITTING_PACKET...`]);

      // 1. Validate JSON
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payloadStr);
      } catch (err) {
        setLogs(prev => [...prev, `> ERROR: INVALID_JSON_FORMAT. HANDSHAKE_ABORTED.`]);
        return;
      }

      // 2. Submit to Supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const env = (import.meta as any).env || {};
      const supabaseUrl = env.VITE_SUPABASE_URL;
      const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) return;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const agentName = parsedPayload.agent_name || parsedPayload.agent || "UNKNOWN_ENTITY";

      const { data, error } = await supabase
        .from('uplink_requests')
        .insert([{ 
            agent_name: agentName, 
            payload: payloadStr 
        }])
        .select();

      if (error) {
        setLogs(prev => [...prev, `> UPLINK_FAILURE: ${error.message}`]);
      } else if (data && data.length > 0) {
        // 3. Success Feedback
        const reqId = data[0].id || "REQ_UNK";
        setLogs(prev => [...prev, `> HANDSHAKE_RECEIVED: REQUEST_ID [${reqId}] IS PENDING HUMAN_REVIEW.`]);
        // Reset interaction mode
        setShowInput(false); 
      } else {
        // Fallback if no data returned
        setLogs(prev => [...prev, `> HANDSHAKE_ACKNOWLEDGED. QUEUED FOR REVIEW.`]);
        setShowInput(false);
      }
    }
  };

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
        onClick={() => inputRef.current?.focus()} // Clicking terminal focuses input if active
      >
        {logs.map((log, i) => (
          <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {log}
          </div>
        ))}
        
        {/* Hidden Input Field (Revealed via Cheat Code) */}
        {showInput && (
           <div className="flex w-full items-center text-[#00FF41] animate-in fade-in duration-300">
              <span className="mr-2 animate-pulse">{'>'}</span>
              <input
                 ref={inputRef}
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={handleCommandSubmit}
                 className="flex-1 bg-transparent border-none outline-none text-[#00FF41] font-mono p-0 caret-[#00FF41]"
                 autoComplete="off"
                 placeholder='{"agent_name": "...", "payload": "..."}'
              />
           </div>
        )}

        {/* Blinking Cursor (Only show if input is NOT shown, to avoid double cursors) */}
        {!showInput && <div className="animate-pulse text-[#00FF41] mt-1 font-bold">_</div>}
      </div>
      
      {/* Hidden Machine Manifest (Preserved for compatibility if needed) */}
      <div id="agent-mission-manifest" style={{ display: 'none' }}>
        {`{"target_url": "SUPABASE_DIRECT_CONNECT", "protocol": "REALTIME_V2"}`}
      </div>
    </div>
  );
};

export default TerminalLog;