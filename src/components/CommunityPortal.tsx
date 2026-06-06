/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Award,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  Plus,
  Trash2,
  ThumbsUp,
  Search,
  UserCheck
} from "lucide-react";
import { UserRole, Publication } from "../types";

interface CommunityPortalProps {
  currentRole: UserRole;
  publications: Publication[];
  onAddPublication: (title: string, authorName: string, content: string) => Promise<any>;
  onDeletePublication: (id: string) => void;
  onUpvotePublication: (id: string) => void;
}

export default function CommunityPortal({
  currentRole,
  publications,
  onAddPublication,
  onDeletePublication,
  onUpvotePublication
}: CommunityPortalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);

  const isContributor = currentRole === UserRole.CONTRIBUTEUR || currentRole === UserRole.SUPER_ADMIN || currentRole === UserRole.CHEF_CABINET;
  const isSuperAdmin = currentRole === UserRole.SUPER_ADMIN;

  const filteredPubs = publications.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startPublicationPipeline = async () => {
    if (!newTitle || !newContent || !newAuthor) return;
    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await onAddPublication(newTitle, newAuthor, newContent);
      setValidationResult(result);
      
      // Keep modal open to show verification details, or auto-close if clean
      if (result && result.complianceState === "Validé") {
        setTimeout(() => {
          setNewTitle("");
          setNewContent("");
          setNewAuthor("");
          setValidationResult(null);
          setShowSubmitModal(false);
        }, 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="forum-doctrinal-workspace">
      {/* Editorial space Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-amber-500" />
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 md:px-3 py-1 rounded font-bold">
              Tribunes & Doctrines Validées RDC
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-sans">Espace de Recherche Scientifique</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-2xl font-roboto leading-relaxed">
            Consultez les contributions des Grands Docteurs de la République en Droit Foncier, Civil et Social. Notre pipeline d'intelligence juridique scanne automatiquement les plaidoyers pour empêcher le plagiat ou les orientations aberrantes.
          </p>
        </div>

        {/* Contribute action trigger */}
        <div className="flex-shrink-0 flex flex-col gap-2 items-center">
          {isContributor ? (
            <button
              id="open-submit-pub-modal"
              onClick={() => {
                setShowSubmitModal(true);
                setNewAuthor(currentRole === UserRole.CHEF_CABINET ? "Me Micheline Kalehezo" : "Dr. Congo Legalist");
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Plus className="h-5 w-5" />
              <span>Soumettre une Tribune</span>
            </button>
          ) : (
            <div className="text-center bg-black/40 p-3 rounded-xl border border-white/5 max-w-[260px]">
              <span className="text-[10px] text-amber-500 block font-bold mb-1 uppercase font-mono">📢 INSCRIPTION ACADÉMIQUE REQUISE</span>
              <p className="text-[10px] text-slate-400 font-roboto leading-normal">
                Basculez sur l'identité <span className="text-white font-semibold">🎓 Docteur en Droit</span> dans le menu pour soumettre des plaidoiries scientifiques.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Filter elements */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl animate-fade-in">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            id="pub-search-input"
            type="text"
            placeholder="Rechercher des doctrines ou des docteurs congolais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-amber-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span>PUBLICATIONS OFFICIELLES :</span>
          <span className="text-white font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            {filteredPubs.length}
          </span>
        </div>
      </div>

      {/* Publications Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {filteredPubs.length > 0 ? (
          filteredPubs.map((pub) => (
            <div
              key={pub.id}
              id={`pub-card-${pub.id}`}
              className="theme-card p-6 rounded-2xl flex flex-col justify-between gap-4 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Corner Watermarks */}
              <div className="absolute top-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 w-full opacity-40"></div>

              {/* Card Meta details */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                    {pub.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-sans">{pub.authorName}</h4>
                    <p className="text-[9px] text-slate-500 font-mono">Chercheur Émérite en RDC</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(pub.createdAt).toLocaleDateString()}
                  </span>
                  
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      (100 - pub.plagiarismScore) > 75
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                        : "bg-red-950/40 text-red-500 border border-red-900/30"
                    }`}
                    title="Indice de conformité par rapport au corpus HakiLab"
                  >
                    Conformité: {100 - pub.plagiarismScore}%
                  </span>
                </div>
              </div>

              {/* Title & Excerpt Content */}
              <div className="flex-1">
                <h3 className="text-sm md:text-md font-extrabold text-white leading-snug group-hover:text-amber-500 transition-colors duration-200 mb-2 font-sans">
                  {pub.title}
                </h3>
                <p className="text-slate-300 text-xs font-roboto leading-relaxed whitespace-pre-line text-left line-clamp-6">
                  {pub.content}
                </p>
              </div>

              {/* Bottom metrics and actions */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-4 flex-wrap">
                <button
                  id={`upvote-action-${pub.id}`}
                  onClick={() => onUpvotePublication(pub.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850 transition-all cursor-pointer font-sans"
                >
                  <ThumbsUp className="h-3.5 w-3.5 text-amber-500" />
                  <span>Prônant • {pub.upvotes}</span>
                </button>

                {/* Super admin destructive Veto button */}
                {isSuperAdmin && (
                  <button
                    id={`delete-veto-${pub.id}`}
                    onClick={() => onDeletePublication(pub.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-white bg-red-950/20 hover:bg-red-900 px-3 py-1.5 rounded-lg border border-red-900/30 transition-all cursor-pointer"
                    title="Destituer la publication pour obsolescence ou non-conformité doctrinale"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Destituer la Publication (Veto)</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2 bg-slate-900/10 border border-slate-800/40 rounded-2xl py-12 text-center">
            <p className="text-slate-500 text-sm">Aucune doctrine scientifique de recherche enregistrée.</p>
          </div>
        )}
      </div>

      {/* ----------------- TRIBUNE SUBMISSION PIPELINE DIALOG ----------------- */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl p-6 rounded-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scroll">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="h-5 w-5 text-amber-500" />
              <h3 className="text-md font-bold text-white font-sans">
                Soumettre un Projet de Tribune Doctrinale
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">SIGNATURE DE L'AUTEUR</label>
                <input
                  id="pub-author-input"
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
                  placeholder="Professeur Albert..."
                />
              </div>
              <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-850 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] text-slate-400">
                  Contrôle biométrique: <span className="text-white font-bold font-mono">Contributeur Accrédité</span>
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">TITRE DE L'ARTICLE DE DOCTRINE</label>
              <input
                id="pub-title-input"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex. De l'application d'utilité collective de l'art 258 du code civil..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">SOUCHEC DE CORPS D'ARGUMENTATION</label>
              <textarea
                id="pub-content-textarea"
                rows={8}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Spécifiez l'entièreté de votre thèse d'équité civile..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none font-roboto resize-none"
              ></textarea>
            </div>

            {/* AI validation screen indicator */}
            {isValidating && (
              <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-emerald-400 animate-spin" />
                <div className="text-left">
                  <p className="text-xs text-emerald-400 font-bold font-sans">Pipeline d'IA HakiLab activé</p>
                  <p className="text-[10px] text-slate-350 font-roboto leading-normal">
                    Numérisation en cours : Vérification des rumeurs, plagiats d'autres revues et rigueur constitutionnelle congolaise...
                  </p>
                </div>
              </div>
            )}

            {/* Results output */}
            {validationResult && (
              <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                validationResult.complianceState === "Validé"
                  ? "bg-emerald-950/20 border-emerald-900/30 text-slate-300"
                  : "bg-red-950/20 border-red-900/30 text-slate-300"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-sans flex items-center gap-1">
                    {validationResult.complianceState === "Validé" ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                    Rapport de Conformité Doctrinale HakiLab IA
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-slate-950 py-0.5 px-2.5 rounded">
                    Score: {validationResult.complianceScore}%
                  </span>
                </div>
                <p className="text-[11px] font-roboto leading-relaxed italic pr-2">
                  &quot;{validationResult.aiFeedback}&quot;
                </p>
              </div>
            )}

            {/* Form footer operations */}
            {!isValidating && !validationResult && (
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  id="cancel-submit-pub"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setNewTitle("");
                    setNewContent("");
                  }}
                  className="text-xs text-slate-400 hover:text-white px-4 py-2 cursor-pointer font-medium"
                >
                  Annuler
                </button>
                <button
                  id="submit-pub-action"
                  onClick={startPublicationPipeline}
                  disabled={!newTitle || !newContent}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer font-sans"
                >
                  Authentifier et Lancer la Validation IA
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
