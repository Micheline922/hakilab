/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CHEF_CABINET = "Chef de Cabinet",
  AVOCAT = "Avocat",
  CLERC = "Clerc",
  SECRETAIRE = "Secrétaire",
  CONTRIBUTEUR = "Contributeur (Docteur / Chercheur)",
  SUPER_ADMIN = "Super-Administrateur",
  CITOYEN = "Citoyen"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cabinetId?: string; // Optional reference to their cabinet
}

export interface Cabinet {
  id: string;
  name: string;
  chefId: string;
  chefName: string;
  createdAt: string;
}

export interface CabinetMember {
  id: string;
  cabinetId: string;
  name: string;
  role: UserRole.CHEF_CABINET | UserRole.AVOCAT | UserRole.CLERC | UserRole.SECRETAIRE;
  joinedAt: string;
}

export type DecisionStatus = "En cours" | "Suspendu" | "Plaidé" | "Gagné" | "Perdu";

export interface Document {
  id: string;
  name: string;
  type: "Preuve" | "Plainte" | "Mémoire" | "Arrêté" | "Jurisprudence" | "Autre";
  content: string; // OCR Extracted Text
  ocrConfidence: number; // Percentage e.g. 98
  analyzedByAI: boolean;
  aiConclusions?: {
    verdictPreview: string; // Probable judicial outcome
    strengths: string[]; // Legal strong points
    weaknesses: string[]; // Legal weak points
    citationsArticles: string[]; // Cited articles of DRC laws
    recommendations: string; // Recommendations for the lawyer
    confidence: number; // Confidence level of the analysis
  };
  createdAt: string;
  encrypted: boolean;
}

export interface ClientDossier {
  id: string;
  cabinetId: string;
  clientName: string;
  caseNumber: string;
  title: string;
  description: string;
  status: DecisionStatus;
  documents: Document[];
  createdAt: string;
}

export type LawCategory = "Livre" | "Article" | "Arrêté" | "Doctrine" | "Jurisprudence" | "Coutume" | "Usage";

export interface LawItem {
  id: string;
  title: string;
  category: LawCategory;
  source: string; // e.g. "Constitution, Art 15", "Code Civil CCCIII, Art 110"
  excerpt: string; // The text of the law
  context?: string; // Congolese specific judicial context
}

export interface Publication {
  id: string;
  title: string;
  authorName: string;
  authorTitle: string; // e.g. "Docteur en Droit Constitutionnel - UNILU"
  category: LawCategory;
  content: string;
  status: "En attente" | "Validé" | "Rejeté";
  plagiarismScore: number;
  upvotes: number;
  aiFeedback?: {
    isValidLaw: boolean;
    conformanceNotes: string;
    suggestions: string;
  };
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  createdAt: string;
}
