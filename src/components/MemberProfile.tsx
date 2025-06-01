
import React, { useState } from 'react';
import { X, Edit } from 'lucide-react';
import { FamilyMember } from '../types/FamilyTree';
import RelationshipCalculator from '../utils/RelationshipCalculator';
import EditMemberModal from './EditMemberModal';

interface MemberProfileProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  focusedMemberId?: string | null;
  onClose: () => void;
  onEdit?: (member: FamilyMember) => void;
}

const MemberProfile: React.FC<MemberProfileProps> = ({
  member,
  allMembers,
  focusedMemberId,
  onClose,
  onEdit
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const relationshipCalc = new RelationshipCalculator(allMembers);
  
  const getRelationshipToFocused = () => {
    if (!focusedMemberId || focusedMemberId === member.id) return null;
    return relationshipCalc.getRelationship(focusedMemberId, member.id);
  };

  const spouse = member.spouseId ? allMembers.find(m => m.id === member.spouseId) : null;
  const parents = member.parentIds.map(id => allMembers.find(m => m.id === id)).filter(Boolean);
  const children = member.childrenIds.map(id => allMembers.find(m => m.id === id)).filter(Boolean);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedMember: FamilyMember) => {
    if (onEdit) {
      onEdit(updatedMember);
    }
    setShowEditModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">परिवार सदस्यको विवरण</h2>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={20} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {member.profilePicture && (
                <div className="flex-shrink-0">
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-64 h-64 rounded-lg object-cover border shadow-lg"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h3>
                
                {getRelationshipToFocused() && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 font-medium">
                      Relationship: {getRelationshipToFocused()}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                   {member.gender && (
                    <div>
                      <span className="font-medium text-gray-700">लिङ्ग:</span>
                      <span className="ml-2 text-gray-600">{member.gender}</span>
                    </div>
                  )}
                  {member.birthDate && (
                    <div>
                      <span className="font-medium text-gray-700">जन्म (ई.सं.):</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(member.birthDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {member.deathDate && (
                    <div>
                      <span className="font-medium text-gray-700">निधन (ई.सं.):</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(member.deathDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {spouse && (
                    <div>
                      <span className="font-medium text-gray-700">जीवनसाथी:</span>
                      <span className="ml-2 text-gray-600">{spouse.name}</span>
                    </div>
                  )}
                  
                  {parents.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">अभिभावक:</span>
                      <span className="ml-2 text-gray-600">
                        {parents.map(p => p!.name).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {children.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">सन्तान:</span>
                      <span className="ml-2 text-gray-600">
                        {children.map(c => c!.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {member.phoneNumber && (
                    <div>
                      <span className="font-medium text-gray-700">फोन नम्बर:</span>
                      <span className="ml-2 text-gray-600">{member.phoneNumber}</span>
                    </div>
                  )}

                  {member.email && (
                    <div>
                      <span className="font-medium text-gray-700">इमेल:</span>
                      <span className="ml-2 text-gray-600">{member.email}</span>
                    </div>
                  )}

                  {member.socialMediaLink && (
                    <div>
                      <span className="font-medium text-gray-700">सामाजिक सञ्जाल:</span>
                      <a
                        href={member.socialMediaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        {member.socialMediaLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {member.biography && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">जीवन वृत्तान्त</h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {member.biography}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && onEdit && (
        <EditMemberModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          member={member}
          existingMembers={allMembers}
        />
      )}
    </>
  );
};

export default MemberProfile;
