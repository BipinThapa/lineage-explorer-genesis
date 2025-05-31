import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Node, Edge, useNodesState, useEdgesState, addEdge, Connection, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FamilyMemberNode from '../components/FamilyMemberNode';
import MemberProfile from '../components/MemberProfile';
import AdminPanel from '../components/AdminPanel';
import LoginModal from '../components/LoginModal';
import LanguageSwitcher from '../components/LanguageSwitcher';
import RelationshipCalculator from '../utils/RelationshipCalculator';
import { FamilyMember, FamilyTreeData } from '../types/FamilyTree';
import { generateNodesAndEdges } from '../utils/FamilyTreeUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [familyData, setFamilyData] = useState<FamilyTreeData>({ members: [], familyName: "Family Tree" });
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  const { t } = useLanguage();

  // Load initial data
  useEffect(() => {
    loadFamilyData();
  }, []);

  // Update nodes and edges when family data changes
  useEffect(() => {
    if (familyData.members.length > 0) {
      const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(
        familyData.members,
        focusedMemberId,
        handleMemberClick
      );
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [familyData, focusedMemberId]);

  const loadFamilyData = async () => {
    try {
      // Try to load from localStorage first
      const savedData = localStorage.getItem('familyTreeData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFamilyData({ ...parsedData, familyName: parsedData.familyName || "Family Tree" });
        return;
      }

      // Load default data
      const response = await fetch('/family-tree-data.json');
      if (response.ok) {
        const data = await response.json();
        setFamilyData({ ...data, familyName: data.familyName || "क़ूल परिवार" });
        localStorage.setItem('familyTreeData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading family data:', error);
      toast.error(t('failed.to.load.family.data'));
    }
  };

  const saveFamilyData = (data: FamilyTreeData) => {
    localStorage.setItem('familyTreeData', JSON.stringify(data));
    setFamilyData(data);
  };

  const handleMemberClick = useCallback((member: FamilyMember) => {
    setSelectedMember(member);
    setFocusedMemberId(member.id);
  }, []);

  const handleNodeDrag = useCallback((event: any, node: Node) => {
    // Update member position in family data
    const updatedMembers = familyData.members.map(member => 
      member.id === node.id 
        ? { ...member, position: { x: node.position.x, y: node.position.y } }
        : member
    );
    
    const updatedData = { ...familyData, members: updatedMembers };
    saveFamilyData(updatedData);
  }, [familyData]);

  const handleConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddMember = (memberData: Partial<FamilyMember>) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: memberData.name || '',
      profilePicture: memberData.profilePicture || '',
      biography: memberData.biography || '',
      birthDate: memberData.birthDate || '',
      deathDate: memberData.deathDate,
      spouseId: memberData.spouseId,
      parentIds: memberData.parentIds || [],
      childrenIds: memberData.childrenIds || [],
      position: memberData.position || { x: 0, y: 0 }
    };

    const updatedMembers = [...familyData.members, newMember];
    
    // Update relationships
    if (newMember.spouseId) {
      const spouse = updatedMembers.find(m => m.id === newMember.spouseId);
      if (spouse) {
        spouse.spouseId = newMember.id;
      }
    }

    if (newMember.parentIds) {
      newMember.parentIds.forEach(parentId => {
        const parent = updatedMembers.find(m => m.id === parentId);
        if (parent && !parent.childrenIds.includes(newMember.id)) {
          parent.childrenIds.push(newMember.id);
        }
      });
    }

    if (newMember.childrenIds) {
      newMember.childrenIds.forEach(childId => {
        const child = updatedMembers.find(m => m.id === childId);
        if (child && !child.parentIds.includes(newMember.id)) {
          child.parentIds.push(newMember.id);
        }
      });
    }

    saveFamilyData({ ...familyData, members: updatedMembers });
    toast.success(t('member.added.successfully'));
  };

  const handleEditMember = (updatedMember: FamilyMember) => {
    const updatedMembers = familyData.members.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    );
    saveFamilyData({ ...familyData, members: updatedMembers });
    setSelectedMember(updatedMember); // Update the selected member state
    toast.success(t('member.updated.successfully'));
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(familyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-tree-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success(t('data.exported.successfully'));
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        saveFamilyData(importedData);
        toast.success(t('data.imported.successfully'));
      } catch (error) {
        toast.error(t('invalid.file.format'));
      }
    };
    reader.readAsText(file);
  };

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    toast.success(t('logged.out.successfully'));
  };

  return (
    <div className="h-screen w-full relative">
      {/* Family Name Heading */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="text-4xl font-bold text-gray-800 bg-white px-6 py-3 rounded-lg shadow-lg border">
          {familyData.familyName || t('family.tree')}
        </h1>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 left-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isAdmin ? t('admin.panel') : t('admin.login')}
        </button>
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('logout')}
          </button>
        )}
        {focusedMemberId && (
          <button
            onClick={() => setFocusedMemberId(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('clear.focus')}
          </button>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeDragStop={handleNodeDrag}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {selectedMember && (
        <MemberProfile
          member={selectedMember}
          allMembers={familyData.members}
          focusedMemberId={focusedMemberId}
          onClose={() => setSelectedMember(null)}
          onEdit={isAdmin ? handleEditMember : undefined}
        />
      )}

      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {isAdmin && (
        <AdminPanel
          familyData={familyData}
          onAddMember={handleAddMember}
          onEditMember={handleEditMember}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      )}
    </div>
  );
};

export default Index;
