// Supabase Edge Function: gemini-proxy
//
// Server-side proxy for Google Gemini calls. The API key lives in the
// `GEMINI_API_KEY` function secret and never leaves the server, so the
// browser bundle no longer contains or stores it.
//
// Deploy:
//   supabase functions deploy gemini-proxy
//   supabase secrets set GEMINI_API_KEY=<your-google-ai-studio-key>
//
// Auth: requires a valid Supabase JWT whose profile row has role
// 'Administrator'. Everyone else is rejected with 403.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-3.5-flash",
  "gemini-3-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-3.1-flash-live-preview",
  "gemini-2.5-flash-live",
  "gemini-2.5-pro",
  "gemini-3.1-pro-preview",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server is missing GEMINI_API_KEY secret" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const token = authHeader.slice("Bearer ".length);
  const { data: claimData, error: claimError } = await supabase.auth.getClaims(
    token,
  );
  if (claimError || !claimData?.claims?.sub) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userId = claimData.claims.sub as string;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || profile?.role !== "Administrator") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { prompt?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  if (!prompt || prompt.length > 8000) {
    return new Response(
      JSON.stringify({ error: "prompt must be a non-empty string ≤ 8000 chars" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  for (const model of MODELS) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 },
          }),
        },
      );

      if (!resp.ok) continue;
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return new Response(
          JSON.stringify({ text, model }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    } catch (_err) {
      // try next model
    }
  }

  return new Response(
    JSON.stringify({ error: "All Gemini models failed" }),
    {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});