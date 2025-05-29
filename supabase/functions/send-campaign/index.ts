
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendCampaignRequest {
  campaignId: string;
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

    const { campaignId }: SendCampaignRequest = await req.json();

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select(`
        *,
        contact_lists!inner(
          contact_list_memberships(
            contacts(email, first_name, last_name, phone)
          )
        )
      `)
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError) throw campaignError;

    if (campaign.type === 'email') {
      await sendEmailCampaign(campaign, supabaseClient);
    } else if (campaign.type === 'sms') {
      await sendSMSCampaign(campaign, supabaseClient);
    }

    // Update campaign status
    await supabaseClient
      .from('campaigns')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    return new Response(JSON.stringify({ success: true }), {
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

async function sendEmailCampaign(campaign: any, supabaseClient: any) {
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
  
  const contacts = campaign.contact_lists.contact_list_memberships
    .map((membership: any) => membership.contacts)
    .filter((contact: any) => contact.email);

  let totalSent = 0;
  let delivered = 0;

  for (const contact of contacts) {
    try {
      await resend.emails.send({
        from: 'Campaign <noreply@yourdomain.com>',
        to: [contact.email],
        subject: campaign.subject,
        html: campaign.content.replace('{{first_name}}', contact.first_name || 'there')
      });
      
      totalSent++;
      delivered++;
      console.log(`Email sent successfully to ${contact.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${contact.email}:`, error);
      totalSent++;
    }
  }

  // Update analytics
  await supabaseClient
    .from('campaign_analytics')
    .insert({
      campaign_id: campaign.id,
      total_sent: totalSent,
      delivered: delivered
    });
}

async function sendSMSCampaign(campaign: any, supabaseClient: any) {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  const contacts = campaign.contact_lists.contact_list_memberships
    .map((membership: any) => membership.contacts)
    .filter((contact: any) => contact.phone);

  let totalSent = 0;
  let delivered = 0;

  // Create Twilio client credentials
  const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

  for (const contact of contacts) {
    try {
      // Personalize the SMS content
      const personalizedContent = campaign.content.replace('{{first_name}}', contact.first_name || 'there');
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: twilioPhoneNumber,
          To: contact.phone,
          Body: personalizedContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`SMS sent successfully to ${contact.phone}:`, result.sid);
        delivered++;
      } else {
        const error = await response.text();
        console.error(`Failed to send SMS to ${contact.phone}:`, error);
      }
      
      totalSent++;
    } catch (error) {
      console.error(`Failed to send SMS to ${contact.phone}:`, error);
      totalSent++;
    }
  }

  // Update analytics
  await supabaseClient
    .from('campaign_analytics')
    .insert({
      campaign_id: campaign.id,
      total_sent: totalSent,
      delivered: delivered
    });

  console.log(`SMS campaign completed. Total sent: ${totalSent}, Delivered: ${delivered}`);
}

serve(handler);
