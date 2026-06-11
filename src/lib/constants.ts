import type { EventCertType, MembershipCertType } from "@prisma/client";

export const EVENT_CERT_LABELS: Record<EventCertType, string> = {
  PARTICIPATION: "Certificate of Participation",
  APPEARANCE: "Certificate of Appearance",
  RECOGNITION: "Certificate of Recognition",
  PRESENTATION: "Certificate of Presentation (Research Conference)",
};

export const MEMBERSHIP_CERT_LABELS: Record<MembershipCertType, string> = {
  INSTITUTIONAL_COMPANY: "Institutional Membership — Company",
  INSTITUTIONAL_UNIVERSITY: "Institutional Membership — University",
  LIFETIME: "Lifetime Membership",
  INDIVIDUAL_PROFESSIONAL: "Individual Membership — Professional",
  INDIVIDUAL_STUDENT: "Individual Membership — Student",
  MECHATRONICS_ENGINEER: "Certified Mechatronics & Automation — Engineer",
  MECHATRONICS_SPECIALIST: "Certified Mechatronics & Automation — Specialist",
  MECHATRONICS_TECHNICIAN: "Certified Mechatronics & Automation — Technician",
};

export const MEMBERSHIP_DURATION_YEARS: Partial<Record<MembershipCertType, number | null>> = {
  INSTITUTIONAL_COMPANY: 1,
  INSTITUTIONAL_UNIVERSITY: 1,
  LIFETIME: null,
  INDIVIDUAL_PROFESSIONAL: 1,
  INDIVIDUAL_STUDENT: 1,
  MECHATRONICS_ENGINEER: 2,
  MECHATRONICS_SPECIALIST: 2,
  MECHATRONICS_TECHNICIAN: 2,
};

export const DEFAULT_MEMBERSHIP_FEES: Partial<Record<MembershipCertType, number>> = {
  INSTITUTIONAL_COMPANY: 15000,
  INSTITUTIONAL_UNIVERSITY: 12000,
  LIFETIME: 25000,
  INDIVIDUAL_PROFESSIONAL: 2500,
  INDIVIDUAL_STUDENT: 1000,
  MECHATRONICS_ENGINEER: 5000,
  MECHATRONICS_SPECIALIST: 4000,
  MECHATRONICS_TECHNICIAN: 3000,
};
