
import { RelationshipMember, NEPALI_RELATIONSHIPS } from './RelationshipTypes';

export class DirectRelationships {
  private members: RelationshipMember[];

  constructor(members: RelationshipMember[]) {
    this.members = members;
  }

  getDirectRelationship(fromId: string, toId: string): string | null {
    if (fromId === toId) return NEPALI_RELATIONSHIPS.SELF;

    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return NEPALI_RELATIONSHIPS.UNKNOWN;

    // Check spouse relationship
    if (fromMember.spouseId === toId) {
      return this.getSpouseRelationship(toMember);
    }
    
    // Check parent relationship
    if (fromMember.parentIds.includes(toId)) {
      return this.getParentRelationship(toMember);
    }

    // Check child relationship
    if (fromMember.childrenIds.includes(toId)) {
      return this.getChildRelationship(toMember);
    }

    // Check sibling relationship
    const siblingRelation = this.getSiblingRelationship(fromMember, toMember);
    if (siblingRelation) return siblingRelation;

    // Check in-law relationships through spouse
    const inLawRelation = this.getInLawRelationship(fromMember, toMember);
    if (inLawRelation) return inLawRelation;

    return null;
  }

  private getSpouseRelationship(member: RelationshipMember): string {
    if (member.gender === 'Male') return NEPALI_RELATIONSHIPS.HUSBAND;
    if (member.gender === 'Female') return NEPALI_RELATIONSHIPS.WIFE;
    return NEPALI_RELATIONSHIPS.SPOUSE;
  }

  private getParentRelationship(member: RelationshipMember): string {
    if (member.gender === 'Male') return NEPALI_RELATIONSHIPS.FATHER;
    if (member.gender === 'Female') return NEPALI_RELATIONSHIPS.MOTHER;
    return NEPALI_RELATIONSHIPS.PARENT;
  }

  private getChildRelationship(member: RelationshipMember): string {
    if (member.gender === 'Male') return NEPALI_RELATIONSHIPS.SON;
    if (member.gender === 'Female') return NEPALI_RELATIONSHIPS.DAUGHTER;
    return NEPALI_RELATIONSHIPS.CHILD;
  }

  private getSiblingRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    const sharedParents = fromMember.parentIds.filter(parentId => 
      toMember.parentIds.includes(parentId)
    );
    
    if (sharedParents.length === 0) return null;

    if (sharedParents.length === fromMember.parentIds.length && 
        sharedParents.length === toMember.parentIds.length) {
      // Full siblings
      const isOlder = this.isOlderSibling(toMember, fromMember);
      
      if (toMember.gender === 'Male') {
        return isOlder ? NEPALI_RELATIONSHIPS.ELDER_BROTHER : NEPALI_RELATIONSHIPS.BROTHER;
      } else if (toMember.gender === 'Female') {
        return isOlder ? NEPALI_RELATIONSHIPS.ELDER_SISTER : NEPALI_RELATIONSHIPS.SISTER;
      } else {
        return NEPALI_RELATIONSHIPS.SIBLING;
      }
    } else {
      // Half siblings
      if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.HALF_BROTHER;
      if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.HALF_SISTER;
      return NEPALI_RELATIONSHIPS.HALF_SIBLING;
    }
  }

  private getInLawRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    if (!fromMember.spouseId) return null;

    const spouse = this.members.find(m => m.id === fromMember.spouseId);
    if (!spouse) return null;

    // Parent-in-law
    if (spouse.parentIds.includes(toMember.id)) {
      if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.FATHER_IN_LAW;
      if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.MOTHER_IN_LAW;
      return NEPALI_RELATIONSHIPS.PARENT_IN_LAW;
    }
    
    // Child-in-law
    if (spouse.childrenIds.includes(toMember.id)) {
      if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.SON_IN_LAW;
      if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.DAUGHTER_IN_LAW;
      return NEPALI_RELATIONSHIPS.CHILD_IN_LAW;
    }
    
    // Spouse's siblings
    const spouseSharedParents = spouse.parentIds.filter(parentId => 
      toMember.parentIds.includes(parentId)
    );
    if (spouseSharedParents.length > 0) {
      const isOlder = this.isOlderSibling(spouse, toMember);
      
      if (toMember.gender === 'Male') {
        return isOlder ? NEPALI_RELATIONSHIPS.ELDER_BROTHER : NEPALI_RELATIONSHIPS.BROTHER;
      } else if (toMember.gender === 'Female') {
        return isOlder ? NEPALI_RELATIONSHIPS.ELDER_SISTER : NEPALI_RELATIONSHIPS.SISTER;
      } else {
        return 'देवर/भाउजू';
      }
    }

    return null;
  }

  isOlderSibling(person1: RelationshipMember, person2: RelationshipMember): boolean {
    if (!person1.birthDate || !person2.birthDate) return false;
    return new Date(person1.birthDate) > new Date(person2.birthDate);
  }
}
