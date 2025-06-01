import React, { useState } from 'react';
import { X, User, Heart, Users, Phone, Mail, Globe, GenderMale, GenderFemale  } from 'lucide-react';
import { FamilyMember } from '../types/FamilyTree';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Partial<FamilyMember>) => void;
  existingMembers: FamilyMember[];
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      parentIds: formData.parentIds,
      childrenIds: formData.childrenIds,
      position: { x: Math.random() * 400, y: Math.random() * 400 }
    });
    setFormData({
      name: '',
      profilePicture: '',
      biography: '',
      birthDate: '',
      deathDate: '',
      spouseId: '',
      parentIds: [],
      childrenIds: [],
      gender: '',
      socialMediaLink: '',
      phone: '',
      email: ''
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add Family Member</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                <Globe size={16} className="inline mr-1" />
                Social Media Link
              </label>
              <input
                type="url"
                value={formData.socialMediaLink}
                onChange={(e) => setFormData(prev => ({ ...prev, socialMediaLink: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                {existingMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
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
                {existingMembers.map(member => (
                  <label key={member.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={formData.parentIds.includes(member.id)}
                      onChange={(e) => handleParentChange(member.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{member.name}</span>
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
                {existingMembers.map(member => (
                  <label key={member.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={formData.childrenIds.includes(member.id)}
                      onChange={(e) => handleChildChange(member.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{member.name}</span>
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
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
