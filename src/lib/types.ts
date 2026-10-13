export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  summaryTh: string | null;
  description: string | null;
  descriptionTh: string | null;
  role: string | null;
  roleTh: string | null;
  tech: string[];
  highlights: string[];
  highlightsTh: string[] | null;
  repoUrl: string | null;
  liveUrl: string | null;
  year: number | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export const SKILL_CATEGORIES = ["frontend", "backend", "database", "ai", "devops"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export type SkillGroups = Record<SkillCategory, string[]>;

export type Experience = {
  id: number;
  company: string;
  title: string;
  titleTh: string | null;
  period: string;
  periodTh: string | null;
  summary: string;
  summaryTh: string | null;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
