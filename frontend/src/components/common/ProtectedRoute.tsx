import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission
}) => {
  const { user, isRole, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in, redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role restrictions if specified
  if (allowedRoles && !isRole(...allowedRoles)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-amber-200 rounded-2xl p-8 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Access Restricted
            </span>
            <h2 className="text-xl font-bold text-slate-900">Officer Clearance Required</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your active profile (<strong className="capitalize">{user.role}</strong>) does not hold authorization to access this module under standard NCRB security rules.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono text-left border border-slate-200 space-y-1">
            <p><strong>Required Role(s):</strong> {allowedRoles.join(', ')}</p>
            <p><strong>Active Officer:</strong> {user.name}</p>
            <p><strong>Badge:</strong> {user.badge_number || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Officer Role</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check action permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
