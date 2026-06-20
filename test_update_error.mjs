const SUPABASE_URL = "https://mpiakcxihomgnbexcvxz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waWFrY3hpaG9tZ25iZXhjdnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODgxMTEsImV4cCI6MjA5NzI2NDExMX0.XXcA5iaPeVmA00fFmBQ7bJt5rrIepDpYkqfMtPsjHlA";

async function testUpdate() {
  console.log("Testing fallback profile update...");
  
  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.00000000-0000-0000-0000-000000000000`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      description: "test",
      website: "test",
      logo: "test"
    })
  });
  
  const updateJson = await updateRes.json();
  if (!updateRes.ok) {
    console.error("Profile update failed:", updateJson);
  } else {
    console.log("Profile update succeeded:", updateJson);
  }

  console.log("\nTesting RPC admin_update_user...");
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_update_user`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      target_user_id: "00000000-0000-0000-0000-000000000000",
      new_email: "test@example.com",
      new_password: "password",
      new_role: "Medlem",
      new_name: "Test Name",
      new_phone: "",
      new_company: "",
      new_org_nr: "",
      new_unit: "",
      new_address: "",
      new_description: "",
      new_website: "",
      new_logo: ""
    })
  });

  const rpcJson = await rpcRes.json();
  if (!rpcRes.ok) {
    console.error("RPC failed:", rpcJson);
  } else {
    console.log("RPC succeeded:", rpcJson);
  }
}

testUpdate();
