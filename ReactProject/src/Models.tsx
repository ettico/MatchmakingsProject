// טיפוסי נתונים למועמדים
export type Male = {
  id: number
  country: string
  city: string
  address: string
  tz: string
  class: string
  anOutsider: boolean
  backGround: string
  openness: string
  burnDate: string
  age: number
  token: string
  healthCondition: boolean
  status: string
  statusVacant: boolean
  pairingType: string
  height: number
  generalAppearance: string
  facePaint: string
  appearance: string
  phone: string
  email: string
  fatherPhone: string
  motherPhone: string
  moreInformation: string
  driversLicense: boolean
  smoker: boolean
  beard: string
  hot: string
  suit: string
  smallYeshiva: string
  bigYeshiva: string
  kibbutz: string
  occupation: string
  expectationsFromPartner: string
  club: string
  ageFrom: number
  ageTo: number
  importantTraitsInMe: string
  importantTraitsIAmLookingFor: string
  preferredSeminarStyle: string
  preferredProfessionalPath: string
  headCovering: string
  firstName: string
  lastName: string
  username: string
  password: string
  role: string
}

export type Women = {
  id: number
  country: string
  city: string
  address: string
  tz: string
  class: string
  anOutsider: boolean
  backGround: string
  openness: string
  burnDate: string
  age: number
  healthCondition: boolean
  status: string
  statusVacant: boolean
  pairingType: string
  height: number
  token: string
  generalAppearance: string
  facePaint: string
  appearance: string
  phone: string
  email: string
  fatherPhone: string
  motherPhone: string
  moreInformation: string
  headCovering: string
  highSchool: string
  seminar: string
  studyPath: string
  additionalEducationalInstitution: string
  currentOccupation: string
  club: string
  ageFrom: number
  ageTo: number
  importantTraitsInMe: string
  importantTraitsIMLookingFor: string
  preferredSittingStyle: string
  interestedInBoy: string
  drivingLicense: string
  smoker: boolean
  beard: string
  hat: string
  suit: string
  occupation: string
  firstName: string
  lastName: string
  username: string
  password: string
  role: string
}

export type FamilyDetails = {
  id: number
  fatherName: string
  fatherOrigin: string
  fatherYeshiva: string
  fatherAffiliation: string
  fatherOccupation: string
  motherName: string
  motherOrigin: string
  motherGraduateSeminar: string
  motherPreviousName: string
  motherOccupation: string
  parentsStatus: boolean
  healthStatus: boolean
  familyRabbi: string
  familyAbout: string
  maleId: number
  womenId: number
}

export type Contact = {
  id: number
  name: string
  phone: string
  maleId: number
  womenId: number
  matchMakerId: number
}

export type MatchMaker = {
  id: number
  firstName: string
  lastName: string
  username: string
  password: string
  role: string
  matchmakerName: string
  idNumber: string
  birthDate: string
  email: string
  gender: string
  city: string
  address: string
  mobilePhone: string
  landlinePhone: string
  phoneType: string
  personalClub: string
  community: string
  occupation: string
  previousWorkplaces: string
  isSeminarGraduate: boolean
  hasChildrenInShidduchim: boolean
  experienceInShidduchim: string
  lifeSkills: string
  yearsInShidduchim: number
  isInternalMatchmaker: boolean
  printingNotes: string
}

// מודל להערות שדכנית
export type Note = {
  id: number
  matchMakerId: number
  userId: number
  content: string
  createdAt: string
//   updatedAt?: string
}


export type Match ={
  userId: number
  fullName: string
  score: number
  warnings: string[]
}
// עדכון הטיפוס Candidate כדי לתקן את בעיית החיפוש
export type Candidate = (Male | Women) & {
  role: "Male" | "Women" // שינוי מ-"Women" ל-"female" לאחידות
}