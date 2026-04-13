import FileExplorer from '../../components/fileExplorer/FileExplorer';
import { useAuth } from '../../context/AuthContext';

export default function UserDocuments() {
  const { user } = useAuth();
  const companyId = user?.company_id || user?.companyId;

  return (
    <div className="-m-4 lg:-m-6 h-[calc(100vh-4rem)]">
      <FileExplorer role="client" companyId={companyId} currentUserId={user?.id} />
    </div>
  );
}
