
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExtendedSettings {
  community_name: string;
  subtitle: string;
  created_at: string;
  id: string;
  updated_at: string;
  narrow_layout?: boolean;
}

export const CommunityBranding = () => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as ExtendedSettings;
    },
  });

  const communityName = settings?.community_name || "Community Bulletin Board";
  const communitySubtitle = settings?.subtitle || "Your Source for Local Updates and Announcements";

  return (
    <Link to="/" className="flex flex-col">
      <h1 className="text-xl font-serif font-bold text-[#222222]">
        {communityName}
      </h1>
      <p className="text-xs text-gray-500">{communitySubtitle}</p>
    </Link>
  );
};
