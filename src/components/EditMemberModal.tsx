import React, { useState, useEffect } from 'react';
import { X, User, Heart, Users } from 'lucide-react';
import { FamilyMember } from '../types/FamilyTree';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
  member: FamilyMember;
  existingMembers: FamilyMember[];
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  member,
  existingMembers
}) => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    biography: '',
    birthDate: '',
    deathDate: '',
    spouseId: '',
    parentIds: [] as string[],
    childrenIds: [] as string[],
    gender: '',
    socialMediaLink: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        profilePicture: member.profilePicture,
        biography: member.biography,
        birthDate: member.birthDate,
        deathDate: member.deathDate || '',
        spouseId: member.spouseId || '',
        parentIds: member.parentIds,
        childrenIds: member.childrenIds,
        gender: member.gender || '',
        socialMediaLink: member.socialMediaLink || '',
        phone: member.phone || '',
        email: member.email || ''
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...member,
      ...formData,
      parentIds: formData.parentIds,
      childrenIds: formData.childrenIds
    });
    onClose();
  };

  const handleParentChange = (memberId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        parentIds: [...prev.parentIds, memberId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        parentIds: prev.parentIds.filter(id => id !== memberId)
      }));
    }
  };

  const handleChildChange = (memberId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        childrenIds: [...prev.childrenIds, memberId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        childrenIds: prev.childrenIds.filter(id => id !== memberId)
      }));
    }
  };

  // Filter out current member from available options
  const availableMembers = existingMembers.filter(m => m.id !== member.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Family Member</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={formData.profilePicture}
                onChange={(e) => setFormData(prev => ({ ...prev, profilePicture: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Link
              </label>
              <input
                type="url"
                value={formData.socialMediaLink}
                onChange={(e) => setFormData(prev => ({ ...prev, socialMediaLink: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Death Date (if applicable)
              </label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deathDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              value={formData.biography}
              onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about this family member..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart size={16} className="inline mr-1" />
                Spouse
              </label>
              <select
                value={formData.spouseId}
                onChange={(e) => setFormData(prev => ({ ...prev, spouseId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select spouse...</option>
                {availableMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Parents
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {availableMembers.map(m => (
                  <label key={m.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={formData.parentIds.includes(m.id)}
                      onChange={(e) => handleParentChange(m.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Children
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {availableMembers.map(m => (
                  <label key={m.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={formData.childrenIds.includes(m.id)}
                      onChange={(e) => handleChildChange(m.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;
