
import React from 'react';
import { Mail, MessageSquare, Users, BarChart3, Settings, Send, Shield, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
  { icon: Mail, label: 'Email Campaigns', id: 'email-campaigns' },
  { icon: MessageSquare, label: 'SMS Campaigns', id: 'sms-campaigns' },
  { icon: Users, label: 'Contact Lists', id: 'contacts' },
  { icon: CheckCircle, label: 'Email Verification', id: 'verification' },
  { icon: Shield, label: 'Deliverability', id: 'deliverability' },
  { icon: FileText, label: 'Templates', id: 'templates' },
  { icon: Send, label: 'Send Test', id: 'test-send' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [activeItem, setActiveItem] = React.useState('dashboard');

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <h1 className="text-xl font-bold gradient-text">MailerPro</h1>
          )}
        </div>
      </div>

      <nav className="px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 mb-1",
                activeItem === item.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
