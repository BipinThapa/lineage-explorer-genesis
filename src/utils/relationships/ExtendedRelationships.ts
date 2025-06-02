
import { RelationshipMember, NEPALI_RELATIONSHIPS } from './RelationshipTypes';
import { DirectRelationships } from './DirectRelationships';

export class ExtendedRelationships {
  private members: RelationshipMember[];
  private directRelations: DirectRelationships;

  constructor(members: RelationshipMember[]) {
    this.members = members;
    this.directRelations = new DirectRelationships(members);
  }

  getExtendedRelationship(fromId: string, toId: string): string | null {
    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return null;

    // Check grandparents/grandchildren
    const grandRelation = this.getGrandRelationship(fromMember, toMember);
    if (grandRelation) return grandRelation;

    // Check great-grandparents/great-grandchildren
    const greatGrandRelation = this.getGreatGrandRelationship(fromMember, toMember);
    if (greatGrandRelation) return greatGrandRelation;

    // Check aunts/uncles and nieces/nephews
    const auntUncleRelation = this.getAuntUncleRelationship(fromMember, toMember);
    if (auntUncleRelation) return auntUncleRelation;

    // Check cousins
    const cousinRelation = this.getCousinRelationship(fromMember, toMember);
    if (cousinRelation) return cousinRelation;

    // Check great aunts/uncles
    const greatAuntUncleRelation = this.getGreatAuntUncleRelationship(fromMember, toMember);
    if (greatAuntUncleRelation) return greatAuntUncleRelation;

    // Check second cousins and first cousin once removed
    const secondCousinRelation = this.getSecondCousinRelationship(fromMember, toMember);
    if (secondCousinRelation) return secondCousinRelation;

    return null;
  }

