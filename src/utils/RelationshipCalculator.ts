
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
    if (fromMember.spouseId === toId) 
    {
      //return 'Spouse';
      const result = this.members.find(m => m.id === toId);
      if (result?.biography) {
        if (result.biography.startsWith('M-')) {
          return 'लोग्ने';
        } else if (result.biography.startsWith('F-')) {
          return 'पत्नी';
        }
        else{
          return 'पति/पत्नी';
        }
      }
    }
    
    if (fromMember.parentIds.includes(toId)) {
      const parent = this.members.find(m => m.id === toId);
      // Could be more specific like Father/Mother if we had gender data
      if (parent?.biography) {
        if (parent.biography.startsWith('M-')) {
          return 'बुबा';
        } else if (parent.biography.startsWith('F-')) {
          return 'आमा';
        }
        else{
          return 'अभिभावक';
        }
      }
    }
    if (fromMember.childrenIds.includes(toId)) {
      const child = this.members.find(m => m.id === toId);
      // Could be more specific like Son/Daughter if we had gender data
      if (child?.biography) {
        if (child.biography.startsWith('M-')) {
          return 'छोरा';
        } else if (child.biography.startsWith('F-')) {
          return 'छोरी';
        }
        else{
          return 'सन्तान';
        }
      }
      
    }

    // Check siblings
    const sharedParents = fromMember.parentIds.filter(parentId => 
      toMember.parentIds.includes(parentId)
    );
    if (sharedParents.length > 0) {
      if (sharedParents.length === fromMember.parentIds.length && 
          sharedParents.length === toMember.parentIds.length) {
       // return 'Sibling';
       const Sibling = this.members.find(m => m.id === toId);
       if (Sibling?.biography) {
        if (Sibling.biography.startsWith('M-')) {
          return 'भाइ';
        } else if (Sibling.biography.startsWith('F-')) {
          return 'बहिनी';
        }
        else{
          return 'भाइबहिनी';
        }
      }
      } else {
        //return 'Half-sibling';
        const Halfsibling = this.members.find(m => m.id === toId);
        if (Halfsibling?.biography) {
          if (Halfsibling.biography.startsWith('M-')) {
            return 'अर्ध भाइ';
          } else if (Halfsibling.biography.startsWith('F-')) {
            return 'अर्ध बहिनी';
          }
          else{
            return 'अर्ध भाइ/बहिनी';
          }
        }
      }
    }

    // Check in-laws through spouse
    if (fromMember.spouseId) {
      const spouse = this.members.find(m => m.id === fromMember.spouseId);
      if (spouse) {
        if (spouse.parentIds.includes(toId)) 
        {
          //return 'Parent-in-law';
          const Parentinlaw = this.members.find(m => m.id === toId);
          if (Parentinlaw?.biography) {
            if (Parentinlaw.biography.startsWith('M-')) {
              return 'ससुरा';
            } else if (Parentinlaw.biography.startsWith('F-')) {
              return 'सासु';
            }
            else{
              return 'ससुरा/सासु';
            }
          }

        }
        
        if (spouse.childrenIds.includes(toId))
        {
          //return 'Child-in-law';
          const Childinlaw = this.members.find(m => m.id === toId);
          if (Childinlaw?.biography) {
            if (Childinlaw.biography.startsWith('M-')) {
              return 'ज्वाइँ';
            } else if (Childinlaw.biography.startsWith('F-')) {
              return 'बुहारी';
            }
            else{
              return 'ज्वाइँ/बुहारी';
            }
          }
        }
      
        
        // Check spouse's siblings
        const spouseSharedParents = spouse.parentIds.filter(parentId => 
          toMember.parentIds.includes(parentId)
        );
        if (spouseSharedParents.length > 0) 
        {
          //return 'Sibling-in-law';
          const Siblinginlaw = this.members.find(m => m.id === toId);
          if (Siblinginlaw?.biography) {
            if (Siblinginlaw.biography.startsWith('M-')) {
              return 'देवर';
            } else if (Siblinginlaw.biography.startsWith('F-')) {
              return 'भाउजू';
            }
            else{
              return 'देवर/भाउजू';
            }
          }
        }
        
      }
    }

    // Check extended family
    const relationship = this.calculateExtendedRelationship(fromId, toId);
    return relationship || 'परिवारका सदस्य';
  }

  private calculateExtendedRelationship(fromId: string, toId: string): string | null {
    const fromMember = this.members.find(m => m.id === fromId);
    const toMember = this.members.find(m => m.id === toId);

    if (!fromMember || !toMember) return null;

    // Check grandparents
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent && parent.parentIds.includes(toId)) {
        //return 'Grandparent';
        const Grandparent = this.members.find(m => m.id === toId);
        if (Grandparent?.biography) {
          if (Grandparent.biography.startsWith('M-')) {
            return 'बाजे';
          } else if (Grandparent.biography.startsWith('F-')) {
            return 'बज्यै';
          }
          else{
            return 'हजुरआमा/बुबा';
          }
        }
      }
    }

    // Check grandchildren
    for (const childId of fromMember.childrenIds) {
      const child = this.members.find(m => m.id === childId);
      if (child && child.childrenIds.includes(toId)) {
        //return 'Grandchild';
        const Grandchild = this.members.find(m => m.id === toId);
        if (Grandchild?.biography) {
          if (Grandchild.biography.startsWith('M-')) {
            return 'नाति';
          } else if (Grandchild.biography.startsWith('F-')) {
            return 'नातिनी';
          }
          else{
            return 'नातिनाति';
          }
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
            //return 'Great-grandparent';
            const Greatgrandparent = this.members.find(m => m.id === toId);
            if (Greatgrandparent?.biography) {
              if (Greatgrandparent.biography.startsWith('M-')) {
                return 'परबाजे';
              } else if (Greatgrandparent.biography.startsWith('F-')) {
                return 'परबज्यै';
              }
              else{
                return 'परबाजे/बज्यै';
              }
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
            //return 'Great-grandchild';
            const Greatgrandchild = this.members.find(m => m.id === toId);
            if (Greatgrandchild?.biography) {
              if (Greatgrandchild.biography.startsWith('M-')) {
                return 'परनाति';
              } else if (Greatgrandchild.biography.startsWith('F-')) {
                return 'परनातिनी';
              }
              else{
                return 'परनाति/नातिनी';
              }
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
                //return 'Aunt/Uncle';
                const Aunt = this.members.find(m => m.id === toId);
                if (Aunt?.biography) {
                  if (Aunt.biography.startsWith('M-')) {
                    return 'काका';
                  } else if (Aunt.biography.startsWith('F-')) {
                    return 'काकी';
                  }
                  else{
                    return 'काका/काकी';
                  }
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
                    //return 'Great-aunt/Great-uncle';
                    const Greataunt = this.members.find(m => m.id === toId);
                    if (Greataunt?.biography) {
                      if (Greataunt.biography.startsWith('M-')) {
                        return 'बुबाका काका';
                      } else if (Greataunt.biography.startsWith('F-')) {
                        return 'बुबाकी काकी';
                      }
                      else{
                        return 'बुबाका काका/काकी';
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

    // Check nieces/nephews (sibling's children)
    for (const parentId of fromMember.parentIds) {
      const parent = this.members.find(m => m.id === parentId);
      if (parent) {
        for (const siblingId of parent.childrenIds) {
          if (siblingId !== fromId) {
            const sibling = this.members.find(m => m.id === siblingId);
            if (sibling && sibling.childrenIds.includes(toId)) {
              //return 'Niece/Nephew';
              const Niece = this.members.find(m => m.id === toId);
              if (Niece?.biography) {
                if (Niece.biography.startsWith('M-')) {
                  return 'भतिजो';
                } else if (Niece.biography.startsWith('F-')) {
                  return 'भतिजी';
                }
                else{
                  return 'भतिजा/भतिजी';
                }
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
                  //return 'Grand-niece/Grand-nephew';
                  const Grandniece = this.members.find(m => m.id === toId);
                  if (Grandniece?.biography) {
                    if (Grandniece.biography.startsWith('M-')) {
                      return 'भतिजाको छोरा';
                    } else if (Grandniece.biography.startsWith('F-')) {
                      return 'भतिजाको छोरी';
                    }
                    else{
                      return 'भतिजाको सन्तान';
                    }
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
                  //return 'First cousin';
                  const Firstcousin = this.members.find(m => m.id === toId);
                  if (Firstcousin?.biography) {
                    if (Firstcousin.biography.startsWith('M-')) {
                      return 'चोचे भाइ';
                    } else if (Firstcousin.biography.startsWith('F-')) {
                      return 'चोचे बहिनी';
                    }
                    else{
                      return 'चोचे भाइ/बहिनी';
                    }
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
                          //return 'Second cousin';
                          const Secondcousin = this.members.find(m => m.id === toId);
                          if (Secondcousin?.biography) {
                            if (Secondcousin.biography.startsWith('M-')) {
                              return 'दोस्रो चोचे भाइ';
                            } else if (Secondcousin.biography.startsWith('F-')) {
                              return 'दोस्रो चोचे बहिनी';
                            }
                            else{
                              return 'दोस्रो चोचे भाइ/बहिनी';
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
                      //return 'First cousin once removed';
                      const Firstcousinonce = this.members.find(m => m.id === toId);
                      if (Firstcousinonce?.biography) {
                        if (Firstcousinonce.biography.startsWith('M-')) {
                          return 'चोचे नाति';
                        } else if (Firstcousinonce.biography.startsWith('F-')) {
                          return 'चोचे नातिनी';
                        }
                        else{
                          return 'चोचे नाति/नातिनी';
                        }
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
                      //return 'First cousin once removed';
                      const resultCousin = this.members.find(m => m.id === toId);
                      if (resultCousin?.biography) {
                        if (resultCousin.biography.startsWith('M-')) {
                          return 'चोचे नाति';
                        } else if (resultCousin.biography.startsWith('F-')) {
                          return 'चोचे नातिनी';
                        }
                        else{
                          return 'चोचे नाति/नातिनी';
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

    return null;
  }
}
