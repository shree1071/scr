import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface MetricCardProps {
  title: string;
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
}

export interface StepProps {
  number: string;
  title: string;
  description: string;
}

// --- App State Types ---
export type AppView = 'landing' | 'onboarding' | 'dashboard';
export type DashboardView = 'checkin' | 'tribe' | 'analytics' | 'rankings' | 'tools' | 'settings';

export interface Company {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
}

// --- Ranking Types ---
export interface CompanyRanking {
  id: string;
  rank: number;
  name: string;
  logo: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  tags: string[];
  categoryScores: {
    culture: number;
    compensation: number;
    leadership: number;
  };
}

// --- Chat/AI Types ---
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tags?: string[]; // Extracted by AI
}

// --- Community Types ---
export interface Post {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  hasImage?: boolean;
  imageUrl?: string;
  isPoll?: boolean;
  pollData?: {
    question: string;
    options: { label: string; votes: number }[];
    totalVotes: number;
  };
}

// --- Insight Types ---
export interface InsightMetric {
  key: string;
  label: string;
  score: number; // 0-100
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
}