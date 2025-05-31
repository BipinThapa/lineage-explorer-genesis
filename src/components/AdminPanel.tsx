
import React, { useState } from 'react';
import { Plus, Download, Upload, Settings } from 'lucide-react';
import AddMemberModal from './AddMemberModal';
import { FamilyMember, FamilyTreeData } from '../types/FamilyTree';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminPanelProps {
  familyData: FamilyTreeData;
  onAddMember: (member: Partial<FamilyMember>) => void;
  onEditMember: (member: FamilyMember) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  familyData,
  onAddMember,
  onEditMember,
  onExportData,
  onImportData
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const { t } = useLanguage();

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImportData(file);
      }
    };
    input.click();
  };

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <Settings size={24} />
      </button>

      {showPanel && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl border p-4 space-y-2 z-40">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Plus size={20} />
            {t('add.member')}
          </button>
          
          <button
            onClick={onExportData}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Download size={20} />
            {t('export.data')}
          </button>
          
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Upload size={20} />
            {t('import.data')}
          </button>
        </div>
      )}

      {showAddModal && (
        <AddMemberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={onAddMember}
          existingMembers={familyData.members}
        />
      )}
    </>
  );
};

export default AdminPanel;
