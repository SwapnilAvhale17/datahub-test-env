import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Building2, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function normalizeCompany(company) {
  return {
    id: company.id,
    name: company.name,
    contact: company.contact_name || company.contact || 'Account Lead',
    email: company.contact_email || company.email || 'Not available',
    phone: company.contact_phone || company.phone || 'Not available',
    industry: company.industry || 'General',
    status: company.status || 'active',
  };
}

export default function UserClients() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  // Get assigned companies from authenticated user
  const assignedClients = useMemo(() => {
    if (!user?.assigned_companies?.length) return [];
    return user.assigned_companies.map(normalizeCompany);
  }, [user?.assigned_companies]);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assignedClients;

    return assignedClients.filter((client) => {
      return [client.name, client.contact, client.industry, client.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [assignedClients, search]);

  const summary = useMemo(() => {
    return {
      totalClients: assignedClients.length,
      activeClients: assignedClients.filter((client) => client.status === 'active').length,
    };
  }, [assignedClients]);

  if (assignedClients.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Assigned Clients</h1>
          <p className="mt-1 text-secondary">View and access companies assigned to you</p>
        </div>

        <div className="theme-card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No clients assigned yet</h3>
          <p className="mt-2 max-w-md text-sm text-secondary">
            Your broker will assign clients for you to review. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Assigned Clients</h1>
          <p className="mt-1 text-secondary">View and access companies available for review</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="theme-card flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Building2 size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-secondary">Total Clients</p>
            <p className="text-2xl font-bold text-text-primary">{summary.totalClients}</p>
          </div>
        </div>

        <div className="theme-card flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-light/20">
            <TrendingUp size={20} className="text-green-dark" />
          </div>
          <div>
            <p className="text-sm text-secondary">Active</p>
            <p className="text-2xl font-bold text-text-primary">{summary.activeClients}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search clients by name, contact, or industry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="theme-input w-full rounded-xl py-3 pl-10 pr-4"
        />
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="theme-card py-12 text-center">
          <p className="text-secondary">No clients match your search</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="theme-card hover-card group flex flex-col gap-4 p-6 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {client.name?.slice(0, 2)?.toUpperCase() || 'CO'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-primary truncate">{client.name}</h3>
                    <p className="text-xs text-secondary mt-0.5">{client.industry}</p>
                  </div>
                </div>
                <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-light/20 text-green-dark'
                    : 'bg-text-muted/10 text-text-muted'
                }`}>
                  {client.status === 'active' ? '✓ Active' : 'Inactive'}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-text-muted">Contact</p>
                  <p className="text-sm font-medium text-text-primary">{client.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="text-sm font-medium text-primary truncate">{client.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="text-sm font-medium text-text-primary">{client.phone}</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`/user/client/${client.id}/dashboard`, { state: { company: client } })}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
              >
                View Details <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
