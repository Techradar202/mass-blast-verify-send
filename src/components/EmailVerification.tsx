import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, XCircle, AlertTriangle, Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface EmailStatus {
  email: string;
  status: 'valid' | 'invalid' | 'risky' | 'unknown';
  reason?: string;
}

export const EmailVerification: React.FC = () => {
  const [emailList, setEmailList] = useState('');
  const [verificationResults, setVerificationResults] = useState<EmailStatus[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Fetch recent verification batches
  const { data: batches, refetch } = useQuery({
    queryKey: ['verification-batches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verification_batches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const validateEmail = (email: string): EmailStatus => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { email, status: 'invalid', reason: 'Invalid format' };
    }
    
    // Simulate various email validation scenarios
    const random = Math.random();
    if (random > 0.85) {
      return { email, status: 'invalid', reason: 'Domain not found' };
    } else if (random > 0.75) {
      return { email, status: 'risky', reason: 'Disposable email provider' };
    } else if (random > 0.7) {
      return { email, status: 'risky', reason: 'Role-based email' };
    } else {
      return { email, status: 'valid', reason: 'Valid and deliverable' };
    }
  };

  const handleVerification = async () => {
    if (!emailList.trim()) {
      toast({
        title: "Error",
        description: "Please enter email addresses to verify",
        variant: "destructive"
      });
      return;
    }

    const emails = emailList
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "No valid email addresses found",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setProgress(0);
    setVerificationResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('verify-emails', {
        body: { emails }
      });

      if (error) throw error;

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setVerificationResults(data.results);
      await refetch();

      toast({
        title: "Verification Complete",
        description: `Verified ${emails.length} email addresses`
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify emails. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'risky': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'risky': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const exportResults = () => {
    const csv = [
      'Email,Status,Reason',
      ...verificationResults.map(r => `${r.email},${r.status},${r.reason || ''}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-verification-results.csv';
    a.click();
  };

  const validCount = verificationResults.filter(r => r.status === 'valid').length;
  const invalidCount = verificationResults.filter(r => r.status === 'invalid').length;
  const riskyCount = verificationResults.filter(r => r.status === 'risky').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Email Verification</h1>
        <Button onClick={exportResults} disabled={verificationResults.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Bulk Email Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Addresses</label>
              <Textarea
                placeholder="Enter email addresses, one per line&#10;example1@domain.com&#10;example2@domain.com&#10;example3@domain.com"
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter up to 10,000 email addresses, one per line
              </p>
            </div>

            {isVerifying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verifying emails...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleVerification} 
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isVerifying ? 'Verifying...' : 'Verify Emails'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Verification Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {verificationResults.length}
                </div>
                <p className="text-sm text-gray-500">Total Verified</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Valid</span>
                  </div>
                  <span className="font-bold text-green-600">{validCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Risky</span>
                  </div>
                  <span className="font-bold text-yellow-600">{riskyCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Invalid</span>
                  </div>
                  <span className="font-bold text-red-600">{invalidCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {batches && batches.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {batches.map((batch) => (
                    <div key={batch.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {batch.total_emails} emails
                        </span>
                        <Badge variant={batch.status === 'completed' ? 'default' : 'secondary'}>
                          {batch.status}
                        </Badge>
                      </div>
                      {batch.status === 'completed' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Valid: {batch.valid_emails} | Invalid: {batch.invalid_emails} | Risky: {batch.risky_emails}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {verificationResults.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Verification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {verificationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                    {result.reason && (
                      <span className="text-sm text-gray-500">{result.reason}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
