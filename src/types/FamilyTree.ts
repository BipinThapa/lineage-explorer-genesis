export interface FamilyMember {
  id: string;
  name: string;
  profilePicture: string;
  biography: string;
  birthDate: string;
  deathDate?: string;
  spouseId?: string;
  parentIds: string[];
  childrenIds: string[];
  position: { x: number; y: number };
  gender?: string;
  phoneNumber?: string;
  email?: string;
  socialMediaLink?: string;
}

export interface FamilyTreeData {
  familyName?: string;
  members: FamilyMember[];
}

export interface RelationshipType {
  label: string;
  description: string;
}
