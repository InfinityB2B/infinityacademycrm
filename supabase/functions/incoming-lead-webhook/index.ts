import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Received webhook request:', req.method);

    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const body = await req.json();
    console.log('Received payload:', JSON.stringify(body));

    // Validate required fields
    const { name, email, phone, company, value } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: name and email are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstname = nameParts[0] || name;
    const lastname = nameParts.slice(1).join(' ') || nameParts[0];

    console.log('Creating contact with:', { firstname, lastname, email, phone, company });

    // Create or get contact
    const { data: existingContact, error: contactCheckError } = await supabase
      .from('contacts')
      .select('contactid')
      .eq('email', email)
      .maybeSingle();

    if (contactCheckError) {
      console.error('Error checking for existing contact:', contactCheckError);
      throw contactCheckError;
    }

    let contactId: string;

    if (existingContact) {
      contactId = existingContact.contactid;
      console.log('Using existing contact:', contactId);
    } else {
      // Create new contact (without user authentication)
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          firstname,
          lastname,
          email,
          phone: phone || null,
          company: company || null,
          isclient: false,
        })
        .select('contactid')
        .single();

      if (contactError) {
        console.error('Error creating contact:', contactError);
        throw contactError;
      }

      contactId = newContact.contactid;
      console.log('Created new contact:', contactId);
    }

    // Get the first stage of the first SALES pipeline
    const { data: salesPipeline, error: pipelineError } = await supabase
      .from('pipelines')
      .select('pipelineid, stages(stageid, stageorder)')
      .eq('pipelinetype', 'SALES')
      .order('createdat', { ascending: true })
      .limit(1)
      .single();

    if (pipelineError || !salesPipeline) {
      console.error('Error fetching pipeline:', pipelineError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No sales pipeline configured. Please create a sales pipeline first.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the first stage (sorted by stageorder)
    const stages = salesPipeline.stages as any[];
    if (!stages || stages.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Sales pipeline has no stages configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const firstStage = stages.sort((a, b) => a.stageorder - b.stageorder)[0];
    console.log('Using first stage:', firstStage.stageid);

    // Create the deal
    const dealTitle = `Lead: ${firstname} ${lastname}${company ? ` - ${company}` : ''}`;
    
    const { data: newDeal, error: dealError } = await supabase
      .from('deals')
      .insert({
        dealtitle: dealTitle,
        dealvalue: value ? parseFloat(value) : null,
        status: 'OPEN',
        contactid: contactId,
        stageid: firstStage.stageid,
        pipelineid: salesPipeline.pipelineid,
      })
      .select('dealid')
      .single();

    if (dealError) {
      console.error('Error creating deal:', dealError);
      throw dealError;
    }

    console.log('Successfully created deal:', newDeal.dealid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        dealId: newDeal.dealid,
        contactId: contactId,
        message: 'Lead received and deal created successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in incoming-lead-webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
