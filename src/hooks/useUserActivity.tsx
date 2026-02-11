import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";

const ACTIVITY_INTERVAL_MS = 45_000;

export const useUserActivity = () => {
  const { user } = useAuth();
  const { projectId, role } = useProject();

  useEffect(() => {
    if (!user || !projectId || !role) return;

    let cancelled = false;

    const ping = async () => {
      if (!user || !projectId || !role || cancelled) return;

      await supabase
        .from("user_activity")
        .upsert(
          {
            user_id: user.id,
            project_id: projectId,
            role,
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: "user_id,project_id" },
        );
    };

    // Initial ping
    ping();

    const id = setInterval(ping, ACTIVITY_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [user, projectId, role]);
};

