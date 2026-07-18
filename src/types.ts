export enum MembershipTier {
  ANNUAL = 'Annual',
  LIFE = 'Life Member',
  PATRON = 'Patron',
  STUDENT = 'Student Alumnus'
}

export enum MembershipStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  PENDING_RENEWAL = 'Pending Renewal',
  NOT_MEMBER = 'Non-Member'
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  batchYear: number;
  phone?: string;
  occupation?: string;
  location?: string;
  membershipStatus: MembershipStatus;
  membershipTier: MembershipTier;
  membershipExpiry?: string;
  rollNumber?: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderBatch: number;
  text: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface RenewalSubmission {
  id: string;
  email: string;
  tier: MembershipTier;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  billingAddress: string;
}

export interface AlumniDirectoryEntry {
  id: string;
  name: string;
  batchYear: number;
  occupation: string;
  location: string;
  membershipTier: MembershipTier;
  avatarUrl?: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'Reunion' | 'Meeting' | 'Seminar' | 'Social Work';
  rsvps: string[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  tag: 'Cultural Events' | 'Sports & Athletics' | 'School Heritage' | 'Alumni Gathering';
  uploadedBy: {
    name: string;
    email: string;
    batchYear: number;
  };
  uploadedAt: string;
  likes: string[]; // array of user emails
  comments: {
    id: string;
    authorName: string;
    authorEmail: string;
    authorBatch: number;
    text: string;
    timestamp: string;
  }[];
}


