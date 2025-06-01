
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FamilyMember } from '../types/FamilyTree';

interface FamilyMemberNodeProps {
  data: {
    member: FamilyMember;
    relationshipLabel?: string;
    isFocused?: boolean;
    onClick: (member: FamilyMember) => void;
  };
}

const FamilyMemberNode: React.FC<FamilyMemberNodeProps> = ({ data }) => {
  const { member, relationshipLabel, isFocused, onClick } = data;

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-300 ${
        isFocused ? 'border-blue-500 shadow-xl scale-105 ring-4 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      } ${relationshipLabel ? 'opacity-90' : 'opacity-100'}`}
      onClick={() => onClick(member)}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-500" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-pink-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-pink-500" />
      
      <div className="p-4 min-w-[200px]">
        {member.profilePicture && (
          <div className="flex justify-center mb-3">
            <img
              src={member.profilePicture}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )}
        
        <div className="text-center">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">{member.name}</h3>
          {member.birthDate && (
            <p className="text-sm text-gray-600">
              जन्म वर्ष (ई.सं.): {new Date(member.birthDate).getFullYear()}
              {member.deathDate && ` - ${new Date(member.deathDate).getFullYear()}`}
            </p>
          )}
          
          {relationshipLabel && (
            <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {relationshipLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberNode;
