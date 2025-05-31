
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FamilyMember } from '../types/FamilyTree';
import RelationshipCalculator from './RelationshipCalculator';

export const generateNodesAndEdges = (
  members: FamilyMember[],
  focusedMemberId: string | null,
  onMemberClick: (member: FamilyMember) => void
) => {
  const relationshipCalc = new RelationshipCalculator(members);
  
  const nodes: Node[] = members.map(member => {
    const relationshipLabel = focusedMemberId && focusedMemberId !== member.id
      ? relationshipCalc.getRelationship(focusedMemberId, member.id)
      : undefined;

    return {
      id: member.id,
      type: 'familyMember',
      position: member.position,
      data: {
        member,
        relationshipLabel,
        isFocused: focusedMemberId === member.id,
        onClick: onMemberClick
      },
      draggable: true
    };
  });

  const edges: Edge[] = [];

  // Create parent-child edges with curved lines
  members.forEach(member => {
    member.parentIds.forEach(parentId => {
      const parent = members.find(m => m.id === parentId);
      if (parent) {
        edges.push({
          id: `parent-${parentId}-child-${member.id}`,
          source: parentId,
          target: member.id,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
          style: { 
            stroke: '#3b82f6', 
            strokeWidth: 2,
          },
          label: 'Parent-Child',
          labelStyle: { fontSize: '12px', fontWeight: 'bold' }
        });
      }
    });

    // Create spouse edges with heart symbol and curved lines
    if (member.spouseId) {
      const spouse = members.find(m => m.id === member.spouseId);
      if (spouse && member.id < member.spouseId) { // Prevent duplicate edges
        edges.push({
          id: `spouse-${member.id}-${member.spouseId}`,
          source: member.id,
          target: member.spouseId,
          type: 'smoothstep',
          style: { 
            stroke: '#ec4899', 
            strokeWidth: 3,
            strokeDasharray: '5,5'
          },
          label: '💕',
          labelStyle: { fontSize: '16px' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#ec4899'
          }
        });
      }
    }
  });

  return { nodes, edges };
};
