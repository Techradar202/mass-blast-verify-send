
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Users, Calendar, Send, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CampaignCreator: React.FC = () => {
  const [campaignType, setCampaignType] = useState<'email' | 'sms'>('email');
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    content: '',
    contactList: '',
    scheduleType: 'now',
    scheduleDate: '',
    scheduleTime: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!campaignData.name || !campaignData.content || !campaignData.contactList) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Campaign Created",
      description: `Your ${campaignType} campaign "${campaignData.name}" has been ${campaignData.scheduleType === 'now' ? 'sent' : 'scheduled'}!`
    });

    // Reset form
    setCampaignData({
      name: '',
      subject: '',
      content: '',
      contactList: '',
      scheduleType: 'now',
      scheduleDate: '',
      scheduleTime: ''
    });
  };

  const previewContent = () => {
    toast({
      title: "Preview",
      description: "Campaign preview opened in new window"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Create Campaign</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={previewContent}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Send className="w-4 h-4 mr-2" />
            {campaignData.scheduleType === 'now' ? 'Send Now' : 'Schedule'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campaign Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Campaign Type</label>
              <div className="flex space-x-2">
                <Button
                  variant={campaignType === 'email' ? 'default' : 'outline'}
                  onClick={() => setCampaignType('email')}
                  className="flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Button>
                <Button
                  variant={campaignType === 'sms' ? 'default' : 'outline'}
                  onClick={() => setCampaignType('sms')}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>SMS</span>
                </Button>
              </div>
            </div>

            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Name *</label>
              <Input
                placeholder="Enter campaign name"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Subject (Email only) */}
            {campaignType === 'email' && (
              <div>
                <label className="block text-sm font-medium mb-2">Subject Line *</label>
                <Input
                  placeholder="Enter email subject"
                  value={campaignData.subject}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {campaignType === 'email' ? 'Email Content' : 'SMS Message'} *
              </label>
              <Textarea
                placeholder={campaignType === 'email' 
                  ? "Write your email content here..." 
                  : "Write your SMS message here (160 characters recommended)"}
                value={campaignData.content}
                onChange={(e) => setCampaignData(prev => ({ ...prev, content: e.target.value }))}
                rows={campaignType === 'email' ? 8 : 4}
              />
              {campaignType === 'sms' && (
                <p className="text-sm text-gray-500 mt-2">
                  Character count: {campaignData.content.length}/160
                </p>
              )}
            </div>

            {/* Contact List */}
            <div>
              <label className="block text-sm font-medium mb-2">Contact List *</label>
              <Select value={campaignData.contactList} onValueChange={(value) => setCampaignData(prev => ({ ...prev, contactList: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subscribers">All Subscribers (15,432)</SelectItem>
                  <SelectItem value="newsletter">Newsletter Subscribers (8,921)</SelectItem>
                  <SelectItem value="customers">Customers (3,456)</SelectItem>
                  <SelectItem value="vip">VIP Customers (789)</SelectItem>
                  <SelectItem value="inactive">Inactive Users (2,234)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Scheduling */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Scheduling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Send Time</label>
                <Select value={campaignData.scheduleType} onValueChange={(value) => setCampaignData(prev => ({ ...prev, scheduleType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {campaignData.scheduleType === 'scheduled' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={campaignData.scheduleDate}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <Input
                      type="time"
                      value={campaignData.scheduleTime}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Campaign Stats Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Estimated Reach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recipients</span>
                <span className="font-medium">
                  {campaignData.contactList === 'all-subscribers' ? '15,432' :
                   campaignData.contactList === 'newsletter' ? '8,921' :
                   campaignData.contactList === 'customers' ? '3,456' :
                   campaignData.contactList === 'vip' ? '789' :
                   campaignData.contactList === 'inactive' ? '2,234' : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Est. Delivery Rate</span>
                <span className="font-medium">98.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Est. Open Rate</span>
                <span className="font-medium">{campaignType === 'email' ? '24.3%' : '98%'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Est. Click Rate</span>
                <span className="font-medium">{campaignType === 'email' ? '4.7%' : '12%'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
