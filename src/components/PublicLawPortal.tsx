/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Search, Gavel, ArrowRight, MessageSquare, Sparkles, Scale, RefreshCw, Send, CheckCircle2, User } from "lucide-react";
import { CONGO_LAWS } from "../data/congo_laws";
import { LawCategory, LawItem, ChatMessage, Cabinet } from "../types";

interface PublicLawPortalProps {
  registeredCabinets: Cabinet[];
  onConsultCabinet: (cabinetId: string) => void;
}

export default function PublicLawPortal({ registeredCabinets, onConsultCabinet }: PublicLawPortalProps) {
  // Law Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LawCategory | "All">("All");

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour. Je suis l'assistant d'IA HakiLab, guide légal virtuel de la République Démocratique du Congo. Posez-moi vos questions relatives à la Constitution (égalité, sacralité), au Code Civil/Obligations (Particulièrement l'**Article 258 du CCCIII**), au Code du Travail ou de la Famille. Je vous répondrai proportionnellement en me basant exclusivement sur notre corpus républicain, sans opinion personnelle. Comment puis-je vous guider aujourd'hui ?",
      createdAt: new Date().toISOString()
    }
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions based on real DRC law situations
  const suggestedQuestions = [
    "Quelles sont les conditions de responsabilité civile sous l'Article 258 CCCIII ?",
    "La dot est-elle obligatoire sous le Code de la Famille réformé ?",
    "Un licenciement verbal est-il légal sous l'Article 42 du Code du Travail ?",
    "Qu'est-ce que garantit l'Article 12 de la Constitution Congolaise ?"
  ];

  // Category list as requested: Livres, Articles, Arrêtés, Doctrines, Jurisprudences, Coutumes, Usages
  const categories: (LawCategory | "All")[] = [
    "All",
    "Livre",
    "Article",
    "Arrêté",
    "Doctrine",
    "Jurisprudence",
    "Coutume",
    "Usage"
  ];

  // Filter laws
  const filteredLaws = CONGO_LAWS.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (law.context && law.context.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserQuery("");
    setIsChatLoading(true);

    try {
      const chatHistory = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/citoyen-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("Impossible de joindre le serveur HakiLab");
      }

      const data = await res.json();
      
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.content,
          citations: data.citations,
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Erreur de connexion. L'État de droit exige une connexion fluide. En attendant la reconnexion répressive, veuillez noter que vos demandes de préjudice matériel ou de fait délictuel sont gouvernées par l'**Article 258 du Code Civil Livre III** de la RDC.",
          citations: ["Code Civil Libre III, Art. 258"],
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* LEFT COLUMN: Open access Legal database (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6" id="open-access-laws-panel">
        <div className="p-6 rounded-2xl glass-panel shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white font-sans">Corpus Législatif et Coutumier de la RDC</h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 font-roboto">
            Accès libre et souverain aux textes constitutifs de la République Démocratique du Congo. Recherchez parmi les codes civils et pénaux, doctrines accréditées, et coutumes reconnues par l'ordre judiciaire.
          </p>

          {/* Search Box */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              id="law-search-input"
              type="text"
              placeholder="Rechercher par article, mot-clé (ex: CCCIII, famille, dot, licenciement)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-amber-500/50 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-300 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Filters dynamic top-bar as requested */}
          <div className="flex flex-wrap gap-1.5 items-center bg-black/40 p-1.5 rounded-xl border border-white/5 mb-2">
            <span className="text-[10px] text-slate-500 font-mono pl-2 pr-1 uppercase">Filtres :</span>
            {categories.map((cat) => (
              <button
                id={`filter-cat-${cat}`}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {cat === "All" ? "Tous" : cat + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* Laws List Output */}
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
          {filteredLaws.length > 0 ? (
            filteredLaws.map((law) => (
              <div
                key={law.id}
                id={`law-card-${law.id}`}
                className="theme-card p-5 hover:border-white/20 transition-all duration-300 group flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 font-semibold border border-slate-700/30">
                    {law.category}
                  </span>
                  <span className="text-xs font-mono text-amber-500 font-semibold">{law.source}</span>
                </div>
                <h3 className="text-md font-bold text-white group-hover:text-amber-400 transition-colors duration-200 font-sans">
                  {law.title}
                </h3>
                <div className="border-l-2 border-slate-700 pl-3 py-1 bg-slate-950/35 rounded-r-lg">
                  <p className="text-slate-300 text-xs md:text-sm font-light italic leading-relaxed whitespace-pre-line">
                    &quot;{law.excerpt}&quot;
                  </p>
                </div>
                {law.context && (
                  <p className="text-[11px] md:text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40 font-roboto">
                    <span className="font-semibold text-slate-300 font-sans">Ancrage contextuel:</span> {law.context}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-slate-900/20 border border-slate-800/40 rounded-2xl py-12 px-4 text-center">
              <p className="text-slate-500 text-sm">Aucun texte de loi trouvé pour vos paramètres de filtrage.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Chat Guide Juridique (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col h-[750px] glass-panel rounded-2xl overflow-hidden" id="chat-assistance-panel">
        {/* Chat Title bar */}
        <div className="bg-black/30 border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-tr from-amber-500 to-yellow-400 p-1.5 rounded-lg">
                <MessageSquare className="h-5 w-5 text-slate-950" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">IA Guide Juridique</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Consultation Virtuelle d'Équité</p>
            </div>
          </div>
          <button
            id="reset-chat-btn"
            onClick={() =>
              setChatMessages([
                {
                  id: "welcome",
                  role: "assistant",
                  content: "Bonjour. Je suis l'assistant d'IA HakiLab, guide légal virtuel de la République Démocratique du Congo. Posez-moi vos questions relatives au droit congolais.",
                  createdAt: new Date().toISOString()
                }
              ])
            }
            className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            title="Réinitialiser l'entretien"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scroll bg-slate-950/20">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              {/* Avatar indicator */}
              <div
                className={`p-1.5 rounded-lg flex-shrink-0 text-slate-900 ${
                  msg.role === "user"
                    ? "bg-slate-700 text-white"
                    : "bg-gradient-to-tr from-amber-500 to-yellow-400"
                }`}
              >
                {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Gavel className="h-4 w-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600/10 border border-blue-500/20 text-slate-200 rounded-tr-none"
                    : "bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-none"
                }`}
              >
                {/* Styled text body */}
                <div className="whitespace-pre-line font-roboto">{msg.content}</div>

                {/* Citations block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-slate-500 font-semibold font-mono uppercase mr-1">
                      Citations:
                    </span>
                    {msg.citations.map((cite, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 font-semibold"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* AI Loading indicator */}
          {isChatLoading && (
            <div className="flex items-start gap-2.5 self-start max-w-[85%]">
              <div className="bg-gradient-to-tr from-amber-500 to-yellow-400 p-1.5 rounded-lg flex-shrink-0 animate-pulse text-slate-900">
                <Gavel className="h-4 w-4 animate-bounce" />
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
                <span>Analyse du droit congolais en cours de formulation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions drawer */}
        <div className="bg-slate-950/60 border-t border-slate-800/60 p-3 flex overflow-x-auto gap-2 custom-scroll scroll-smooth select-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="flex-shrink-0 text-[11px] bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-400 border border-slate-800 rounded-full px-3.5 py-1.5 transition-all duration-200 hover-gold cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-2">
          <input
            id="chat-query-input"
            type="text"
            placeholder="Posez votre question sur la charte et le droit de RDC..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(userQuery);
            }}
            className="flex-1 bg-black/40 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-300 focus:outline-none transition-colors"
          />
          <button
            id="send-chat-msg-btn"
            onClick={() => handleSendMessage(userQuery)}
            disabled={isChatLoading || !userQuery.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 hover:text-slate-950 disabled:text-slate-600 p-3 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Registered Cabinets crosslink for complex queries */}
        {registeredCabinets.length > 0 && (
          <div className="bg-amber-500/5 border-t border-amber-500/20 px-4 py-3">
            <h4 className="text-[10px] font-bold text-amber-500 font-mono uppercase mb-2">
              ⚠️ CAS COMPLEXE ? CONSULTEZ UN CABINET ACCRÉDITÉ HAKILAB :
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scroll">
              {registeredCabinets.map((cab) => (
                <button
                  key={cab.id}
                  onClick={() => onConsultCabinet(cab.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 text-[11px] bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 rounded px-2.5 py-1.5 transition-all duration-200 cursor-pointer"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>{cab.name}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
