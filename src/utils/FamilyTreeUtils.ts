
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

  // Create parent-child edges
  members.forEach(member => {
    member.parentIds.forEach(parentId => {
      const parent = members.find(m => m.id === parentId);
      if (parent) {
        edges.push({
          id: `parent-${parentId}-child-${member.id}`,
          source: parentId,
          target: member.id,
          type: 'straight',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          label: 'Parent-Child'
        });
      }
    });

    // Create spouse edges
    if (member.spouseId) {
      const spouse = members.find(m => m.id === member.spouseId);
      if (spouse && member.id < member.spouseId) { // Prevent duplicate edges
        edges.push({
          id: `spouse-${member.id}-${member.spouseId}`,
          source: member.id,
          target: member.spouseId,
          type: 'straight',
          style: { stroke: '#ec4899', strokeWidth: 3 },
          label: '❤️',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          }
        });
      }
    }
  });

  return { nodes, edges };
};