  private getGrandRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    // Check grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent && parent.parentIds.includes(toMember.id)) {
        if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.GRANDFATHER;
        if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.GRANDMOTHER;
        return NEPALI_RELATIONSHIPS.GRANDPARENT;
      }
    }

    // Check grandchildren
    for (const childId of fromMember.childrenIds) {
      const child = this.members.find(m => m.id === childId);
      if (child && child.childrenIds.includes(toMember.id)) {
        if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.GRANDSON;
        if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.GRANDDAUGHTER;
        return NEPALI_RELATIONSHIPS.GRANDCHILD;
      }
    }

    return null;
  }

  private getGreatGrandRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    // Check great-grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent && grandparent.parentIds.includes(toMember.id)) {
            if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.GREAT_GRANDFATHER;
            if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.GREAT_GRANDMOTHER;
            return NEPALI_RELATIONSHIPS.GREAT_GRANDPARENT;
          }
        }
      }
    }

    // Check great-grandchildren
    for (const childId of fromMember.childrenIds) {
      const child = this.members.find(m => m.id === childId);
      if (child) {
        for (const grandchildId of child.childrenIds) {
          const grandchild = this.members.find(m => m.id === grandchildId);
          if (grandchild && grandchild.childrenIds.includes(toMember.id)) {
            if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.GREAT_GRANDSON;
            if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.GREAT_GRANDDAUGHTER;
            return NEPALI_RELATIONSHIPS.GREAT_GRANDCHILD;
          }
        }
      }
    }

    return null;
  }

  private getAuntUncleRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    // Check aunts/uncles (parent's siblings)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent && grandparent.childrenIds.includes(toMember.id) && toMember.id !== parentId) {
            const isOlder = this.directRelations.isOlderSibling(toMember, parent);
            
            if (toMember.gender === 'Male') {
              return isOlder ? NEPALI_RELATIONSHIPS.ELDER_UNCLE : NEPALI_RELATIONSHIPS.YOUNGER_UNCLE;
            } else if (toMember.gender === 'Female') {
              return isOlder ? NEPALI_RELATIONSHIPS.ELDER_AUNT : NEPALI_RELATIONSHIPS.YOUNGER_AUNT;
            } else {
              return NEPALI_RELATIONSHIPS.UNCLE_AUNT;
            }
          }
        }
      }
    }

    // Check nieces/nephews (sibling's children)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const siblingId of parent.childrenIds) {
          if (siblingId !== fromMember.id) {
            const sibling = this.members.find(m => m.id === siblingId);
            if (sibling && sibling.childrenIds.includes(toMember.id)) {
              if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.NEPHEW;
              if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.NIECE;
              return NEPALI_RELATIONSHIPS.NEPHEW_NIECE;
            }
          }
        }
      }
    }

    // Check grand-nieces/grand-nephews (sibling's grandchildren)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const siblingId of parent.childrenIds) {
          if (siblingId !== fromMember.id) {
            const sibling = this.members.find(m => m.id === siblingId);
            if (sibling) {
              for (const nieceNephewId of sibling.childrenIds) {
                const nieceNephew = this.members.find(m => m.id === nieceNephewId);
                if (nieceNephew && nieceNephew.childrenIds.includes(toMember.id)) {
                  if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.NEPHEW_SON;
                  if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.NEPHEW_DAUGHTER;
                  return NEPALI_RELATIONSHIPS.NEPHEW_CHILD;
                }
              }
            }
          }
        }
      }
    }

    return null;
  }

  private getCousinRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    // Check first cousins (aunt/uncle's children)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const auntUncleId of grandparent.childrenIds) {
              if (auntUncleId !== parentId) {
                const auntUncle = this.members.find(m => m.id === auntUncleId);
                if (auntUncle && auntUncle.childrenIds.includes(toMember.id)) {
                  if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.COUSIN_BROTHER;
                  if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.COUSIN_SISTER;
                  return NEPALI_RELATIONSHIPS.COUSIN_SIBLING;
                }
              }
            }
          }
        }
      }
    }

    return null;
  }

  private getGreatAuntUncleRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    // Check great-aunts/great-uncles (grandparent's siblings)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const greatGrandparentId of grandparent.parentIds) {
              const greatGrandparent = this.members.find(m => m.id === greatGrandparentId);
              if (greatGrandparent && greatGrandparent.childrenIds.includes(toMember.id) && toMember.id !== grandparentId) {
                if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.GREAT_UNCLE;
                if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.GREAT_AUNT;
                return NEPALI_RELATIONSHIPS.GREAT_UNCLE_AUNT;
              }
            }
          }
        }
      }
    }

    return null;
  }

  private getSecondCousinRelationship(fromMember: RelationshipMember, toMember: RelationshipMember): string | null {
    // Check second cousins and first cousin once removed
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const greatGrandparentId of grandparent.parentIds) {
              const greatGrandparent = this.members.find(m => m.id === greatGrandparentId);
              if (greatGrandparent) {
                for (const grandAuntUncleId of greatGrandparent.childrenIds) {
                  if (grandAuntUncleId !== grandparentId) {
                    const grandAuntUncle = this.members.find(m => m.id === grandAuntUncleId);
                    if (grandAuntUncle) {
                      // Check if toMember is parent's first cousin
                      if (grandAuntUncle.childrenIds.includes(toMember.id)) {
                        if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.COUSIN_BROTHER;
                        if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.COUSIN_SISTER;
                        return NEPALI_RELATIONSHIPS.COUSIN_UNCLE;
                      }
                      
                      // Check second cousins
                      for (const firstCousinOnceRemovedId of grandAuntUncle.childrenIds) {
                        const firstCousinOnceRemoved = this.members.find(m => m.id === firstCousinOnceRemovedId);
                        if (firstCousinOnceRemoved && firstCousinOnceRemoved.childrenIds.includes(toMember.id)) {
                          if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.SECOND_COUSIN_BROTHER;
                          if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.SECOND_COUSIN_SISTER;
                          return NEPALI_RELATIONSHIPS.SECOND_COUSIN_SIBLING;
                        }
                      }
                    }
                  }
                }
              }
            }

            // Check first cousin's child
            for (const auntUncleId of grandparent.childrenIds) {
              if (auntUncleId !== parentId) {
                const auntUncle = this.members.find(m => m.id === auntUncleId);
                if (auntUncle) {
                  for (const firstCousinId of auntUncle.childrenIds) {
                    const firstCousin = this.members.find(m => m.id === firstCousinId);
                    if (firstCousin && firstCousin.childrenIds.includes(toMember.id)) {
                      if (toMember.gender === 'Male') return NEPALI_RELATIONSHIPS.COUSIN_GRANDSON;
                      if (toMember.gender === 'Female') return NEPALI_RELATIONSHIPS.COUSIN_GRANDDAUGHTER;
                      return NEPALI_RELATIONSHIPS.COUSIN_GRANDCHILD;
                    }
                  }
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
