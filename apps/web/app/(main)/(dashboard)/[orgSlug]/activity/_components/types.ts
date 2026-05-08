import {
  Building2,
  ShieldCheck,
  UserCheck,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";

export interface LogMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface ActivityLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: string;
  member: LogMember;
}

export const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  MEMBER_INVITED: { label: "Invited member", icon: UserPlus },
  MEMBER_REMOVED: { label: "Removed member", icon: UserMinus },
  MEMBER_ROLE_UPDATED: { label: "Changed role", icon: ShieldCheck },
  INVITATION_ACCEPTED: { label: "Accepted invite", icon: UserCheck },
  INVITATION_CANCELLED: { label: "Cancelled invite", icon: X },
  ORG_CREATED: { label: "Created org", icon: Building2 },
};
