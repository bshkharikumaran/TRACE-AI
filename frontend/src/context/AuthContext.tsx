import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

export interface DemoOfficerProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  badge: string;
  department: string;
  clearanceLevel: string;
  description: string;
}

export const DEMO_OFFICERS: DemoOfficerProfile[] = [
  {
    id: 'u-003',
    name: 'Deputy Director Alok Verma',
    email: 'admin@ncrb.gov.in',
    role: 'administrator',
    title: 'Directorate of Operations',
    badge: 'NCRB-ADM-1001',
    department: 'Directorate of Operations, NCRB',
    clearanceLevel: 'LEVEL 1 — TOP SECRET / UNRESTRICTED',
    description: 'Full administrative authority across database modes, audit configurations, and system-wide overrides.'
  },
  {
    id: 'u-001',
    name: 'Inspector Rajeshwari Devi',
    email: 'investigator@ncrb.gov.in',
    role: 'investigator',
    title: 'Lead Investigation Officer',
    badge: 'NCRB-INV-7741',
    department: 'Women Safety Division & Special Crime Cell, NCRB',
    clearanceLevel: 'LEVEL 2 — OPERATIONAL COMMAND',
    description: 'Empowered to register FIRs, launch investigations, deposit verified evidence exhibits, and direct inquiries.'
  },
  {
    id: 'u-002',
    name: 'Sr. Analyst Sameer Sen',
    email: 'analyst@ncrb.gov.in',
    role: 'analyst',
    title: 'Cyber & Financial Forensics Specialist',
    badge: 'NCRB-ANA-3302',
    department: 'Cyber & Financial Intelligence Unit',
    clearanceLevel: 'LEVEL 3 — ANALYTICAL ACCESS',
    description: 'Access to heterogeneous graph topology, temporal emerging network alarms, OSINT, and financial flows.'
  },
  {
    id: 'u-004',
    name: 'Vigilance Officer K. Raman',
    email: 'auditor@ncrb.gov.in',
    role: 'auditor',
    title: 'Compliance & Judicial Integrity Inspector',
    badge: 'NCRB-AUD-5590',
    department: 'Internal Oversight & Compliance Division',
    clearanceLevel: 'LEVEL 2 — COMPLIANCE OVERSIGHT',
    description: 'Read-only access to tamper verification, cryptographic hashes, and court-admissible audit trails.'
  }
];

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  quickLoginAs: (officer: DemoOfficerProfile) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('trace_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('trace_auth_token');
  });

  const [loading, setLoading] = useState(false);

  const login = async (email: string, password = 'demo'): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.login(email);
      if (res && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('trace_auth_user', JSON.stringify(res.user));
        localStorage.setItem('trace_auth_token', res.token);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Backend login fallback to local profile match:', err);
      // Fallback matching demo profile
      const match = DEMO_OFFICERS.find(
        (o) => o.email.toLowerCase() === email.toLowerCase() || o.role === email.toLowerCase()
      ) || DEMO_OFFICERS[1]; // default to investigator
      
      const fallbackUser: User = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        department: match.department,
        badge_number: match.badge,
        permissions: ['all']
      };
      const fallbackToken = `jwt_local_${match.id}`;
      setUser(fallbackUser);
      setToken(fallbackToken);
      localStorage.setItem('trace_auth_user', JSON.stringify(fallbackUser));
      localStorage.setItem('trace_auth_token', fallbackToken);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const quickLoginAs = async (officer: DemoOfficerProfile): Promise<boolean> => {
    return login(officer.email);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trace_auth_user');
    localStorage.removeItem('trace_auth_token');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'administrator') return true;
    if (!user.permissions) return true; // default open if not specified
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  const isRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        quickLoginAs,
        logout,
        hasPermission,
        isRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
