import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { InteractiveMap } from './components/InteractiveMap';
import { ReportFeed } from './components/ReportFeed';
import { FavoritesView } from './components/FavoritesView';
import { StatisticsView } from './components/StatisticsView';
import { ProfileView } from './components/ProfileView';
import { ReportModal } from './components/ReportModal';
import { LegalModal } from './components/LegalModal';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

const MainAppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300 font-sans">
      {/* Top Header */}
      <Header />

      {/* Mandatory Community Disclaimer */}
      <DisclaimerBanner />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full relative">
        {activeTab === 'map' && <InteractiveMap />}
        {activeTab === 'feed' && <ReportFeed />}
        {activeTab === 'favorites' && <FavoritesView />}
        {activeTab === 'stats' && <StatisticsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Floating Report Wizard Modal */}
      <ReportModal />

      {/* Legal & GDPR Terms Modal */}
      <LegalModal />

      {/* Real-time Alerts Toast */}
      <Toast />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
