
import { FamilyMember } from '../types/FamilyTree';

export default class RelationshipCalculator {
  private members: FamilyMember[];

  constructor(members: FamilyMember[]) {
    this.members = members;
  }

  getRelationship(fromId: string, toId: string): string {
    if (fromId === toId) return 'आफै';

    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return 'अज्ञात';

    // Check direct relationships first
    if (fromMember.spouseId === toId) {
      if (toMember.gender === 'male') {
        return 'लोग्ने';
      } else if (toMember.gender === 'female') {
        return 'पत्नी';
      } else {
        return 'पति/पत्नी';
      }
    }
    
    if (fromMember.parentIds.includes(toId)) {
      if (toMember.gender === 'male') {
        return 'बुबा';
      } else if (toMember.gender === 'female') {
        return 'आमा';
      } else {
        return 'अभिभावक';
      }
    }

    if (fromMember.childrenIds.includes(toId)) {
      if (toMember.gender === 'male') {
        return 'छोरा';
      } else if (toMember.gender === 'female') {
        return 'छोरी';
      } else {
        return 'सन्तान';
      }
    }

    // Check siblings
    const sharedParents = fromMember.parentIds.filter(parentId => 
      toMember.parentIds.includes(parentId)
    );
    if (sharedParents.length > 0) {
      if (sharedParents.length === fromMember.parentIds.length && 
          sharedParents.length === toMember.parentIds.length) {
        if (toMember.gender === 'male') {
          return 'भाइ';
        } else if (toMember.gender === 'female') {
          return 'बहिनी';
        } else {
          return 'भाइबहिनी';
        }
      } else {
        if (toMember.gender === 'male') {
          return 'सौतेनी भाइ';
        } else if (toMember.gender === 'female') {
          return 'सौतेनी बहिनी';
        } else {
          return 'सौतेनी भाइ/बहिनी';
        }
      }
    }

    // Check in-laws through spouse
    if (fromMember.spouseId) {
      const spouse = this.members.find(m => m.id === fromMember.spouseId);
      if (spouse) {
        if (spouse.parentIds.includes(toId)) {
          if (toMember.gender === 'male') {
            return 'ससुरा';
          } else if (toMember.gender === 'female') {
            return 'सासू';
          } else {
            return 'ससुरा/सासू';
          }
        }
        
        if (spouse.childrenIds.includes(toId)) {
          if (toMember.gender === 'male') {
            return 'ज्वाइँ';
          } else if (toMember.gender === 'female') {
            return 'बुहारी';
          } else {
            return 'ज्वाइँ/बुहारी';
          }
        }
        
        // Check spouse's siblings
        const spouseSharedParents = spouse.parentIds.filter(parentId => 
          toMember.parentIds.includes(parentId)
        );
        if (spouseSharedParents.length > 0) {
          // Check if older or younger sibling based on birth dates
          const isOlder = this.isOlderSibling(spouse, toMember);
          
          if (toMember.gender === 'male') {
            return isOlder ? 'दाजु' : 'भाइ';
          } else if (toMember.gender === 'female') {
            return isOlder ? 'दिदी' : 'बहिनी';
          } else {
            return 'देवर/भाउजू';
          }
        }
      }
    }

    // Check extended family
    const relationship = this.calculateExtendedRelationship(fromId, toId);
    return relationship || 'परिवारका सदस्य';
  }

  private isOlderSibling(person1: FamilyMember, person2: FamilyMember): boolean {
    if (!person1.birthDate || !person2.birthDate) return false;
    return new Date(person1.birthDate) > new Date(person2.birthDate);
  }

  private calculateExtendedRelationship(fromId: string, toId: string): string | null {
    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return null;

    // Check grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent && parent.parentIds.includes(toId)) {
        if (toMember.gender === 'male') {
          return 'हजुरबुवा';
        } else if (toMember.gender === 'female') {
          return 'हजुरआमा';
        } else {
          return 'हजुरआमा/हजुरबुवा';
        }
      }
    }

    // Check grandchildren
    for (const childId of fromMember.childrenIds) {
      const child = this.members.find(m => m.id === childId);
      if (child && child.childrenIds.includes(toId)) {
        if (toMember.gender === 'male') {
          return 'नाति';
        } else if (toMember.gender === 'female') {
          return 'नातिनी';
        } else {
          return 'नातिनाति';
        }
      }
    }

    // Check great-grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const grandparentId of parent.parentIds) {
          const grandparent = this.members.find(m => m.id === grandparentId);
          if (grandparent && grandparent.parentIds.includes(toId)) {
            if (toMember.gender === 'male') {
              return 'परहजुरबुवा';
            } else if (toMember.gender === 'female') {
              return 'परहजुरआमा';
            } else {
              return 'परहजुरआमा/हजुरबुवा';
            }
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
            if (toMember.gender === 'male') {
              return 'परनाति';
            } else if (toMember.gender === 'female') {
              return 'परनातिनी';
            } else {
              return 'परनाति/नातिनी';
            }
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
                const isOlder = this.isOlderSibling(toMember, parent);
                
                if (toMember.gender === 'male') {
                  if (isOlder) {
                    return 'ठुलो बुवा';  // Elder uncle
                  } else {
                    return 'कान्छो बुवा';  // Younger uncle
                  }
                } else if (toMember.gender === 'female') {
                  if (isOlder) {
                    return 'ठुली आमा';  // Elder aunt
                  } else {
                    return 'कान्छी आमा';  // Younger aunt
                  }
                } else {
                  return 'काका/काकी';
                }
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
                    if (toMember.gender === 'male') {
                      return 'ठुलुवा';
                    } else if (toMember.gender === 'female') {
                      return 'ठुली';
                    } else {
                      return 'ठुलुवा/ठुली';
                    }
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
              if (toMember.gender === 'male') {
                return 'भान्जा/भतिजो';
              } else if (toMember.gender === 'female') {
                return 'भान्जी/भतिजी';
              } else {
                return 'भतिजा/भतिजी';
              }
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
                  if (toMember.gender === 'male') {
                    return 'भतिजाको छोरा';
                  } else if (toMember.gender === 'female') {
                    return 'भतिजाको छोरी';
                  } else {
                    return 'भतिजाको सन्तान';
                  }
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
                  if (toMember.gender === 'male') {
                    return 'फुपाजु/मामा';
                  } else if (toMember.gender === 'female') {
                    return 'फुपी/मामी';
                  } else {
                    return 'चचेरे/ममेरे भाइ/बहिनी';
                  }
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
                          if (toMember.gender === 'male') {
                            return 'दोस्रो चचेरे भाइ';
                          } else if (toMember.gender === 'female') {
                            return 'दोस्रो चचेरे बहिनी';
                          } else {
                            return 'दोस्रो चचेरे भाइ/बहिनी';
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
                      if (toMember.gender === 'male') {
                        return 'फुपाजु/मामा';
                      } else if (toMember.gender === 'female') {
                        return 'फुपी/मामी';
                      } else {
                        return 'चचेरे काका/काकी';
                      }
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
                      if (toMember.gender === 'male') {
                        return 'चचेरे नाति';
                      } else if (toMember.gender === 'female') {
                        return 'चचेरे नातिनी';
                      } else {
                        return 'चचेरे नाति/नातिनी';
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

    return null;
  }
}
