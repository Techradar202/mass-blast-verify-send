
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { EmailVerification } from '@/components/EmailVerification';
import { CampaignCreator } from '@/components/CampaignCreator';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'email-verification':
        return <EmailVerification />;
      case 'campaign-creator':
        return <CampaignCreator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Quick Navigation */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === 'dashboard' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('email-verification')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === 'email-verification' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Email Verification
          </button>
          <button
            onClick={() => setActiveView('campaign-creator')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === 'campaign-creator' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Create Campaign
          </button>
        </div>

        {renderContent()}
      </div>
    </Layout>
  );
};

export default Index;
