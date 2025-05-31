
import { FamilyMember } from '../types/FamilyTree';

export default class RelationshipCalculator {
  private members: FamilyMember[];

  constructor(members: FamilyMember[]) {
    this.members = members;
  }

  getRelationship(fromId: string, toId: string): string {
    if (fromId === toId) return 'Self';

    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return 'Unknown';

    // Check direct relationships first
    if (fromMember.spouseId === toId) return 'Spouse';
    if (fromMember.parentIds.includes(toId)) return 'Parent';
    if (fromMember.childrenIds.includes(toId)) return 'Child';

    // Check siblings
    const sharedParents = fromMember.parentIds.filter(parentId => 
      toMember.parentIds.includes(parentId)
    );
    if (sharedParents.length > 0) return 'Sibling';

    // Check extended family
    const relationship = this.calculateExtendedRelationship(fromId, toId);
    return relationship || 'Family Member';
  }

  private calculateExtendedRelationship(fromId: string, toId: string): string | null {
    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return null;

    // Check if toMember is a grandparent
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent && parent.parentIds.includes(toId)) {
        return 'Grandparent';
      }
    }

    // Check if toMember is a grandchild
    for (const childId of fromMember.childrenIds) {
      const child = this.members.find(m => m.id === childId);
      if (child && child.childrenIds.includes(toId)) {
        return 'Grandchild';
      }
    }

    // Check if toMember is an aunt/uncle
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const siblingId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === siblingId);
          if (grandparent && grandparent.childrenIds.includes(toId) && toId !== parentId) {
            return 'Aunt/Uncle';
          }
        }
      }
    }

    // Check if toMember is a niece/nephew
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const siblingId of parent.childrenIds) {
          if (siblingId !== fromId) {
            const sibling = this.members.find(m => m.id === siblingId);
            if (sibling && sibling.childrenIds.includes(toId)) {
              return 'Niece/Nephew';
            }
          }
        }
      }
    }

    // Check cousins
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const auntUncleId of grandparent.childrenIds) {
              if (auntUncleId !== parentId) {
                const auntUncle = this.members.find(m => m.id === auntUncleId);
                if (auntUncle && auntUncle.childrenIds.includes(toId)) {
                  return 'Cousin';
                }
              }
            }
          }
        }
      }
    }

    return null;
  }
}
