/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Scale,
  Globe,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Gavel,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import Navbar from "./components/Navbar";
import PublicLawPortal from "./components/PublicLawPortal";
import CabinetDashboard from "./components/CabinetDashboard";
import CommunityPortal from "./components/CommunityPortal";
import { UserRole, Cabinet, CabinetMember, ClientDossier, Publication, DecisionStatus } from "./types";
// @ts-ignore
import heroBannerImg from "./assets/images/hakilab_hero_banner_1780752007513.png";

export default function App() {
  // Current user simulator state
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CHEF_CABINET);
  const [activeTab, setActiveTab] = useState<"public" | "private" | "community" | "admin">("public");

  // Hydrated full-stack state
  const [cabinet, setCabinet] = useState<Cabinet | null>(null);
  const [members, setMembers] = useState<CabinetMember[]>([]);
  const [dossiers, setDossiers] = useState<ClientDossier[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoadingState, setIsLoadingState] = useState(true);

  // Success/Info toast messages
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Fetch all state on mount and update
  const fetchBackendState = async (silent = false) => {
    if (!silent) setIsLoadingState(true);
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data = await res.json();
        setCabinet(data.cabinet);
        setMembers(data.members || []);
        setDossiers(data.dossiers || []);
        setPublications(data.publications || []);
      }
    } catch (err) {
      console.error("Error fetching state:", err);
      showToast("Erreur lors de la synchronisation de l'état souverain.", "error");
    } finally {
      if (!silent) setIsLoadingState(false);
    }
  };

  useEffect(() => {
    fetchBackendState();
  }, []);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 1. Register cabinet
  const handleRegisterCabinet = async (name: string) => {
    try {
      const res = await fetch("/api/register-cabinet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, chefName: "Me Micheline Kalehezo" })
      });
      if (res.ok) {
        showToast(`Cabinet "${name}" enregistré virtuellement avec succès !`);
        fetchBackendState(true);
      } else {
        showToast("Échec de l'enregistrement.", "error");
      }
    } catch (e) {
      showToast("Erreur serveur.", "error");
    }
  };

  // 2. Add collaborator member
  const handleAddMember = async (name: string, role: any) => {
    try {
      const res = await fetch("/api/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role })
      });
      if (res.ok) {
        showToast(`${role} inscrit avec succès dans votre intranet.`);
        fetchBackendState(true);
      }
    } catch (e) {
      showToast("Faux pas lors de l'enregistrement du collaborateur.", "error");
    }
  };

  // 3. Create a legal folder dossier
  const handleAddDossier = async (clientName: string, title: string, caseNumber: string, description: string) => {
    try {
      const res = await fetch("/api/add-dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, title, caseNumber, description })
      });
      if (res.ok) {
        showToast("Nouveau dossier client chiffré et indexé en greffe.");
        fetchBackendState(true);
      }
    } catch (e) {
      showToast("Erreur de création du dossier.", "error");
    }
  };

  // 4. Simulated Scanner OCR upload
  const handleUploadDocument = async (dossierId: string, name: string, type: string, rawContent?: string) => {
    try {
      const res = await fetch("/api/upload-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossierId, name, type, rawContent })
      });
      if (res.ok) {
        showToast(`Fichier "${name}" chiffré et analysé via OCR avec succès !`);
        fetchBackendState(true);
      }
    } catch (e) {
      showToast("Erreur de numérisation.", "error");
    }
  };

  // 5. Trigger AI Juge analysis for specific proof document in client file
  const handleAnalyzeContractAI = async (dossierId: string, docId: string) => {
    try {
      const res = await fetch("/api/analyze-dossier-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossierId, documentId: docId })
      });
      if (res.ok) {
        const data = await res.json();
        showToast("Rapport du Juge Analytique HakiLab disponible !");
        fetchBackendState(true);
        return data.conclusions;
      }
    } catch (e) {
      showToast("Erreur d'analyse par l'IA.", "error");
    }
    return null;
  };

  // 6. Change dossier's overall status
  const handleUpdateDossierStatus = async (dossierId: string, status: DecisionStatus) => {
    try {
      const res = await fetch("/api/update-dossier-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossierId, status })
      });
      if (res.ok) {
        showToast(`Statut du litige mis à jour: ${status}`);
        fetchBackendState(true);
      }
    } catch (e) {
      showToast("Échec de mise à jour.", "error");
    }
  };

  // 7. Academic publication trigger with direct AI pipeline validation backends
  const handleAddPublication = async (title: string, authorName: string, content: string) => {
    try {
      const res = await fetch("/api/add-publication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, authorName, content })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.publication.complianceState === "Validé") {
          showToast("Tribune validée par l'IA et publiée avec succès !");
        } else {
          showToast("Alerte: Cette plaidoirie contient des incohérences ou risques de plagiat !", "error");
        }
        fetchBackendState(true);
        return data.publication;
      }
    } catch (e) {
      showToast("Échec de la validation doctrinale.", "error");
    }
    return null;
  };

  // 8. Super admin Veto / Destitution
  const handleDeletePublication = async (id: string) => {
    try {
      const res = await fetch(`/api/publication-veto/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Publication destituée par décret d'État Administratif de manière irrévocable !");
        fetchBackendState(true);
      }
    } catch (e) {
      showToast("Erreur d'action de destitution.", "error");
    }
  };

  // 9. Upvote a publication
  const handleUpvotePublication = async (id: string) => {
    try {
      const res = await fetch("/api/publication-upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicationId: id })
      });
      if (res.ok) {
        fetchBackendState(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans relative">
      
      {/* Dynamic Floating Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 max-w-sm animate-bounce" id="platform-notification-toast">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 glass-panel backdrop-blur-2xl ${
            toastMessage.type === "error"
              ? "bg-red-950/80 border-red-900/50 text-red-200"
              : toastMessage.type === "info"
              ? "bg-blue-950/80 border-blue-900/50 text-blue-200"
              : "bg-emerald-950/80 border-emerald-900/50 text-emerald-100"
          }`}>
            <Info className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Alerte Système HakiLab</p>
              <p className="text-xs mt-1 leading-normal font-roboto">{toastMessage.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Global Navigation Header bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasCabinet={!!cabinet}
        cabinetName={cabinet?.name || ""}
      />

      {/* 4-IN-1 PATRIOTIC HERO SECTION BANNER AS REQUESTED - Shown ONLY on Home page activeTab === 'public' */}
      {activeTab === "public" && (
        <header className="relative w-full py-16 md:py-24 px-6 md:px-12 overflow-hidden border-b border-white/10 glass-panel shadow-2xl" id="hakilab-hero-banner">
          {/* Repeating diagonal grid background overlay from Design HTML */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none" style={{ background: "repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 10px)" }}></div>
          
          {/* Decorative backdrop elements for Congo theme */}
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center transition-opacity duration-500" style={{ backgroundImage: `url(${heroBannerImg})` }}></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600"></div>

          {/* Dynamic Abstract patriotic lighting glow coordinates */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl players-events-none"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl players-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Hero text metadata */}
            <div className="md:col-span-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-amber-500"></div>
                <span className="text-[10px] uppercase font-roboto tracking-[0.3em] text-amber-500">
                  Système Judiciaire Congolais
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-sans">
                Le Tribunal de l'Équité <br className="hidden md:block"/>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-blue-400 text-transparent bg-clip-text">
                  Révolutionne la Justice en RDC
                </span>
              </h1>

              <p className="text-slate-300 text-xs md:text-sm mt-4 font-roboto font-light leading-relaxed max-w-2xl">
                HakiLab fusionne l'héritage légal de la République Démocratique du Congo avec la rigueur d'un Juge Virtuel d'Analyse. Numérisez vos pièces de défense, interrogez notre corpus de lois à accès libre, et débusquez instantanément les plagiats d'orientation juridique.
              </p>

              {/* Quick stats elements */}
              <div className="flex flex-wrap items-center gap-6 mt-8 border-t border-slate-900 pt-6">
                <div className="flex items-center gap-2">
                  <Gavel className="h-4.5 w-4.5 text-amber-500" />
                  <span className="text-xs text-slate-400 font-mono">
                    Ancrage: <span className="text-white font-bold">Art. 12 Constitution & Art. 258 CCCIII</span>
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-slate-850"></div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4.5 w-4.5 text-blue-400" />
                  <span className="text-xs text-slate-400 font-mono">
                    Cabinet Accrédité: <span className="text-white font-bold">{cabinet ? "Oui (Active)" : "Non"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Showcase Box representing the 4 merged patriotic & judicial elements */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-slate-950/95 flex flex-col items-center justify-center p-6 group">
                {/* Visual generated background overlay */}
                <img
                  src={heroBannerImg}
                  alt="HakiLab Hero Emblem"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback layout representing flag, robe, armoiries, marteau gracefully in beautiful vectors if missing
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Inner Patriotic / judicial graphics frame */}
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 backdrop-blur-sm p-4 border-t border-slate-850 text-center flex flex-col gap-1 z-10 w-full">
                  <span className="text-xs font-bold text-white font-sans">EMBLÈME NATIONAL DE SÉCURITÉ</span>
                  <span className="text-[9px] text-slate-450 font-mono uppercase">Justice • Paix • Travail • RDC</span>
                </div>
              </div>
            </div>

          </div>
        </header>
      )}

      {/* Primary Application workspaces router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10">
        {isLoadingState ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4" id="platform-loading-block">
            <Gavel className="h-12 w-12 text-amber-500 animate-spin" />
            <p className="text-sm font-mono text-slate-500 uppercase">Synchronisation de l'état souverain de HakiLab...</p>
          </div>
        ) : (
          <div>
            {/* TAB RENDERER */}
            {activeTab === "public" && (
              <PublicLawPortal
                registeredCabinets={cabinet ? [cabinet] : []}
                onConsultCabinet={(id) => {
                  setActiveTab("private");
                  showToast("Sélection du Cabinet pour votre consultation confidentielle.");
                }}
              />
            )}

            {activeTab === "private" && (
              <CabinetDashboard
                currentRole={currentRole}
                cabinet={cabinet}
                members={members}
                dossiers={dossiers}
                onRegisterCabinet={handleRegisterCabinet}
                onAddMember={handleAddMember}
                onAddDossier={handleAddDossier}
                onUploadDocument={handleUploadDocument}
                onAnalyzeContractAI={handleAnalyzeContractAI}
                onUpdateDossierStatus={handleUpdateDossierStatus}
              />
            )}

            {activeTab === "community" && (
              <CommunityPortal
                currentRole={currentRole}
                publications={publications}
                onAddPublication={handleAddPublication}
                onDeletePublication={handleDeletePublication}
                onUpvotePublication={handleUpvotePublication}
              />
            )}

            {activeTab === "admin" && (
              <div className="max-w-2xl mx-auto bg-slate-900/30 p-8 rounded-3xl border border-slate-800 text-center flex flex-col gap-6" id="super-admin-panel">
                <div className="bg-red-500/10 text-red-500 p-4 rounded-full w-fit mx-auto border border-red-500/20">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">HakiLab Tribunal - Super Administrateur</h2>
                  <p className="text-xs text-slate-400 mt-1 font-roboto font-light leading-relaxed">
                    Espace d'État de Droit Réservé au Greffier en Chef de la Cour Constitutionnelle. Permet d'exercer le veto administratif et purger les données.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-mono block">STATUT DE L'INFRASTRUCTURE</span>
                    <span className="text-sm font-semibold text-emerald-400 mt-1 block">● Base Active Souveraine</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-[9px] text-slate-500 font-mono block">LOGS AUDIT</span>
                    <span className="text-xs text-slate-350 mt-1 block">Chiffrement AES-256 actif sur l'ensemble de Kinshasa</span>
                  </div>
                </div>

                <div className="text-xs p-4 bg-red-950/10 border border-red-900/20 rounded-xl text-slate-400 text-left">
                  🛡️ <span className="font-semibold text-slate-300">Pouvoirs de Veto:</span> Pour destituer une plaidoirie doctrinale, rendez-vous sous l'onglet <span className="text-white font-semibold">Forum Doctrinal</span>. En tant que Super-Administrateur, un bouton rouge de destitution administrative apparaîtra sur chaque article publié.
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Platform Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 px-6 text-center mt-12 gap-2 flex flex-col">
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          © {new Date().getFullYear()} HakiLab RDC — SYSTEME D'INTELLIGENCE APPLIQUEE AUX JURIDICTIONS DE LA REPUBLIQUE
        </p>
        <p className="text-[10px] text-slate-600 font-roboto">
          Tous droits réservés. L'usage de l'intelligence artificielle sur HakiLab est certifiée conforme par le Conseil Supérieur de la Magistrature comme assistant d'aide à la décision.
        </p>
      </footer>
    </div>
  );
}
