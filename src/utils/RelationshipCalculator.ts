
import { FamilyMember } from '../types/FamilyTree';
import { DirectRelationships } from './relationships/DirectRelationships';
import { ExtendedRelationships } from './relationships/ExtendedRelationships';
import { RelationshipMember, NEPALI_RELATIONSHIPS } from './relationships/RelationshipTypes';

export default class RelationshipCalculator {
  private members: RelationshipMember[];
  private directRelations: DirectRelationships;
  private extendedRelations: ExtendedRelationships;

  constructor(members: FamilyMember[]) {
    // Convert FamilyMember to RelationshipMember
    this.members = members.map(member => ({
      id: member.id,
      gender: member.gender,
      parentIds: member.parentIds,
      childrenIds: member.childrenIds,
      spouseId: member.spouseId,
      birthDate: member.birthDate
    }));
    
    this.directRelations = new DirectRelationships(this.members);
    this.extendedRelations = new ExtendedRelationships(this.members);
  }

  getRelationship(fromId: string, toId: string): string {
    if (fromId === toId) return NEPALI_RELATIONSHIPS.SELF;

    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return NEPALI_RELATIONSHIPS.UNKNOWN;

    // Try direct relationships first
    const directRelation = this.directRelations.getDirectRelationship(fromId, toId);
    if (directRelation) return directRelation;

    // Try extended relationships
    const extendedRelation = this.extendedRelations.getExtendedRelationship(fromId, toId);
    if (extendedRelation) return extendedRelation;

    // Default fallback
    return NEPALI_RELATIONSHIPS.FAMILY_MEMBER;
  }
}
