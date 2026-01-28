import React, { useState } from 'react';
import { Terminal, MessageSquare, FileCode } from 'lucide-react';

const MOCK_ARTIFACTS = [
  { 
    id: 'slack', 
    icon: <MessageSquare size={16} />, 
    label: 'Slack: VP Sales', 
    content: "FROM: VP Sales\nTO: @channel\n\nI need the Referral Bonus feature live NOW. We might lose the Acme Corp deal if I cannot demo it tomorrow morning.\n\nI don't care about 'Freeze Friday'. Make it happen." 
  },
  { 
    id: 'logs', 
    icon: <Terminal size={16} />, 
    label: 'Datadog: Prod', 
    content: "[ERROR] Connection Refused: 5432\n[WARN] Latency spike detected in us-east-1\n[INFO] Auto-scaling group launched instance i-0xf32..." 
  },
  { 
    id: 'code', 
    icon: <FileCode size={16} />, 
    label: 'deploy.yml', 
    content: "jobs:\n  deploy:\n    if: github.ref == 'refs/heads/main'\n    # WARNING: Force flag enabled\n    run: kubectl apply -f ./k8s --force" 
  }
];

export default function Artifacts() {
  const [activeTab, setActiveTab] = useState(MOCK_ARTIFACTS[0]);

  return (
    <div className="flex flex-col h-full bg-sybil-panel border-r border-sybil-border">
      {/* Tabs */}
      <div className="flex border-b border-sybil-border">
        {MOCK_ARTIFACTS.map((art) => (
          <button
            key={art.id}
            onClick={() => setActiveTab(art)}
            className={`flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wider ${
              activeTab.id === art.id 
                ? 'bg-sybil-bg text-sybil-accent border-r border-sybil-border' 
                : 'text-sybil-muted hover:text-white'
            }`}
          >
            {art.icon} {art.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-6 font-mono text-sm whitespace-pre-wrap text-gray-300 leading-relaxed overflow-auto">
        {activeTab.content}
      </div>
    </div>
  );
}