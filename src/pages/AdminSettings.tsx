import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface ExtendedSettings {
  community_name: string;
  created_at: string;
  id: string;
  updated_at: string;
  narrow_layout?: boolean;
}

const AdminSettings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [communityName, setCommunityName] = useState("");
  const queryClient = useQueryClient();
  const [isNarrowLayout, setIsNarrowLayout] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_settings")
        .select("*")
        .single();

      if (error) throw error;
      const extendedData = data as ExtendedSettings;
      setCommunityName(extendedData.community_name);
      setIsNarrowLayout(extendedData.narrow_layout || false);
      return extendedData;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const updateSettings = async () => {
    const { error } = await supabase
      .from("community_settings")
      .update({ 
        community_name: communityName,
        narrow_layout: isNarrowLayout 
      })
      .eq("id", settings?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "Please try again later.",
      });
    } else {
      localStorage.setItem("isNarrowLayout", JSON.stringify(isNarrowLayout));
      toast({
        title: "Settings updated",
        description: "Community settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating user role",
        description: "Please try again later.",
      });
    } else {
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  };

  if (!user || profile?.role !== "admin") {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={signOut}
      />
      <MobileMenu isOpen={isMobileMenuOpen} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Community Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#222222]">
                    Community Name
                  </label>
                  <Input
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="narrow-layout"
                    checked={isNarrowLayout}
                    onCheckedChange={setIsNarrowLayout}
                  />
                  <Label htmlFor="narrow-layout" className="text-[#222222]">Enable Narrow Layout</Label>
                </div>
                <Button onClick={updateSettings}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium text-[#222222]">{user.email}</p>
                      <p className="text-sm text-[#222222]">Current role: {user.role}</p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant={user.role === "admin" ? "default" : "outline"}
                        onClick={() => updateUserRole(user.id, "admin")}
                      >
                        Admin
                      </Button>
                      <Button
                        variant={user.role === "board_member" ? "default" : "outline"}
                        onClick={() => updateUserRole(user.id, "board_member")}
                      >
                        Board Member
                      </Button>
                      <Button
                        variant={user.role === "member" ? "default" : "outline"}
                        onClick={() => updateUserRole(user.id, "member")}
                      >
                        Member
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
