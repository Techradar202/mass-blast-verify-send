
import React from 'react';
import { Mail, MessageSquare, Users, TrendingUp, CheckCircle, AlertCircle, Clock, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  {
    title: 'Total Emails Sent',
    value: '2,847,293',
    change: '+12.5%',
    icon: Mail,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'SMS Messages Sent',
    value: '184,329',
    change: '+8.2%',
    icon: MessageSquare,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Active Contacts',
    value: '89,423',
    change: '+5.7%',
    icon: Users,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Delivery Rate',
    value: '98.7%',
    change: '+0.3%',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600'
  }
];

const recentCampaigns = [
  {
    name: 'Black Friday Sale',
    type: 'Email',
    status: 'Completed',
    sent: '45,892',
    opened: '18,356',
    clicked: '4,589'
  },
  {
    name: 'Product Launch',
    type: 'SMS',
    status: 'In Progress',
    sent: '12,340',
    opened: '-',
    clicked: '892'
  },
  {
    name: 'Newsletter #34',
    type: 'Email',
    status: 'Scheduled',
    sent: '-',
    opened: '-',
    clicked: '-'
  }
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to MailerPro</h1>
          <p className="text-blue-100 mb-6">Powerful bulk email and SMS marketing platform with advanced verification</p>
          <div className="flex space-x-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Create Campaign
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Verify Emails
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full -mb-16" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5" />
              <span>Recent Campaigns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{campaign.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        campaign.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{campaign.sent} sent</p>
                    {campaign.opened !== '-' && (
                      <p className="text-xs text-gray-500">{campaign.opened} opened</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Email Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Valid Emails</h4>
                    <p className="text-sm text-gray-500">Verified and deliverable</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-green-600">87.3%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Risky Emails</h4>
                    <p className="text-sm text-gray-500">May have delivery issues</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-yellow-600">8.9%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Invalid Emails</h4>
                    <p className="text-sm text-gray-500">Non-deliverable addresses</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-red-600">3.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
