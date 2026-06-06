/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Scale, Globe, Briefcase, BookOpen, ShieldCheck, UserCheck, Menu, X } from "lucide-react";
import { UserRole, UserProfile } from "../types";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: "public" | "private" | "community" | "admin";
  onTabChange: (tab: "public" | "private" | "community" | "admin") => void;
  hasCabinet: boolean;
  cabinetName: string;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  hasCabinet,
  cabinetName
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dynamic Simulated Persona details for the "Professional Polish" look
  const getPersonaDetails = (role: UserRole) => {
    switch (role) {
      case UserRole.CITOYEN:
        return { name: "Citoyen Congolais", title: "Portail Public", initials: "CC", color: "bg-blue-900/30 border-blue-500/30" };
      case UserRole.CHEF_CABINET:
        return { name: "Me Micheline Kalehezo", title: "Chef de Cabinet", initials: "MK", color: "bg-amber-900/40 border-amber-500/40" };
      case UserRole.AVOCAT:
        return { name: "Me Bakande", title: "Avocat Collaborateur", initials: "MB", color: "bg-slate-800 border-slate-700" };
      case UserRole.CLERC:
        return { name: "Aimé Mutombo", title: "Clerc de Justice", initials: "AM", color: "bg-emerald-900/30 border-emerald-500/30" };
      case UserRole.CONTRIBUTEUR:
        return { name: "Docteur en Droit", title: "Chercheur Scientifique", initials: "DD", color: "bg-purple-900/30 border-purple-500/30" };
      case UserRole.SUPER_ADMIN:
        return { name: "Admin Système", title: "Super-Administrateur", initials: "AS", color: "bg-red-900/30 border-red-500/30" };
      default:
        return { name: "Avocat du Cabinet", title: "Cabinet Ministériel", initials: "AC", color: "bg-slate-800 border-slate-700" };
    }
  };

  const persona = getPersonaDetails(currentRole);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleTabClick = (tab: "public" | "private" | "community" | "admin") => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-white/10 glass-panel sticky top-0 z-50 shadow-xl" id="hakilab-navbar-container">
      {/* Main Single Row Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-rdc-gold p-2 md:p-2.5 rounded-lg text-slate-950 shadow-md shadow-amber-500/10 transition-transform hover:scale-105">
            <Scale className="h-5 w-5" id="hakilab-logo-icon" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Haki<span className="text-rdc-gold">Lab</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Kinshasa - RDC</span>
          </div>
        </div>

        {/* Primary Navigation Tabs (Hidden on mobile/tablet, shown on desktop lg) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5">
          <button
            id="tab-btn-public"
            onClick={() => handleTabClick("public")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              activeTab === "public"
                ? "bg-white/10 text-white shadow-sm border border-white/10 animate-pulse-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Globe className="h-4 w-4 text-rdc-gold" />
            <span>Portail Public IP</span>
          </button>

          <button
            id="tab-btn-private"
            onClick={() => handleTabClick("private")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              activeTab === "private"
                ? "bg-white/10 text-white shadow-sm border border-white/10 animate-pulse-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase className="h-4 w-4 text-rdc-gold" />
            <span className="flex items-center gap-1.5">
              Espace Cabinet
              {hasCabinet && <span className="status-dot"></span>}
            </span>
          </button>

          <button
            id="tab-btn-community"
            onClick={() => handleTabClick("community")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              activeTab === "community"
                ? "bg-white/10 text-white shadow-sm border border-white/10 animate-pulse-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="h-4 w-4 text-rdc-gold" />
            <span>Forum Doctrinal</span>
          </button>

          {currentRole === UserRole.SUPER_ADMIN && (
            <button
              id="tab-btn-admin"
              onClick={() => handleTabClick("admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "admin"
                  ? "bg-red-950/40 text-red-400 shadow-sm border border-red-900/40"
                  : "text-red-500/80 hover:text-red-400 hover:bg-red-950/20"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Super-Admin</span>
            </button>
          )}
        </div>

        {/* Right Side: Persona Details & Simulator (Hidden on mobile/tablet, shown on desktop lg) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Dynamic User Profile Indicator */}
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-white tracking-wide">{persona.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">{persona.title}</span>
            </div>
            <div className={`w-8 h-8 rounded ${persona.color} flex items-center justify-center text-xs font-bold text-white shadow-inner`}>
              {persona.initials}
            </div>
          </div>

          {/* Dynamic Switchboard simulation */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
            <select
              id="role-select"
              value={currentRole}
              onChange={(e) => {
                const selected = e.target.value as UserRole;
                onRoleChange(selected);
                if (selected === UserRole.CITOYEN) handleTabClick("public");
                else if (selected === UserRole.CONTRIBUTEUR) handleTabClick("community");
                else if (selected === UserRole.SUPER_ADMIN) handleTabClick("admin");
                else handleTabClick("private");
              }}
              className="bg-transparent text-xs text-slate-300 border-none focus:ring-0 focus:outline-none cursor-pointer pr-1 font-medium font-sans"
            >
              <option value={UserRole.CITOYEN} className="bg-slate-950 text-slate-300">👥 Simuler: Citoyen</option>
              <option value={UserRole.CHEF_CABINET} className="bg-slate-950 text-slate-300">⚖️ Simuler: Me Micheline (Chef)</option>
              <option value={UserRole.AVOCAT} className="bg-slate-950 text-slate-300">💼 Simuler: Me Bakande</option>
              <option value={UserRole.CLERC} className="bg-slate-950 text-slate-300">✍️ Simuler: Aimé </option>
              <option value={UserRole.CONTRIBUTEUR} className="bg-slate-950 text-slate-300">🎓 Simuler: Docteur Droit</option>
              <option value={UserRole.SUPER_ADMIN} className="bg-slate-950 text-slate-300">🛡️ Simuler: Super-Admin</option>
            </select>
          </div>
        </div>

        {/* Mobile/Tablet Menu Button (Visible on screens smaller than lg) */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Quick status indicator when menu closed */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-rdc-gold animate-pulse"></div>
            <span className="text-[10px] text-slate-300 font-medium">{persona.name}</span>
          </div>

          <button
            id="mobile-nav-toggle-btn"
            onClick={toggleMenu}
            className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-rdc-gold"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 text-rdc-gold animate-fade-in" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown Panel (Only visible on screens smaller than lg when opened) */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-5 flex flex-col gap-5 animate-fade-in shadow-2xl">
          
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold border-b border-white/5 pb-2">
            Navigation HakiLab
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-2">
            <button
              id="mobile-tab-btn-public"
              onClick={() => handleTabClick("public")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "public"
                  ? "bg-amber-500/10 text-white border border-amber-500/30"
                  : "bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-rdc-gold" />
                <span>Portail Public IP</span>
              </div>
              {activeTab === "public" && <span className="w-1.5 h-1.5 rounded-full bg-rdc-gold"></span>}
            </button>

            <button
              id="mobile-tab-btn-private"
              onClick={() => handleTabClick("private")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "private"
                  ? "bg-amber-500/10 text-white border border-amber-500/30"
                  : "bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-rdc-gold" />
                <span>Espace Cabinet</span>
              </div>
              {hasCabinet && <span className="status-dot"></span>}
            </button>

            <button
              id="mobile-tab-btn-community"
              onClick={() => handleTabClick("community")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "community"
                  ? "bg-amber-500/10 text-white border border-amber-500/30"
                  : "bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-rdc-gold" />
                <span>Forum Doctrinal</span>
              </div>
              {activeTab === "community" && <span className="w-1.5 h-1.5 rounded-full bg-rdc-gold"></span>}
            </button>

            {currentRole === UserRole.SUPER_ADMIN && (
              <button
                id="mobile-tab-btn-admin"
                onClick={() => handleTabClick("admin")}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === "admin"
                    ? "bg-red-950/40 text-red-400 border border-red-900/40"
                    : "bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-red-500" />
                  <span>Super-Admin</span>
                </div>
              </button>
            )}
          </div>

          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold border-b border-white/5 pb-2 mt-2">
            Identité Active & Simulation
          </div>

          {/* Active Sim Profile Details */}
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className={`w-9 h-9 rounded-lg ${persona.color} flex items-center justify-center text-xs font-bold text-white shadow-inner`}>
              {persona.initials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">{persona.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{persona.title}</span>
            </div>
          </div>

          {/* Selection Select Switcher */}
          <div className="flex flex-col gap-1.5 bg-black/40 border border-white/10 px-4 py-3 rounded-xl">
            <label htmlFor="mobile-role-select" className="text-[10px] uppercase font-mono text-slate-400">Rôle Actif :</label>
            <select
              id="mobile-role-select"
              value={currentRole}
              onChange={(e) => {
                const selected = e.target.value as UserRole;
                onRoleChange(selected);
                if (selected === UserRole.CITOYEN) handleTabClick("public");
                else if (selected === UserRole.CONTRIBUTEUR) handleTabClick("community");
                else if (selected === UserRole.SUPER_ADMIN) handleTabClick("admin");
                else handleTabClick("private");
              }}
              className="bg-transparent text-sm text-slate-300 border-none focus:ring-0 focus:outline-none cursor-pointer w-full font-medium font-sans"
            >
              <option value={UserRole.CITOYEN} className="bg-slate-950 text-slate-300">👥 Simuler: Citoyen</option>
              <option value={UserRole.CHEF_CABINET} className="bg-slate-950 text-slate-300">⚖️ Simuler: Me Micheline (Chef)</option>
              <option value={UserRole.AVOCAT} className="bg-slate-950 text-slate-300">💼 Simuler: Me Bakande</option>
              <option value={UserRole.CLERC} className="bg-slate-950 text-slate-300">✍️ Simuler: Aimé </option>
              <option value={UserRole.CONTRIBUTEUR} className="bg-slate-950 text-slate-300">🎓 Simuler: Docteur Droit</option>
              <option value={UserRole.SUPER_ADMIN} className="bg-slate-950 text-slate-300">🛡️ Simuler: Super-Admin</option>
            </select>
          </div>

        </div>
      )}
    </header>
  );
}
