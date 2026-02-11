import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse body for options
  let options: any = {};
  try {
    if (req.method === "POST") {
      options = await req.json();
    }
  } catch { /* no body */ }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify caller is company admin
    const { data: { user } } = await anonClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: isAdmin } = await adminClient.from("company_admins").select("id").eq("user_id", user.id).maybeSingle();
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Not a company admin" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Gather all stats using service role
    const [
      projectsRes,
      membersRes,
      productsRes,
      categoriesRes,
      salesRes,
      saleItemsRes,
      limitsRes,
      profilesRes,
    ] = await Promise.all([
      adminClient.from("projects").select("id, name, owner_id, created_at"),
      adminClient.from("project_members").select("id, project_id, user_id, role"),
      adminClient.from("products").select("id, project_id, user_id, name, created_at"),
      adminClient.from("categories").select("id, project_id"),
      adminClient.from("sales").select("id, project_id, user_id, total, payment_method, created_at"),
      adminClient.from("sale_items").select("id, sale_id, quantity, subtotal"),
      adminClient.from("user_project_limits").select("user_id, max_projects"),
      adminClient.from("profiles").select("user_id, full_name"),
    ]);

    const projects = projectsRes.data || [];
    const members = membersRes.data || [];
    const products = productsRes.data || [];
    const categories = categoriesRes.data || [];
    const sales = salesRes.data || [];
    const saleItems = saleItemsRes.data || [];
    const limits = limitsRes.data || [];
    const profiles = profilesRes.data || [];

    // Profile map
    const profileMap: Record<string, string> = {};
    profiles.forEach((p: any) => { profileMap[p.user_id] = p.full_name || "Unknown"; });

    // Limit map
    const limitMap: Record<string, number> = {};
    limits.forEach((l: any) => { limitMap[l.user_id] = l.max_projects; });

    // Overall stats
    const totalRevenue = sales.reduce((sum: number, s: any) => sum + Number(s.total), 0);
    const totalItemsSold = saleItems.reduce((sum: number, si: any) => sum + si.quantity, 0);

    const overview = {
      total_projects: projects.length,
      total_users: new Set([...members.map((m: any) => m.user_id), ...projects.map((p: any) => p.owner_id)]).size,
      total_products: products.length,
      total_categories: categories.length,
      total_sales: sales.length,
      total_items_sold: totalItemsSold,
      total_revenue: totalRevenue,
      total_members: members.length,
    };

    // Per-project stats
    const projectStats = projects.map((proj: any) => {
      const projProducts = products.filter((p: any) => p.project_id === proj.id);
      const projCategories = categories.filter((c: any) => c.project_id === proj.id);
      const projSales = sales.filter((s: any) => s.project_id === proj.id);
      const projSaleIds = new Set(projSales.map((s: any) => s.id));
      const projSaleItems = saleItems.filter((si: any) => projSaleIds.has(si.sale_id));
      const projMembers = members.filter((m: any) => m.project_id === proj.id);
      const projRevenue = projSales.reduce((sum: number, s: any) => sum + Number(s.total), 0);
      const projItemsSold = projSaleItems.reduce((sum: number, si: any) => sum + si.quantity, 0);

      // Estimate data size (rough: ~200 bytes per product, ~100 per category, ~150 per sale, ~100 per sale_item)
      const estimatedSize = (projProducts.length * 200) + (projCategories.length * 100) + (projSales.length * 150) + (projSaleItems.length * 100);

      return {
        id: proj.id,
        name: proj.name,
        owner_id: proj.owner_id,
        owner_name: profileMap[proj.owner_id] || "Unknown",
        created_at: proj.created_at,
        products_count: projProducts.length,
        categories_count: projCategories.length,
        sales_count: projSales.length,
        items_sold: projItemsSold,
        revenue: projRevenue,
        members_count: projMembers.length,
        members: projMembers.map((m: any) => ({
          user_id: m.user_id,
          name: profileMap[m.user_id] || "Unknown",
          role: m.role,
        })),
        estimated_data_bytes: estimatedSize,
      };
    });

    // Per-user stats — include ALL users from limits + project owners
    const allUserIds = new Set([
      ...projects.map((p: any) => p.owner_id),
      ...limits.map((l: any) => l.user_id),
      ...members.map((m: any) => m.user_id),
    ]);
    const userStats = [...allUserIds].map((userId: string) => {
      const userProjects = projects.filter((p: any) => p.owner_id === userId);
      const userProjectIds = new Set(userProjects.map((p: any) => p.id));
      // Also include projects where user is a member
      const memberProjectIds = new Set(members.filter((m: any) => m.user_id === userId).map((m: any) => m.project_id));
      const allUserProjectIds = new Set([...userProjectIds, ...memberProjectIds]);
      const userProducts = products.filter((p: any) => allUserProjectIds.has(p.project_id));
      const userSales = sales.filter((s: any) => s.user_id === userId);
      const userSaleIds = new Set(userSales.map((s: any) => s.id));
      const userSaleItems = saleItems.filter((si: any) => userSaleIds.has(si.sale_id));
      const userRevenue = userSales.reduce((sum: number, s: any) => sum + Number(s.total), 0);
      const estimatedSize = (userProducts.length * 200) + (userSales.length * 150) + (userSaleItems.length * 100);

      // Get all projects this user is involved in (owner or member)
      const involvedProjects = projects.filter((p: any) => allUserProjectIds.has(p.id));

      return {
        user_id: userId,
        name: profileMap[userId] || "Unknown",
        projects_count: userProjects.length,
        member_of_count: memberProjectIds.size,
        max_projects: limitMap[userId] ?? 0,
        products_count: userProducts.length,
        sales_count: userSales.length,
        revenue: userRevenue,
        estimated_data_bytes: estimatedSize,
        projects: involvedProjects.map((p: any) => ({ id: p.id, name: p.name })),
        is_online: false, // placeholder for future live tracking
        last_active: null,
      };
    });

    // Build project name map
    const projectNameMap: Record<string, string> = {};
    projects.forEach((p: any) => { projectNameMap[p.id] = p.name; });

    // Include individual sales if requested
    let allSales: any[] | undefined;
    if (options.includeSales) {
      allSales = sales.map((s: any) => ({
        id: s.id,
        project_id: s.project_id,
        project_name: projectNameMap[s.project_id] || "Unknown",
        user_id: s.user_id,
        total: s.total,
        payment_method: (s as any).payment_method || "unknown",
        created_at: s.created_at,
      }));
    }

    return new Response(JSON.stringify({ overview, projectStats, userStats, ...(allSales ? { allSales } : {}) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
