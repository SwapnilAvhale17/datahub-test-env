import { useEffect, useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WorkspaceDashboardDatahub from '../broker/workspace/WorkspaceDashboardDatahub';

export default function ClientDatahubDashboard() {
  const { user } = useAuth();
  const assignedCompanies = useMemo(() => (
    user?.assignedCompanies?.length
      ? user.assignedCompanies
      : [{ id: user?.company_id || user?.companyId, name: user?.company }].filter((company) => company.id)
  ), [user?.assignedCompanies, user?.company_id, user?.companyId, user?.company]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(assignedCompanies[0]?.id || '');

  useEffect(() => {
    if (!assignedCompanies.length) return;
    if (!selectedCompanyId || !assignedCompanies.some((company) => String(company.id) === String(selectedCompanyId))) {
      setSelectedCompanyId(assignedCompanies[0].id);
    }
  }, [assignedCompanies, selectedCompanyId]);

  const selectedCompany = assignedCompanies.find((company) => String(company.id) === String(selectedCompanyId)) || assignedCompanies[0] || null;

  if (!selectedCompany) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-card">
        <Building2 size={32} className="mx-auto mb-3 text-[#A5A5A5]" />
        <h1 className="text-xl font-bold text-[#050505]">No company assigned</h1>
        <p className="mt-1 text-sm text-[#6D6E71]">Ask your broker to assign you to a company to view DataHub details.</p>
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6">
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8BC53D]">User DataHub</p>
            <h1 className="text-xl font-bold text-[#050505]">{selectedCompany.name}</h1>
            <p className="mt-1 text-sm text-[#6D6E71]">Company-specific analytics and financial details.</p>
          </div>
          {assignedCompanies.length > 1 && (
            <select
              value={selectedCompanyId}
              onChange={(event) => setSelectedCompanyId(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-[#05164D]"
            >
              {assignedCompanies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      <WorkspaceDashboardDatahub
        key={selectedCompany.id}
        company={selectedCompany}
        invoicesHref={null}
        showRecentInvoices={false}
        title="DataHub Dashboard"
      />
    </div>
  );
}
