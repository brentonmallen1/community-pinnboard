import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [communityName, setCommunityName] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_settings")
        .select("*")
        .single();

      if (error) throw error;
      setCommunityName(data.community_name);
      return data;
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
      .update({ community_name: communityName })
      .eq("id", settings?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "Please try again later.",
      });
    } else {
      toast({
        title: "Settings updated",
        description: "Community settings have been updated successfully.",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
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
                  <label className="block text-sm font-medium mb-1">
                    Community Name
                  </label>
                  <Input
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                  />
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
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-500">Current role: {user.role}</p>
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