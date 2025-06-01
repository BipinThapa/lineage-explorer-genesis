
export interface RelationshipMember {
  id: string;
  gender?: string;
  parentIds: string[];
  childrenIds: string[];
  spouseId?: string;
  birthDate?: string;
}

export const NEPALI_RELATIONSHIPS = {
  SELF: 'आफै',
  UNKNOWN: 'अज्ञात',
  FAMILY_MEMBER: 'परिवारका सदस्य',
  
  // Spouse
  HUSBAND: 'लोग्ने',
  WIFE: 'पत्नी',
  SPOUSE: 'पति/पत्नी',
  
  // Parents
  FATHER: 'बुबा',
  MOTHER: 'आमा',
  PARENT: 'अभिभावक',
  
  // Children
  SON: 'छोरा',
  DAUGHTER: 'छोरी',
  CHILD: 'सन्तान',
  
  // Siblings
  BROTHER: 'भाइ',
  SISTER: 'बहिनी',
  SIBLING: 'भाइबहिनी',
  ELDER_BROTHER: 'दाजु',
  ELDER_SISTER: 'दिदी',
  HALF_BROTHER: 'सौतेनी भाइ',
  HALF_SISTER: 'सौतेनी बहिनी',
  HALF_SIBLING: 'सौतेनी भाइ/बहिनी',
  
  // In-laws
  FATHER_IN_LAW: 'ससुरा',
  MOTHER_IN_LAW: 'सासू',
  PARENT_IN_LAW: 'ससुरा/सासू',
  SON_IN_LAW: 'ज्वाइँ',
  DAUGHTER_IN_LAW: 'बुहारी',
  CHILD_IN_LAW: 'ज्वाइँ/बुहारी',
  
  // Grandparents
  GRANDFATHER: 'हजुरबुवा',
  GRANDMOTHER: 'हजुरआमा',
  GRANDPARENT: 'हजुरआमा/हजुरबुवा',
  
  // Grandchildren
  GRANDSON: 'नाति',
  GRANDDAUGHTER: 'नातिनी',
  GRANDCHILD: 'नातिनाति',
  
  // Aunts/Uncles
  ELDER_UNCLE: 'ठुलो बुवा',
  YOUNGER_UNCLE: 'कान्छो बुवा',
  ELDER_AUNT: 'ठुली आमा',
  YOUNGER_AUNT: 'कान्छी आमा',
  UNCLE_AUNT: 'काका/काकी',
  
  // Cousins
  COUSIN_BROTHER: 'फुपाजु/मामा',
  COUSIN_SISTER: 'फुपी/मामी',
  COUSIN_SIBLING: 'चचेरे/ममेरे भाइ/बहिनी',
  
  // Extended family
  GREAT_GRANDFATHER: 'परहजुरबुवा',
  GREAT_GRANDMOTHER: 'परहजुरआमा',
  GREAT_GRANDPARENT: 'परहजुरआमा/हजुरबुवा',
  GREAT_GRANDSON: 'परनाति',
  GREAT_GRANDDAUGHTER: 'परनातिनी',
  GREAT_GRANDCHILD: 'परनाति/नातिनी',
  
  // Nieces/Nephews
  NEPHEW: 'भान्जा/भतिजो',
  NIECE: 'भान्जी/भतिजी',
  NEPHEW_NIECE: 'भतिजा/भतिजी',
  
  // Second generation
  SECOND_COUSIN_BROTHER: 'दोस्रो चचेरे भाइ',
  SECOND_COUSIN_SISTER: 'दोस्रो चचेरे बहिनी',
  SECOND_COUSIN_SIBLING: 'दोस्रो चचेरे भाइ/बहिनी',
  
  // First cousin once removed
  COUSIN_UNCLE: 'चचेरे काका/काकी',
  COUSIN_GRANDCHILD: 'चचेरे नाति/नातिनी',
  COUSIN_GRANDSON: 'चचेरे नाति',
  COUSIN_GRANDDAUGHTER: 'चचेरे नातिनी',
  
  // Great relatives
  GREAT_UNCLE: 'ठुलुवा',
  GREAT_AUNT: 'ठुली',
  GREAT_UNCLE_AUNT: 'ठुलुवा/ठुली',
  
  // Nephew's children
  NEPHEW_SON: 'भतिजाको छोरा',
  NEPHEW_DAUGHTER: 'भतिजाको छोरी',
  NEPHEW_CHILD: 'भतिजाको सन्तान'
} as const;
