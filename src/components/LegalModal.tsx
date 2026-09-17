import React from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalModal: React.FC = () => {
  const { 
    isLegalModalOpen, 
    setIsLegalModalOpen, 
    legalModalTab, 
    setLegalModalTab,
    lang,
    t
  } = useApp();

  if (!isLegalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Juridisk information & Integritet
            </h2>
          </div>
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setLegalModalTab('terms')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              legalModalTab === 'terms'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Användarvillkor & Ansvarsfriskrivning
          </button>
          <button
            onClick={() => setLegalModalTab('privacy')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              legalModalTab === 'privacy'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Integritetspolicy & GDPR
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {legalModalTab === 'terms' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Viktig ansvarsfriskrivning (Disclaimer)</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-normal">
                  "Rapporter skapas av användare och kan vara felaktiga eller inaktuella. KollektivAlert är en oberoende gemenskapsplattform och representerar varken SL (Storstockholms Lokaltrafik) eller någon annan offentlig myndighet. Informationen är rent informativ och ersätter inte officiella trafikmeddelanden."
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm">1. Syfte och Funktion</h3>
                <p>
                  KollektivAlert är ett verktyg för att underlätta informationsdelning mellan resenärer i Stockholms kollektivtrafik. Plattformen strukturerar observationer (störningar, trängsel, hissproblem, spärrfel m.m.) med tidsstämplar och användarbekräftelser.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm">2. Uppförandekod & Moderering</h3>
                <p>
                  Det är strikt förbjudet att posta falska larm, spam, stötande kommentarer eller personuppgifter. Missbruk leder till omedelbar avstängning och neddragning av förtroendestatus.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm">3. Automatisk gallring och utgång</h3>
                <p>
                  Rapporter upphör automatiskt att vara aktiva efter en förutbestämd tidsperiod (t.ex. 60–120 minuter) om de inte bekräftas på nytt av aktiva resenärer.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Privacy by Design & GDPR (EU 2016/679)</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-normal">
                  Vi skyddar din personliga integritet fullt ut. Appen kräver inte kontinuerlig GPS-spårning och lagrar inga personliga resmönster.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm">1. Vilka uppgifter behandlas?</h3>
                <p>
                  Endast anonymiserade användarnamn, publicerade incidentrapporter och valda favoritstationer sparas i systemet. Inga telefonnummer, personnummer eller exakta boendeadresser registreras.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm">2. Dataportabilitet & Radering (GDPR Art. 17 & 20)</h3>
                <p>
                  Du kan när som helst exportera dina data i standardiserat JSON-format under din profil eller radera ditt konto permanent med ett klick.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm">3. Kakor och Spårning</h3>
                <p>
                  Vi använder inga tredjeparts annonseringskakor eller kommersiella spårningspixlar. All data används enbart för att upprätthålla trafiksäkerheten och plattformens funktionalitet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end">
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
