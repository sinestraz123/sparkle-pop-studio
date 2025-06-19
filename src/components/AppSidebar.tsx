import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  BarChart3, 
  Bell,
  HelpCircle,
  Zap,
  CheckSquare,
  LogOut,
  CreditCard,
  FileQuestion,
  Video,
  MessageSquare,
  RectangleHorizontal,
  Target,
  Users
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PricingModal } from '@/components/PricingModal';

const mainItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
];

const engagementItems = [
  { title: 'Announcements', url: '/builder', icon: Plus },
  { title: 'Banner', url: '/banner', icon: RectangleHorizontal },
  { title: 'Spotlight', url: '/spotlight', icon: Target },
];

const interactionItems = [
  // { title: 'Checklist', url: '/checklist', icon: CheckSquare },
  // { title: 'Feedback', url: '/feedback', icon: MessageSquare },
];

const supportItems = [
  { title: 'Video Tutorials', url: '/video-tutorials', icon: Video },
];

const analyticsItems = [
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

const settingsItems = [
  { title: 'Settings', url: '/settings', icon: Settings },
  { title: 'Pricing', url: null, icon: CreditCard, action: 'pricing' },
  { title: 'Help', url: '/help', icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';
  const [userProfile, setUserProfile] = useState<{ full_name: string } | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.action === 'pricing') {
      setIsPricingOpen(true);
    }
  };

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
      : 'hover:bg-sidebar-accent/50';
  };

  const getUserDisplayName = () => {
    return userProfile?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const renderMenuGroup = (items: any[], groupLabel: string) => (
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild={!!item.url}
                onClick={!item.url ? () => handleItemClick(item) : undefined}
                className="hover:bg-sidebar-accent/50"
              >
                {item.url ? (
                  <NavLink to={item.url} className={getNavClassName(item.url)}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                ) : (
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <>
      <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="offcanvas">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
              <img 
                src="/lovable-uploads/1d9f0f79-340d-4623-89ab-1badcf771fe1.png" 
                alt="Likemetric Logo" 
                className="h-6 w-6 object-contain"
              />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Likemetric</h2>
                <p className="text-xs text-sidebar-foreground/60">User Engagement</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {renderMenuGroup(mainItems, 'Overview')}
          {renderMenuGroup(engagementItems, 'Engagement')}
          {renderMenuGroup(interactionItems, 'User Interaction')}
          {renderMenuGroup(supportItems, 'Support')}
          {renderMenuGroup(analyticsItems, 'Insights')}

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild={!!item.url}
                      onClick={!item.url ? () => handleItemClick(item) : undefined}
                      className="hover:bg-sidebar-accent/50"
                    >
                      {item.url ? (
                        <NavLink to={item.url} className={getNavClassName(item.url)}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      ) : (
                        <div className="flex items-center">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="hover:bg-sidebar-accent/50">
                    <LogOut className="h-4 w-4" />
                    {!collapsed && <span>Logout</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">{getUserInitials()}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || ''}</p>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      <PricingModal open={isPricingOpen} onOpenChange={setIsPricingOpen} />
    </>
  );
}
