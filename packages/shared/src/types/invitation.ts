export interface Invitation {
  invitationId: string;
  code: string;
  email: string;
  from: {
    userId: string;
    name: string;
    email: string;
  };
  status: 'PENDING' | 'CLAIMED' | 'EXPIRED';
  expiresAt: number; // Unix timestamp for TTL
  createdAt: string;
  updatedAt: string;
  claimedAt?: string;
}

export interface InvitationCreateInput {
  email: string;
  from: {
    userId: string;
    name: string;
    email: string;
  };
}

export interface InvitationUpdateInput
  extends Partial<Omit<Invitation, 'invitationId' | 'code' | 'from' | 'createdAt'>> {
  // Allow updating status, expiresAt, updatedAt, and claimedAt
  // code and from are immutable after creation
}
