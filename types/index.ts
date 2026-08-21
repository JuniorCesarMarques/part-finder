import { ReactNode } from "react";

export type PartResult = {
  part_id: string;
  partNumber: string;
  uri: string;
  score: number;
  description: string;
  supplier: string;
  family: string;
  risk: string;
};

export type HeaderConfig = {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  variant?: "default" | "selection" | "custom";
};

export interface Part {
  id: string;
  partNumber: string;
  description: string;
  supplier: string;
  family: string;
  risk: string;
}

export interface PartWithCount {
  id: string;
  partNumber: string;
  images: number;
  status: string;
  description: string;
  supplier: string;
  family: string;
  risk: string;
}

export interface PartImage {
  id: string;
  part_id: string;
  uri: string;
  created_at: string;
}

export interface PartMatch {
  partId: string;
  partName: string;
  score: number;
  imageCount: number;
}

export interface SearchResult {
  matches: PartMatch[];
  queryUri: string;
  capturedAt: string;
}

export interface ImageFingerprint {
  histogram: number[];
  grid: number[];
}

export interface Opportunity {
  rank: number;
  componentCode: string;
  description: string;
  globalConsumption: string;
  priceTrend: number;
  commercialization: number;
  verticalization: number;
}
