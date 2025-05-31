
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
    if (fromMember.parentIds.includes(toId)) {
      const parent = this.members.find(m => m.id === toId);
      // Could be more specific like Father/Mother if we had gender data
      return 'Parent';
    }
    if (fromMember.childrenIds.includes(toId)) {
      const child = this.members.find(m => m.id === toId);
      // Could be more specific like Son/Daughter if we had gender data
      return 'Child';
    }

    // Check siblings
    const sharedParents = fromMember.parentIds.filter(parentId => 
      toMember.parentIds.includes(parentId)
    );
    if (sharedParents.length > 0) {
      if (sharedParents.length === fromMember.parentIds.length && 
          sharedParents.length === toMember.parentIds.length) {
        return 'Sibling';
      } else {
        return 'Half-sibling';
      }
    }

    // Check in-laws through spouse
    if (fromMember.spouseId) {
      const spouse = this.members.find(m => m.id === fromMember.spouseId);
      if (spouse) {
        if (spouse.parentIds.includes(toId)) return 'Parent-in-law';
        if (spouse.childrenIds.includes(toId)) return 'Child-in-law';
        
        // Check spouse's siblings
        const spouseSharedParents = spouse.parentIds.filter(parentId => 
          toMember.parentIds.includes(parentId)
        );
        if (spouseSharedParents.length > 0) return 'Sibling-in-law';
      }
    }

    // Check extended family
    const relationship = this.calculateExtendedRelationship(fromId, toId);
    return relationship || 'Family Member';
  }

  private calculateExtendedRelationship(fromId: string, toId: string): string | null {
    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return null;

    // Check grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent && parent.parentIds.includes(toId)) {
        return 'Grandparent';
      }
    }

    // Check grandchildren
    for (const childId of fromMember.childrenIds) {
      const child = this.members.find(m => m.id === childId);
      if (child && child.childrenIds.includes(toId)) {
        return 'Grandchild';
      }
    }

    // Check great-grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent && grandparent.parentIds.includes(toId)) {
            return 'Great-grandparent';
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
          if (grandchild && grandchild.childrenIds.includes(toId)) {
            return 'Great-grandchild';
          }
        }
      }
    }

    // Check aunts/uncles (parent's siblings)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const auntUncleId of grandparent.childrenIds) {
              if (auntUncleId !== parentId && auntUncleId === toId) {
                return 'Aunt/Uncle';
              }
            }
          }
        }
      }
    }

    // Check great-aunts/great-uncles (grandparent's siblings)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const greatGrandparentId of grandparent.parentIds) {
              const greatGrandparent = this.members.find(m => m.id === greatGrandparentId);
              if (greatGrandparent) {
                for (const greatAuntUncleId of greatGrandparent.childrenIds) {
                  if (greatAuntUncleId !== grandparentId && greatAuntUncleId === toId) {
                    return 'Great-aunt/Great-uncle';
                  }
                }
              }
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
          if (siblingId !== fromId) {
            const sibling = this.members.find(m => m.id === siblingId);
            if (sibling && sibling.childrenIds.includes(toId)) {
              return 'Niece/Nephew';
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
          if (siblingId !== fromId) {
            const sibling = this.members.find(m => m.id === siblingId);
            if (sibling) {
              for (const nieceNephewId of sibling.childrenIds) {
                const nieceNephew = this.members.find(m => m.id === nieceNephewId);
                if (nieceNephew && nieceNephew.childrenIds.includes(toId)) {
                  return 'Grand-niece/Grand-nephew';
                }
              }
            }
          }
        }
      }
    }

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
                if (auntUncle && auntUncle.childrenIds.includes(toId)) {
                  return 'First cousin';
                }
              }
            }
          }
        }
      }
    }

    // Check second cousins (first cousin's children or parent's first cousin)
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
                      for (const firstCousinOnceRemovedId of grandAuntUncle.childrenIds) {
                        const firstCousinOnceRemoved = this.members.find(m => m.id === firstCousinOnceRemovedId);
                        if (firstCousinOnceRemoved && firstCousinOnceRemoved.childrenIds.includes(toId)) {
                          return 'Second cousin';
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check first cousin once removed (cousin's child or parent's cousin)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        // Check if toMember is parent's first cousin
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const greatGrandparentId of grandparent.parentIds) {
              const greatGrandparent = this.members.find(m => m.id === greatGrandparentId);
              if (greatGrandparent) {
                for (const grandAuntUncleId of greatGrandparent.childrenIds) {
                  if (grandAuntUncleId !== grandparentId) {
                    const grandAuntUncle = this.members.find(m => m.id === grandAuntUncleId);
                    if (grandAuntUncle && grandAuntUncle.childrenIds.includes(toId)) {
                      return 'First cousin once removed';
                    }
                  }
                }
              }
            }
          }
        }

        // Check if toMember is first cousin's child
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent) {
            for (const auntUncleId of grandparent.childrenIds) {
              if (auntUncleId !== parentId) {
                const auntUncle = this.members.find(m => m.id === auntUncleId);
                if (auntUncle) {
                  for (const firstCousinId of auntUncle.childrenIds) {
                    const firstCousin = this.members.find(m => m.id === firstCousinId);
                    if (firstCousin && firstCousin.childrenIds.includes(toId)) {
                      return 'First cousin once removed';
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
