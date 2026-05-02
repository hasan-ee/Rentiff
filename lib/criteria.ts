export type VerificationStatus = "verified" | "declared" | "hidden";

export type CriterionCategory =
  | "identity"
  | "financial"
  | "housing"
  | "occupation"
  | "lifestyle";

export type Criterion = {
  key: string;
  label: string;
  category: CriterionCategory;
  inputType: "text" | "number" | "toggle" | "select";
  options?: string[];
  verifiable: boolean;
  verifySource?: string;
  verifyDescription?: string;
  legallyFilterable: boolean;
  helpText?: string;
};

export const CATEGORY_LABELS: Record<CriterionCategory, string> = {
  identity: "Identity",
  financial: "Financial",
  housing: "Housing",
  occupation: "Occupation",
  lifestyle: "Lifestyle",
};

export const CATEGORY_ORDER: CriterionCategory[] = [
  "identity",
  "financial",
  "occupation",
  "housing",
  "lifestyle",
];

export const CRITERIA: Criterion[] = [
  // IDENTITY
  {
    key: "realPerson",
    label: "Identity verified",
    category: "identity",
    inputType: "toggle",
    verifiable: true,
    verifySource: "DigiD",
    legallyFilterable: true,
  },
  {
    key: "age",
    label: "Age",
    category: "identity",
    inputType: "number",
    verifiable: true,
    verifySource: "DigiD",
    legallyFilterable: false,
    helpText: "Age cannot be used as a filter under Dutch equal treatment law",
  },
  {
    key: "nationality",
    label: "Right to rent in NL",
    category: "identity",
    inputType: "toggle",
    verifiable: true,
    verifySource: "DigiD",
    legallyFilterable: true,
  },

  // FINANCIAL
  {
    key: "income",
    label: "Monthly net income",
    category: "financial",
    inputType: "number",
    verifiable: true,
    verifySource: "Tink (Open Banking)",
    legallyFilterable: true,
  },
  {
    key: "employmentContract",
    label: "Employment contract",
    category: "financial",
    inputType: "toggle",
    verifiable: true,
    verifySource: "UWV",
    legallyFilterable: true,
  },
  {
    key: "guarantor",
    label: "Has guarantor",
    category: "financial",
    inputType: "toggle",
    verifiable: true,
    verifySource: "Guarantor DigiD",
    legallyFilterable: true,
  },
  {
    key: "noBkrFlags",
    label: "No debt registrations",
    category: "financial",
    inputType: "toggle",
    verifiable: true,
    verifySource: "BKR",
    legallyFilterable: true,
  },

  // HOUSING
  {
    key: "currentAddress",
    label: "Current registered address",
    category: "housing",
    inputType: "text",
    verifiable: true,
    verifySource: "BRP / MijnOverheid",
    legallyFilterable: false,
  },
  {
    key: "previousLandlordRef",
    label: "Previous landlord reference",
    category: "housing",
    inputType: "toggle",
    verifiable: true,
    verifySource: "Platform reference",
    legallyFilterable: true,
  },
  {
    key: "reasonForMoving",
    label: "Reason for moving",
    category: "housing",
    inputType: "text",
    verifiable: false,
    legallyFilterable: false,
  },

  // OCCUPATION
  {
    key: "employed",
    label: "Employed",
    category: "occupation",
    inputType: "toggle",
    verifiable: true,
    verifySource: "UWV",
    legallyFilterable: true,
  },
  {
    key: "selfEmployed",
    label: "Self-employed (ZZP)",
    category: "occupation",
    inputType: "text",
    verifiable: true,
    verifySource: "KvK",
    legallyFilterable: true,
    helpText: "Enter KvK number",
  },
  {
    key: "studentEnrollment",
    label: "Student enrollment",
    category: "occupation",
    inputType: "text",
    verifiable: true,
    verifySource: "DUO",
    legallyFilterable: true,
    helpText: "Required for student housing only",
  },
  {
    key: "retired",
    label: "Retired",
    category: "occupation",
    inputType: "toggle",
    verifiable: true,
    verifySource: "SVB",
    legallyFilterable: true,
  },

  // LIFESTYLE
  {
    key: "smoking",
    label: "Smoking status",
    category: "lifestyle",
    inputType: "select",
    options: ["Non-smoker", "Smoker", "Outside only"],
    verifiable: true,
    verifySource: "Health insurer attestation",
    legallyFilterable: false,
    helpText: "Display-only — cannot be used as a hard filter",
  },
  {
    key: "pets",
    label: "Pets",
    category: "lifestyle",
    inputType: "select",
    options: ["None", "Cat", "Dog (chipped)", "Other"],
    verifiable: true,
    verifySource: "NDG chip registry",
    legallyFilterable: true,
    helpText: "Filterable due to property damage liability",
  },
  {
    key: "gender",
    label: "Gender",
    category: "lifestyle",
    inputType: "select",
    options: ["Female", "Male", "Non-binary", "Prefer not to say"],
    verifiable: true,
    verifySource: "BRP",
    legallyFilterable: false,
    helpText:
      "Display-only — filtering by gender is illegal under Dutch equal treatment law",
  },
  {
    key: "household",
    label: "Household composition",
    category: "lifestyle",
    inputType: "text",
    verifiable: false,
    legallyFilterable: true,
  },
  {
    key: "languages",
    label: "Languages spoken",
    category: "lifestyle",
    inputType: "text",
    verifiable: false,
    legallyFilterable: false,
  },
  {
    key: "moveInDate",
    label: "Preferred move-in date",
    category: "lifestyle",
    inputType: "text",
    verifiable: false,
    legallyFilterable: true,
  },
];

export function criterionByKey(key: string): Criterion | undefined {
  return CRITERIA.find((c) => c.key === key);
}

export function criteriaByCategory(): Record<CriterionCategory, Criterion[]> {
  const out = {
    identity: [],
    financial: [],
    housing: [],
    occupation: [],
    lifestyle: [],
  } as Record<CriterionCategory, Criterion[]>;
  for (const c of CRITERIA) out[c.category].push(c);
  return out;
}

export function formatCriterionValue(
  criterion: Criterion,
  value: unknown
): string | null {
  if (criterion.inputType === "toggle") {
    return value ? null : "Declined";
  }
  if (criterion.inputType === "number") {
    if (criterion.key === "income") {
      return `€${Number(value).toLocaleString("nl-NL")} / month`;
    }
    if (criterion.key === "age") {
      return `${value} years old`;
    }
    return String(value);
  }
  return value == null || value === "" ? "—" : String(value);
}
