/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Briefcase,
  Users,
  ShieldAlert,
  Search,
  Plus,
  FolderOpen,
  FileText,
  Lock,
  Cpu,
  CheckCircle,
  TrendingUp,
  Sliders,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Database,
  Trash2,
  Calendar
} from "lucide-react";
import { UserRole, Cabinet, CabinetMember, ClientDossier, Document, DecisionStatus } from "../types";

interface CabinetDashboardProps {
  currentRole: UserRole;
  cabinet: Cabinet | null;
  members: CabinetMember[];
  dossiers: ClientDossier[];
  onRegisterCabinet: (name: string) => void;
  onAddMember: (name: string, role: any) => void;
  onAddDossier: (clientName: string, title: string, caseNumber: string, description: string) => void;
  onUploadDocument: (dossierId: string, name: string, type: string, rawContent?: string) => void;
  onAnalyzeContractAI: (dossierId: string, docId: string) => Promise<any>;
  onUpdateDossierStatus: (dossierId: string, status: DecisionStatus) => void;
}

export default function CabinetDashboard({
  currentRole,
  cabinet,
  members,
  dossiers,
  onRegisterCabinet,
  onAddMember,
  onAddDossier,
  onUploadDocument,
  onAnalyzeContractAI,
  onUpdateDossierStatus
}: CabinetDashboardProps) {
  // Navigation / views state
  const [activeSubTab, setActiveSubTab] = useState<"dossiers" | "members">("dossiers");
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);

  // Search State - Search across case title, client, OR scanned document paragraphs !
  const [keywordQuery, setKeywordQuery] = useState("");

  // Creation Modals
  const [showCabinetModal, setShowCabinetModal] = useState(false);
  const [newCabinetName, setNewCabinetName] = useState("");

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Avocat");

  const [showDossierModal, setShowDossierModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newCaseNumber, setNewCaseNumber] = useState("");
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseDesc, setNewCaseDesc] = useState("");

  // Scanner Simulator State
  const [showScanModal, setShowScanModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("Preuve");
  const [predefinedDocTemplate, setPredefinedDocTemplate] = useState("custom");
  const [customDocText, setCustomDocText] = useState("");

  const [isAnalyzingId, setIsAnalyzingId] = useState<string | null>(null);

  // RBAC Access Control evaluation
  const isAuthorizedToCabinet = currentRole !== UserRole.CITOYEN && currentRole !== UserRole.CONTRIBUTEUR;
  const isChef = currentRole === UserRole.CHEF_CABINET || currentRole === UserRole.SUPER_ADMIN;
  const isLawyerClass = isChef || currentRole === UserRole.AVOCAT;
  const canEditState = isLawyerClass || currentRole === UserRole.CLERC;

  // Predefined Document templates for French Congo case simulation
  const docTemplates = [
    {
      id: "litige-foncier",
      name: "RECONNAISSANCE DE DETTE IMMOBILIÈRE ET PROMESSE DE VENTE",
      type: "Preuve",
      text: `ACTE SOUS SEING PRIVÉ - VILLE DE KINSHASA\nJe soussigné, M. Albert Kabamba, reconnais avoir vendu ma parcelle de 200 m2 située au n° 14 de l'Avenue de la Justice, Commune de la Gombe, à la Société SOMIKI représentée par Me Micheline. En l'échange de la somme de 75 000 USD intégralement réglée en liquide ce jour 15 mars 1994, je m'engage à transférer le Certificat d'Enregistrement Foncier dans un délai de 30 jours.\nEn cas de manquement, je serai tenu de réparer l'intégralité du préjudice civil causé conformément à l'article 258 du Livre III.`
    },
    {
      id: "licenciement-ab",
      name: "LETTRE DE RÉSILIATION DE CONTRAT DE TRAVAIL UNILATÉRALE",
      type: "Plainte",
      text: `COMMUNIQUE INTERNE - MANUFACTURE DE KINSHASA S.P.R.L.\nA l'attention de Mme Bénédicte Mukeba, Operatrice de tri.\nObjet : Fin de collaboration sans indemnités.\nNous vous informons qu'en raison de votre absence prolongée de 15 jours consécutifs débutant le 5 mai 2026 suite à votre accident au poste d'emballage, notre manufacture se voit contrainte d'annuler verbalement votre contrat de travail à durée indéterminée, prenant effet immédiatement.\nAucun préavis ne vous sera alloué.\nFait à Kinshasa, le 20 mai 2026.`
    },
    {
      id: "contrefacon-brevet",
      name: "ARRÊT DE SAISIE-CONTREFAÇON POUR CONCURRENCE DÉLOYALE",
      type: "Arrêté",
      text: `REPUBLIQUE DEMOCRATIQUE DU CONGO - TRIBUNAL DE COMMERCE DE KINSHASA\nPar ces motifs, vu l'ordonnance présidentielle protégeant la marque locale HakiLab. Le tribunal ordonne la saisie de l'ensemble des marchandises frauduleuses de la firme imitante 'FakeLab' commercialisant sans autorisation un code source plagié en violation des redevances d'utilité publique.`
    }
  ];

  const handleTemplateChange = (val: string) => {
    setPredefinedDocTemplate(val);
    if (val === "custom") {
      setCustomDocText("");
    } else {
      const selected = docTemplates.find((t) => t.id === val);
      if (selected) {
        setCustomDocText(selected.text);
        setNewDocName(selected.name);
        setNewDocType(selected.type);
      }
    }
  };

  const executeScan = () => {
    if (!selectedDossierId || !newDocName) return;
    const finalContent = customDocText || `DOCUMENT SCANNÉ - NUMÉRISATION SÉCURISÉE HAKILAB\nTitre: ${newDocName}\nType: ${newDocType}\nContenu à étudier sous le prisme des codes légaux congolais.`;
    
    onUploadDocument(selectedDossierId, newDocName, newDocType, finalContent);
    
    // reset scanner state
    setNewDocName("");
    setCustomDocText("");
    setPredefinedDocTemplate("custom");
    setShowScanModal(false);
  };

  const runIAJugeVirtuel = async (docId: string) => {
    if (!selectedDossierId) return;
    setIsAnalyzingId(docId);
    try {
      await onAnalyzeContractAI(selectedDossierId, docId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingId(null);
    }
  };

  // Safe Guard checks for unauthorized role entry
  if (!isAuthorizedToCabinet) {
    return (
      <div className="bg-slate-950 border border-red-950/40 rounded-3xl p-8 max-w-2xl mx-auto my-12 text-center" id="rbac-error-panel">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-full w-fit mx-auto mb-6 border border-red-500/20">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Accès Souverain Limité</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-roboto">
          Votre rôle actuel (<span className="text-amber-500 font-semibold">{currentRole}</span>) ne possède pas l'accréditation requise d'Auxiliaire de Justice nécessaire pour ouvrir les coffres-forts confidentiels des cabinets d'avocats congolais.
        </p>
        <div className="text-xs bg-slate-900 border border-slate-850 p-4 rounded-xl text-slate-400 text-left">
          <span className="font-semibold text-slate-300 font-sans block mb-1">Comment Tester ?</span>
          Veuillez sélectionner le rôle <span className="text-white font-semibold">⚖️ Me Micheline (Chef)</span>, <span className="text-white font-semibold">💼 Me Bakande (Avocat)</span> ou <span className="text-white font-semibold">Clerc</span> dans le sélecteur d'identité du menu de navigation pour simuler les pleins pouvoirs judiciaires.
        </div>
      </div>
    );
  }

  // Showcase Register cabinet card if no cabinet is registered
  if (!cabinet) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/80 backdrop-blur-sm" id="cabinet-enrollment-panel">
        <div className="bg-amber-500/10 p-4 rounded-full w-fit mx-auto mb-6 text-amber-500 border border-amber-500/20">
          <Briefcase className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-white text-center mb-3">Inscrire Votre Cabinet d'Avocat Virtuel</h2>
        <p className="text-slate-400 text-sm leading-relaxed text-center mb-6 font-roboto">
          HakiLab permet de numériser et de sécuriser la gestion physique de votre cabinet en RDC. Inscrivez votre cabinet auprès de la Cour d'Appel pour débloquer la numérisation assistée par IA, les dossiers clients chiffrés et le Juge Virtuel Analytique.
        </p>
        
        {isChef ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1">Nom du Cabinet (ex: Cabinet Micheline & Associés)</label>
              <input
                id="cabinet-name-input"
                type="text"
                placeholder="Entrez le nom officiel..."
                value={newCabinetName}
                onChange={(e) => setNewCabinetName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl py-3 px-4 text-sm text-slate-300 focus:outline-none"
              />
            </div>
            <button
              id="register-cabinet-action-btn"
              onClick={() => {
                if (newCabinetName) {
                  onRegisterCabinet(newCabinetName);
                  setNewCabinetName("");
                }
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-center text-sm"
            >
              Enregistrer l'Association du Cabinet
            </button>
          </div>
        ) : (
          <div className="text-xs bg-slate-950 border border-slate-850 p-4 rounded-xl text-slate-400">
            ⚠️ <span className="font-semibold text-slate-300 font-sans">Seul le Chef de Cabinet</span> a le droit souverain d'enregistrer son étude d'avocats sur HakiLab. Veuillez configurer temporairement votre identité sur <span className="text-white font-semibold">⚖️ Me Micheline</span> dans le menu pour procéder à cette action.
          </div>
        )}
      </div>
    );
  }

  // Active Cabinets View
  // Apply Search to filter dossiers. Deep search checks caseName, title, description AND inside OCR documents text !
  const filteredDossiers = dossiers.filter((d) => {
    const term = keywordQuery.toLowerCase();
    const matchMetadata =
      d.clientName.toLowerCase().includes(term) ||
      d.title.toLowerCase().includes(term) ||
      d.caseNumber.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term);

    const matchDocParagraph = d.documents.some((doc) => doc.content.toLowerCase().includes(term));
    return matchMetadata || matchDocParagraph;
  });

  const selectedDossier = dossiers.find((d) => d.id === selectedDossierId);

  return (
    <div className="flex flex-col gap-6" id="cabinet-workspace">
      {/* Cabinet Header information panel */}
      <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded font-semibold">
            Cabinet Agrée • Cour d'Appel
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-2 font-sans">{cabinet.name}</h1>
          <p className="text-xs text-slate-400 mt-1 font-roboto">
            Chef d'Étude: <span className="text-slate-300 font-semibold">{cabinet.chefName}</span> • Créé le {new Date(cabinet.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Dashboard mini-widgets stats */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-black/30 border border-white/10 py-2.5 px-4 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] text-slate-500 font-mono block">CLIENTS</span>
            <span className="text-lg font-bold text-white font-mono">{dossiers.length}</span>
          </div>
          <div className="bg-black/30 border border-white/10 py-2.5 px-4 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] text-slate-500 font-mono block">COLLABORATEURS</span>
            <span className="text-lg font-bold text-slate-300 font-mono">{members.length}</span>
          </div>
          <div className="bg-black/30 border border-white/10 py-2.5 px-4 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] text-slate-500 font-mono block">FICHIERS EXTRAITS</span>
            <span className="text-lg font-bold text-emerald-500 font-mono flex items-center justify-center gap-1">
              <Database className="h-4 w-4" />
              {dossiers.reduce((acc, current) => acc + current.documents.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs controller */}
      <div className="flex border-b border-white/10">
        <button
          id="subtab-btn-dossiers"
          onClick={() => {
            setActiveSubTab("dossiers");
            setSelectedDossierId(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "dossiers"
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          <span>Gestion des Dossiers Clients</span>
        </button>
        <button
          id="subtab-btn-members"
          onClick={() => setActiveSubTab("members")}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "members"
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Annuaire des Collaborateurs (RBAC)</span>
        </button>
      </div>

      {/* VIEW 1: DOSSIERS & LITIGES */}
      {activeSubTab === "dossiers" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* List panel (left 5 Columns if no dossier selected, otherwise left 4 cols) */}
          <div className={`${selectedDossierId ? "lg:col-span-4" : "lg:col-span-12"} flex flex-col gap-4`} id="dossiers-listing-block">
            {/* Search Box + Create Case Button */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-3/4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="keyword-dossier-search"
                  type="text"
                  placeholder="Recherche globale (titres, dates, paragraphes de pièces)..."
                  value={keywordQuery}
                  onChange={(e) => setKeywordQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 shortcut-input focus:border-amber-500/50 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-300 focus:outline-none"
                />
              </div>

              {canEditState && (
                <button
                  id="open-dossier-create-modal"
                  onClick={() => setShowDossierModal(true)}
                  className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nouveau Dossier</span>
                </button>
              )}
            </div>

            {/* List entries */}
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
              {filteredDossiers.length > 0 ? (
                filteredDossiers.map((d) => (
                  <div
                    key={d.id}
                    id={`dossier-entry-${d.id}`}
                    onClick={() => setSelectedDossierId(d.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                      selectedDossierId === d.id
                        ? "bg-amber-500/10 border-amber-500 shadow-md"
                        : "bg-black/30 border-white/5 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-[10px] font-mono text-slate-500">{d.caseNumber}</span>
                      <span
                        className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded border ${
                          d.status === "Gagné"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                            : d.status === "Perdu"
                            ? "bg-red-950/40 text-red-500 border-red-900/50"
                            : d.status === "Plaidé"
                            ? "bg-blue-950/40 text-blue-400 border-blue-900/40"
                            : "bg-slate-950/40 text-slate-300 border-slate-800/50"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">{d.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-roboto">Client: {d.clientName}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-3 pt-2.5 border-t border-white/5 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {d.documents.length} pièces
                      </span>
                      <span>Ouvert le {new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900/10 border border-slate-800/40 py-8 text-center rounded-xl">
                  <p className="text-xs text-slate-500">Aucun dossier trouvé pour l'étude.</p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Selected Case Panel (right 8 Columns) */}
          {selectedDossier && (
            <div className="lg:col-span-8 flex flex-col gap-6 glass-panel p-6 rounded-2xl" id="selected-case-details-panel">
              {/* Box Header title and status changer */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-5 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">{selectedDossier.caseNumber}</span>
                  <h2 className="text-lg font-bold text-white font-sans mt-0.5">{selectedDossier.title}</h2>
                  <p className="text-xs text-amber-500 mt-1">Client de l'Étude: <span className="font-semibold text-slate-200">{selectedDossier.clientName}</span></p>
                </div>

                {/* Status Switcher (RBAC limited to lawyers and clercs) */}
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-500 pl-2 font-mono uppercase">Statut :</span>
                  {canEditState ? (
                    <select
                      id="dossier-status-select"
                      value={selectedDossier.status}
                      onChange={(e) => onUpdateDossierStatus(selectedDossier.id, e.target.value as DecisionStatus)}
                      className="bg-transparent text-xs text-white border-none focus:ring-0 focus:outline-none cursor-pointer pr-1 py-1 font-semibold"
                    >
                      <option value="En cours" className="bg-slate-950 font-roboto">⏳ En cours</option>
                      <option value="Suspendu" className="bg-slate-950 font-roboto">⏸️ Suspendu</option>
                      <option value="Plaidé" className="bg-slate-950 font-roboto">🗣️ Plaidé</option>
                      <option value="Gagné" className="bg-slate-950 font-roboto">🏆 Gagné</option>
                      <option value="Perdu" className="bg-slate-950 font-roboto">💔 Perdu</option>
                    </select>
                  ) : (
                    <span className="text-xs font-semibold text-slate-300 pr-2">🛡️ {selectedDossier.status}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider mb-2">Exposé du Litige</h4>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 font-roboto text-xs md:text-sm text-slate-300 leading-relaxed">
                  {selectedDossier.description || "Aucune description fournie pour cette cause."}
                </div>
              </div>

              {/* Scanned Proof / Document sections */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-4.5 w-4.5 text-amber-500" />
                    <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                      Coffre-Fort des Pièces Numérisées (Chiffrement de bout-en-bout)
                    </h4>
                  </div>
                  {canEditState && (
                    <button
                      id="open-scan-simulator-action"
                      onClick={() => setShowScanModal(true)}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-500 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-sans transition-all"
                    >
                      <Plus className="h-3 w-3" /> Scanner Document
                    </button>
                  )}
                </div>

                {/* Docs list */}
                <div className="flex flex-col gap-3">
                  {selectedDossier.documents.length > 0 ? (
                    selectedDossier.documents.map((doc) => (
                      <div
                        key={doc.id}
                        id={`dossier-doc-${doc.id}`}
                        className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col gap-4"
                      >
                        {/* Doc header items */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/30 p-2 rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-amber-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white font-sans">{doc.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-mono uppercase text-slate-400 font-semibold">{doc.type}</span>
                                <span className="text-[10px] text-slate-500">•</span>
                                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                                  <Lock className="h-2.5 w-2.5 text-emerald-500" /> Chiffré AES 256
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-mono bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                              OCR: <span className="text-slate-300 font-bold">{doc.ocrConfidence}%</span>
                            </span>
                            
                            {isLawyerClass ? (
                              <button
                                id={`trigger-ai-analysis-${doc.id}`}
                                onClick={() => runIAJugeVirtuel(doc.id)}
                                disabled={isAnalyzingId === doc.id}
                                className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 active:scale-95 text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all uppercase"
                              >
                                <Cpu className="h-3 w-3 animate-spin duration-3000" />
                                {isAnalyzingId === doc.id ? "Validation IA..." : doc.analyzedByAI ? "Ré-Analyser par l'IA" : "IA Juge Analytique"}
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 border border-slate-800 px-2.5 py-1 rounded bg-slate-900/60 font-medium">
                                🔒 Avocats requis pour IA
                              </span>
                            )}
                          </div>
                        </div>

                        {/* OCR Text Area collapsed */}
                        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 max-h-[140px] overflow-y-auto custom-scroll">
                          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">Texte Indexé via OCR :</span>
                          <p className="text-[11px] md:text-xs text-slate-300 leading-relaxed whitespace-pre-line text-left italic">
                            {doc.content}
                          </p>
                        </div>

                        {/* AI Juge conclusions if exists */}
                        {doc.analyzedByAI && doc.aiConclusions && (
                          <div className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl flex flex-col gap-3 font-sans">
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-900/20 pb-2 flex-wrap">
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                  Rapport de Décision - Juge Analytique HakiLab
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-900/30">
                                Certitude: {doc.aiConclusions.confidence}%
                              </span>
                            </div>

                            {/* Verdict Section */}
                            <div className="flex items-start gap-2 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/10 text-slate-200">
                              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Chances Estimées du Verdict</p>
                                <p className="text-xs md:text-sm font-semibold">{doc.aiConclusions.verdictPreview}</p>
                              </div>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850">
                                <p className="text-[10px] font-bold text-slate-400 uppercase font-mono mb-2 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3 text-emerald-400" /> Forces du Dossier
                                </p>
                                <ul className="list-disc list-inside text-[11px] text-slate-300 leading-relaxed font-roboto space-y-1">
                                  {doc.aiConclusions.strengths?.map((str, idx) => (
                                    <li key={idx}> {str}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850">
                                <p className="text-[10px] font-bold text-slate-400 uppercase font-mono mb-2 flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Faiblesses & Risques
                                </p>
                                <ul className="list-disc list-inside text-[11px] text-slate-300 leading-relaxed font-roboto space-y-1">
                                  {doc.aiConclusions.weaknesses?.map((weak, idx) => (
                                    <li key={idx}> {weak}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Law citation */}
                            {doc.aiConclusions.citationsArticles && doc.aiConclusions.citationsArticles.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Bases Légales Associées:</span>
                                {doc.aiConclusions.citationsArticles.map((cite, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] font-mono uppercase bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-semibold px-2 py-0.5 rounded border border-amber-500/30"
                                  >
                                    {cite}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Cabinet Strategic Advice */}
                            <div className="p-3 bg-indigo-950/20 rounded-lg border border-indigo-900/20 text-xs">
                              <p className="text-[10px] font-bold text-indigo-400 uppercase font-mono mb-1">
                                Action Recommandée pour l'Avocat
                              </p>
                              <p className="text-slate-300 italic leading-relaxed">
                                {doc.aiConclusions.recommendations}
                              </p>
                            </div>

                            <p className="text-[9px] text-slate-500 italic mt-1 font-mono text-right uppercase">
                              🛡️ HakiLab: Outil d'aide à la décision. Les conclusions restent sous la seule maîtrise morale de l'avocat.
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-900/10 border border-dashed border-slate-800 py-12 text-center rounded-xl">
                      <p className="text-xs text-slate-500">Aucun document n'a été scanné pour ce client.</p>
                      {canEditState && (
                        <button
                          id="scan-prompt-action"
                          onClick={() => setShowScanModal(true)}
                          className="mt-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-500 text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer"
                        >
                          Lancer le Numériseur de Preuves
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: COLLABORATORS & CABINET DIRECTORY */}
      {activeSubTab === "members" && (
        <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl flex flex-col gap-6" id="members-directory-block">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-md font-bold text-white font-sans">Répertoire des Auxiliaires (RBAC)</h3>
              <p className="text-xs text-slate-400 font-roboto mt-0.5">
                Contrôle d'accès des membres du Cabinet. Seuls les collaborateurs accrédités reçoivent les autorisations de dossiers.
              </p>
            </div>
            {isChef && (
              <button
                id="open-member-create-modal"
                onClick={() => setShowMemberModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" /> Ajouter Collaborateur
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl relative overflow-hidden group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-md">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-sans">{member.name}</h4>
                    <span className="text-[10px] text-amber-500 font-mono uppercase bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20 font-bold mt-1 inline-block">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Inscrit le {new Date(member.joinedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                    ● Accrédité
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- DIALOG MODALS ----------------- */}

      {/* modal - create member */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-md font-bold text-white font-sans">Ajouter un Collaborateur</h3>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">NOM COMPLET</label>
              <input
                id="new-member-name"
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Me Cathy Kabulo..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">RÔLE D'ACCRÉDITATION (RBAC)</label>
              <select
                id="new-member-role-select"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Avocat">Avocat (Consultation + IA)</option>
                <option value="Clerc">Clerc (Saisie civile)</option>
                <option value="Secrétaire">Secrétaire (Consultation simple)</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                id="close-member-modal"
                onClick={() => {
                  setShowMemberModal(false);
                  setNewMemberName("");
                }}
                className="text-xs text-slate-400 hover:text-white px-4 py-2 cursor-pointer font-medium"
              >
                Annuler
              </button>
              <button
                id="save-member-action"
                onClick={() => {
                  if (newMemberName) {
                    onAddMember(newMemberName, newMemberRole);
                    setNewMemberName("");
                    setShowMemberModal(false);
                  }
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer font-sans"
              >
                Inscrire au Barreau Privé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal - create case folder (dossier) */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-md font-bold text-white font-sans">Créer un Dossier Client</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">NOM DU CLIENT</label>
                <input
                  id="new-dossier-client"
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="SOCIÉTÉ DU COMPTOIR..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">NUMÉRO DE CAUSE (GREFFE)</label>
                <input
                  id="new-dossier-casenumber"
                  type="text"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  placeholder="R.C.A. 22.010..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">OBJET DU LITIGE</label>
              <input
                id="new-dossier-title"
                type="text"
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
                placeholder="Rupture abusive de concession immobilière..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">EXPOSÉ DU LITIGE (DESCRIPTION)</label>
              <textarea
                id="new-dossier-desc"
                rows={3}
                value={newCaseDesc}
                onChange={(e) => setNewCaseDesc(e.target.value)}
                placeholder="Décrivez les faits juridiques..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none font-roboto resize-none"
              ></textarea>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                id="close-dossier-modal"
                onClick={() => {
                  setShowDossierModal(false);
                  setNewClientName("");
                  setNewCaseNumber("");
                  setNewCaseTitle("");
                  setNewCaseDesc("");
                }}
                className="text-xs text-slate-400 hover:text-white px-4 py-2 cursor-pointer font-medium"
              >
                Annuler
              </button>
              <button
                id="save-dossier-action"
                onClick={() => {
                  if (newClientName && newCaseTitle && newCaseNumber) {
                    onAddDossier(newClientName, newCaseTitle, newCaseNumber, newCaseDesc);
                    setNewClientName("");
                    setNewCaseNumber("");
                    setNewCaseTitle("");
                    setNewCaseDesc("");
                    setShowDossierModal(false);
                  }
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer font-sans"
              >
                Créer la Chemise de Procédure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal - scan simulator (upload & simulated OCR) */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-md font-bold text-white font-sans flex items-center gap-1.5">
              <Database className="h-5 w-5 text-amber-500" />
              <span>Numériseur de Pièces et Indexeur OCR</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">GABARITS DE CAS COURANTS (RDC)</label>
                <select
                  id="scanner-gabarit-select"
                  value={predefinedDocTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none cursor-pointer"
                >
                  <option value="custom">✍️ Saisie libre de contrat/preuves</option>
                  <option value="litige-foncier">🤝 Litige Foncier (SOMIKI - Gombe)</option>
                  <option value="licenciement-ab">💼 Conflit de Travail (Bénédicte Mukeba)</option>
                  <option value="contrefacon-brevet">🛡️ Contrefaçon (HakiLab c. FakeLab)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">TYPE DE PIÈCE</label>
                <select
                  id="scanner-type-select"
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-350 focus:outline-none cursor-pointer"
                >
                  <option value="Preuve">📜 Preuve matérielle</option>
                  <option value="Plainte">✍️ Plainte / Action en justice</option>
                  <option value="Mémoire">📖 Mémoire en défense / Conclusions</option>
                  <option value="Arrêté">🏢 Arrêté ou ordonnance</option>
                  <option value="Jurisprudence">⚖️ Décision jurisprudentielle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">TITRE DE LA PIÈCE</label>
              <input
                id="doc-title-input"
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="Ex. Contrat de Vente Foncier 1994..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">CONTENU TEXTUEL DE PREUVE À EXTRAIRE (OCR)</label>
              <textarea
                id="doc-content-textarea"
                rows={5}
                value={customDocText}
                onChange={(e) => setCustomDocText(e.target.value)}
                placeholder="Insérez le texte fictif de preuve, contrat ou litige à faire étudier par le Juge Virtuel..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none font-roboto resize-none"
              ></textarea>
            </div>

            {predefinedDocTemplate === "custom" && (
              <p className="text-[10px] text-slate-500 leading-normal font-roboto">
                💡 <span className="font-semibold text-slate-400">Astuce :</span> Pour tester rapidement l'IA Juge Virtuel sans copier-coller, sélectionnez un gabarit comme <span className="italic">🤝 Litige Foncier</span> ci-dessus.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                id="close-scan-modal"
                onClick={() => {
                  setShowScanModal(false);
                  setNewDocName("");
                  setCustomDocText("");
                  setPredefinedDocTemplate("custom");
                }}
                className="text-xs text-slate-400 hover:text-white px-4 py-2 cursor-pointer font-medium"
              >
                Annuler
              </button>
              <button
                id="execute-scan-action"
                onClick={executeScan}
                disabled={!newDocName}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer font-sans"
              >
                Lancer l'Enregistrement et le Chiffrement OCR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
