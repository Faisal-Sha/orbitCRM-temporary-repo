
import { Link } from "react-router-dom";
import { Bell, User, MessageCircle, Bot, Phone, Mail, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BreadcrumbNav from "./BreadcrumbNav";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TopNavbar = () => {
  const [selectedOrg, setSelectedOrg] = useState("Owner");

  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_organizations')
        .select('id, organization_name')
        .eq('is_deleted', false);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owner">Owner</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.organization_name}>
                  {org.organization_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <BreadcrumbNav />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled className="relative">
            <Bot className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <Phone className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <Mail className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <Calendar className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <User className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled className="relative">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
