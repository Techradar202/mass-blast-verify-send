
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailVerificationRequest {
  emails: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { emails }: EmailVerificationRequest = await req.json();

    // Create verification batch
    const { data: batch, error: batchError } = await supabaseClient
      .from('verification_batches')
      .insert({
        user_id: user.id,
        total_emails: emails.length,
        status: 'pending'
      })
      .select()
      .single();

    if (batchError) throw batchError;

    // Verify each email
    const verificationResults = [];
    for (const email of emails) {
      const result = await verifyEmail(email);
      
      const { error: insertError } = await supabaseClient
        .from('email_verifications')
        .insert({
          user_id: user.id,
          email: email,
          status: result.status,
          reason: result.reason,
          batch_id: batch.id
        });

      if (insertError) console.error('Error inserting verification:', insertError);
      verificationResults.push(result);
    }

    // Update batch statistics
    const validCount = verificationResults.filter(r => r.status === 'valid').length;
    const invalidCount = verificationResults.filter(r => r.status === 'invalid').length;
    const riskyCount = verificationResults.filter(r => r.status === 'risky').length;

    await supabaseClient
      .from('verification_batches')
      .update({
        status: 'completed',
        processed_emails: emails.length,
        valid_emails: validCount,
        invalid_emails: invalidCount,
        risky_emails: riskyCount,
        completed_at: new Date().toISOString()
      })
      .eq('id', batch.id);

    return new Response(JSON.stringify({ 
      batchId: batch.id, 
      results: verificationResults 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function verifyEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { email, status: 'invalid' as const, reason: 'Invalid format' };
  }

  // Simulate various email validation scenarios
  const random = Math.random();
  if (random > 0.85) {
    return { email, status: 'invalid' as const, reason: 'Domain not found' };
  } else if (random > 0.75) {
    return { email, status: 'risky' as const, reason: 'Disposable email provider' };
  } else if (random > 0.7) {
    return { email, status: 'risky' as const, reason: 'Role-based email' };
  } else {
    return { email, status: 'valid' as const, reason: 'Valid and deliverable' };
  }
}

serve(handler);
