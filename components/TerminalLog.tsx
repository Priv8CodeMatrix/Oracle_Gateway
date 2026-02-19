import React, { useRef, useEffect } from 'react';

interface LogEntry {
  id: string;
  type: string;
  content: string;
  timestamp: string;
}

interface TerminalLogProps {
  logs?: LogEntry[]; // Optional real data
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new real logs come in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full font-mono text-sm leading-relaxed border-l-2 border-[#00FF41]/20 pl-4 py-2 min-h-[100px]">
      <div className="text-[#00FF41]/40 mb-4 text-xs tracking-widest uppercase">
        // Intelligence_Stream_Buffer // Waiting_For_Signal...
      </div>
      
      {logs.length === 0 ? (
        <div className="animate-pulse text-[#00FF41]">
          <span className="mr-2 opacity-50">{'>'}</span>
          LISTENING_ON_PORT_5000<span className="animate-blink">_</span>
        </div>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="mb-2 break-all">
            <span className="text-[#00FF41]/40 text-xs mr-3">[{log.timestamp}]</span>
            <span className="text-white font-bold mr-2">[{log.type}]</span>
            <span className="text-[#00FF41]/90">{log.content}</span>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalLog;