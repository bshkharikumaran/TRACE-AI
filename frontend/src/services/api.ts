import { 
  Investigation, 
  CytoscapeElements, 
  EmergingNetwork, 
  HiddenConnection, 
  CoordinatedActivity, 
  EvidenceItem, 
  OsintResult, 
  PriorityLead, 
  AuditLog, 
  User 
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`API Error ${res.status}: ${errBody}`);
  }
  return res.json();
}

export const api = {
  // Health
  getHealth: () => fetchJson<{ status: string; service: string; database_mode: string; ai_engine: string; osint_mode: string }>('/health'),

  // Auth
  getUsers: () => fetchJson<User[]>('/auth/users'),
  login: (email: string) => fetchJson<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  // Investigations
  getInvestigations: () => fetchJson<Investigation[]>('/investigations'),
  getInvestigationDetail: (id: string) => fetchJson<any>(`/investigations/${id}`),

  // Network Explorer
  getNetworkElements: (types?: string, community?: number, limit = 250) => {
    const params = new URLSearchParams();
    if (types) params.set('types', types);
    if (community !== undefined) params.set('community', community.toString());
    params.set('limit', limit.toString());
    return fetchJson<CytoscapeElements>(`/network/elements?${params.toString()}`);
  },
  getNodeDetails: (nodeId: string) => fetchJson<any>(`/network/node/${nodeId}`),
  getShortestPath: (source: string, target: string) => fetchJson<{ path: string[]; path_details: any[]; hops: number }>(`/network/shortest-path?source=${source}&target=${target}`),
  getNetworkMetrics: () => fetchJson<any>('/network/metrics'),

  // Emerging Networks (USP)
  getEmergingNetworks: () => fetchJson<EmergingNetwork[]>('/emerging'),
  getEmergingNetworkDetail: (code: string) => fetchJson<EmergingNetwork>(`/emerging/${code}`),

  // Hidden Connections
  getHiddenConnections: () => fetchJson<HiddenConnection[]>('/hidden'),

  // Coordinated Activity
  getCoordinatedActivities: () => fetchJson<CoordinatedActivity[]>('/coordinated'),

  // Financial Intelligence
  getFinancialOverview: () => fetchJson<any>('/financial/overview'),

  // Timeline
  getTimelineEvolution: (days = 30, stepDay = 30) => fetchJson<any>(`/timeline/evolution?days=${days}&step_day=${stepDay}`),

  // Documents
  analyzeDocument: async (file: File, investigationId = 'inv-001') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('investigation_id', investigationId);
    const res = await fetch(`${API_BASE}/documents/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Document analysis failed: ${await res.text()}`);
    return res.json();
  },
  addExtractedToGraph: (payload: any) => fetchJson<any>('/documents/add-to-graph', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // AI Investigator (Groq)
  queryAi: (query: string, investigationId = 'inv-001') => fetchJson<{
    raw_response: string;
    model_used: string;
    mode: string;
    disclaimer: string;
  }>('/ai/query', {
    method: 'POST',
    body: JSON.stringify({ query, investigation_id: investigationId })
  }),

  // OSINT
  searchOsint: (query: string, investigationId = 'inv-001') => fetchJson<{
    mode: string;
    query: string;
    retrieved_at: string;
    disclaimer: string;
    results: OsintResult[];
  }>('/osint/search', {
    method: 'POST',
    body: JSON.stringify({ query, investigation_id: investigationId })
  }),
  addOsintToGraph: (osintId: string, investigationId = 'inv-001') => fetchJson<any>('/osint/add-to-graph', {
    method: 'POST',
    body: JSON.stringify({ osint_id: osintId, investigation_id: investigationId })
  }),

  // Evidence Vault
  getEvidenceList: () => fetchJson<EvidenceItem[]>('/evidence'),
  getEvidenceDetail: (id: string) => fetchJson<EvidenceItem>(`/evidence/${id}`),
  createEvidence: (payload: any) => fetchJson<any>('/evidence', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyEvidence: (evidenceId: string, simulateTamper = false) => fetchJson<{
    success: boolean;
    evidence_code: string;
    title: string;
    stored_sha256: string;
    computed_sha256: string;
    status: string;
    is_valid: boolean;
    verified_at: string;
    message: string;
  }>(`/evidence/${evidenceId}/verify`, {
    method: 'POST',
    body: JSON.stringify({ simulate_tamper: simulateTamper })
  }),

  // Investigation Priority
  getPriorityLeads: () => fetchJson<PriorityLead[]>('/priority/leads'),

  // Audit Logs
  getAuditLogs: () => fetchJson<AuditLog[]>('/audit'),

  // Dynamic Case & Graph Management
  createInvestigation: (payload: any) => fetchJson<any>('/investigations', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  addEntity: (payload: any) => fetchJson<any>('/network/entity', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  addRelationship: (payload: any) => fetchJson<any>('/network/relationship', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // CSV Import Wizard
  previewCsv: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/import/preview`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`CSV preview failed: ${await res.text()}`);
    return res.json();
  },
  executeCsvImport: (payload: { rows: any[]; mappings: any; investigation_id?: string }) => fetchJson<any>('/import/execute', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Investigation Reports
  getInvestigationReport: (investigationId: string = 'inv-001') => fetchJson<any>(`/reports/investigation/${investigationId}`),

  // Dual-Mode & Keys Management
  getMode: () => fetchJson<{ mode: 'mock' | 'original'; description: string }>('/settings/mode'),
  setMode: (mode: 'mock' | 'original') => fetchJson<{ success: boolean; mode: string; message: string }>('/settings/mode', {
    method: 'POST',
    body: JSON.stringify({ mode })
  }),
  getKeysStatus: () => fetchJson<{ groq_api_key_configured: boolean; supabase_configured: boolean; search_api_key_configured: boolean }>('/settings/keys'),
  updateKeys: (keys: { groq_api_key?: string; supabase_url?: string; supabase_anon_key?: string; search_api_key?: string }) => fetchJson<any>('/settings/keys', {
    method: 'POST',
    body: JSON.stringify(keys)
  }),
  seedOriginal: () => fetchJson<{ success: boolean; message: string; case_id: string; entity_count: number; edge_count: number }>('/settings/seed-original', {
    method: 'POST'
  }),
  resetOriginal: () => fetchJson<{ success: boolean; message: string }>('/settings/reset-original', {
    method: 'POST'
  })
};

