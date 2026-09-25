export type UserRole = 'administrator' | 'investigator' | 'analyst' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  badge_number?: string;
  permissions?: string[];
}

export interface Investigation {
  id: string;
  investigation_code: string;
  title: string;
  description: string;
  status: 'active' | 'under_review' | 'closed' | 'archived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  person_code: string;
  name: string;
  alias?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  risk_score: number;
  network_score: number;
  primary_role: string;
  status: string;
  community_id?: string;
}

export interface CytoscapeNodeData {
  id: string;
  label: string;
  type: string;
  code?: string;
  role?: string;
  risk_score?: number;
  network_score?: number;
  community_id?: string;
  details?: any;
}

export interface CytoscapeEdgeData {
  id: string;
  source: string;
  target: string;
  relationship_type: string;
  confidence: number;
  timestamp?: string;
  source_label?: string;
}

export interface CytoscapeElements {
  nodes: Array<{ data: CytoscapeNodeData }>;
  edges: Array<{ data: CytoscapeEdgeData }>;
}

export interface ExplanationFactor {
  factor: string;
  detail: string;
}

export interface EmergingNetwork {
  id: string;
  alert_code: string;
  alert_type: string;
  title: string;
  description: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
  investigation_id: string;
  entities: Array<{ code: string; name: string; role?: string }>;
  supporting_evidence_codes: string[];
  explanation_factors: ExplanationFactor[];
  investigative_leads?: string[];
  temporal_evolution?: Array<{
    window: string;
    date_range: string;
    active_members: number;
    new_relationships: number;
    summary: string;
  }>;
  metrics_summary?: {
    new_relationships_count: number;
    shared_locations_count: number;
    financial_links_count: number;
    shared_vehicles_count: number;
    activity_increase_percent: number;
    confidence_score: number;
    severity: string;
    shared_financial_accounts?: number;
    acceleration_rate?: string;
  };
  why_flagged?: string;
  supporting_evidence_details?: EvidenceItem[];
}

export interface HiddenConnection {
  id: string;
  code: string;
  title: string;
  entity_a: { code: string; name: string; role: string; community: string };
  entity_b: { code: string; name: string; role: string; community: string };
  confidence: number;
  severity: string;
  status: string;
  common_neighbors: Array<{ code: string; name: string; role: string }>;
  shared_locations: Array<{ code: string; name: string; city: string }>;
  intermediary_transactions: Array<{ from_account: string; to_account: string; amount: string; date: string }>;
  explanation: {
    common_neighbors_count: number;
    shared_locations_count: number;
    temporal_overlap: string;
    transaction_similarity: string;
  };
  supporting_evidence_codes: string[];
  verification_notice: string;
}

export interface CoordinatedActivityStep {
  step_number: number;
  timestamp: string;
  event_type: string;
  title: string;
  actor: string;
  target: string;
  location?: string;
  amount?: string;
  description: string;
  evidence_ref?: string;
}

export interface CoordinatedActivity {
  id: string;
  code: string;
  title: string;
  investigation_code: string;
  summary: string;
  metrics: {
    participants_count: number;
    locations_count: number;
    communication_links_count: number;
    financial_links_count: number;
    time_window_hours: number;
    confidence_score: number;
    severity: string;
  };
  steps: CoordinatedActivityStep[];
  supporting_evidence_codes: string[];
}

export interface EvidenceItem {
  id: string;
  evidence_code: string;
  investigation_id: string;
  title: string;
  description: string;
  file_path?: string;
  file_size_bytes?: number;
  sha256_hash: string;
  source_type: string;
  source_url?: string;
  verification_status: 'verified' | 'tampered' | 'pending_review' | 'unverified';
  created_at: string;
  verified_at?: string;
  code_ref?: string;
}

export interface OsintResult {
  id: string;
  investigation_id: string;
  query: string;
  title: string;
  snippet: string;
  url: string;
  source_domain: string;
  published_at?: string;
  retrieved_at: string;
  relevance_score: number;
  entities_found: string[];
  verification_status: 'unverified' | 'verified' | 'rejected' | 'needs_review';
}

export interface PriorityLead {
  rank: number;
  person_id: string;
  person_code: string;
  name: string;
  alias?: string;
  occupation: string;
  investigation_lead_priority: number;
  classified_role: string;
  communities_connected: number;
  connections_count: number;
  prioritization_factors: string[];
  recommended_action: string;
  disclaimer: string;
  degree_connections?: number;
  betweenness_score?: string | number;
  communities_bridged?: number;
  recent_activity_acceleration?: string;
  why_prioritized?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
  metadata?: any;
}
