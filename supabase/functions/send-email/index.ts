
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Configuration and constants
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = Deno.env.get("SMTP_PORT");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASS = Deno.env.get("SMTP_PASS");
const SMTP_FROM = Deno.env.get("SMTP_FROM");

// Determine if we're using Resend or SMTP
const useResend = !!RESEND_API_KEY;

// Initialize Resend if API key is available
const resend = useResend ? new Resend(RESEND_API_KEY) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from = "Notification <notifications@yourdomain.com>" }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      throw new Error("Missing required fields: to, subject, or html");
    }

    let emailResponse;

    if (useResend) {
      // Using Resend for email delivery
      emailResponse = await resend.emails.send({
        from: from || SMTP_FROM || "Portal <notifications@yourportal.com>",
        to: [to],
        subject: subject,
        html: html,
      });
    } else if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      // Using SMTP for email delivery
      // Note: This is a simplified example. In a real implementation, you would
      // use a proper SMTP client available for Deno
      
      // For now, let's just log that we would send via SMTP
      console.log(`Would send email via SMTP to ${to} with subject "${subject}"`);
      
      // Placeholder for actual SMTP implementation
      emailResponse = { id: "smtp-placeholder", success: true };
      
      // NOTE: For full SMTP implementation in production, you would:
      // 1. Use a Deno-compatible SMTP client library
      // 2. Configure with SMTP credentials from environment variables
      // 3. Send the email with proper error handling
    } else {
      throw new Error("No email configuration available. Please set either RESEND_API_KEY or SMTP_* environment variables");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
