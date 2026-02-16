import React, { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, BookOpen, BarChart3, Settings, Menu, X, Building2, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { OrganizationDashboard } from './OrganizationDashboard';
import { TeamManagement } from './TeamManagement';
import { MemberManagement } from './MemberManagement';
import { OrganizationSettings } from './OrganizationSettings';
import { OrganizationAnalytics } from './OrganizationAnalytics';
import { TeamDashboard } from './TeamDashboard';
import { OrganizationCourses } from './OrganizationCourses';

interface OrganizationPortalProps {
  organizationId: string;
  userRole?: 'admin' | 'manager' | 'member';
}

export function OrganizationPortal({ organizationId, userRole = 'admin' }: OrganizationPortalProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'teams' | 'members' | 'courses' | 'analytics' | 'settings' | 'team-view'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data - replace with API calls
  const organizationInfo = {
    name: 'Acme Corporation',
    logo: null,
    plan: 'Enterprise',
    members: 247
  };

  const currentUser = {
    name: 'John Doe',
    email: 'john@acme.com',
    role: 'Organization Admin',
    avatar: 'JD'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
    { id: 'teams', label: 'Teams', icon: Briefcase, roles: ['admin', 'manager'] },
    { id: 'members', label: 'Members', icon: Users, roles: ['admin', 'manager'] },
    { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['admin', 'manager'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <OrganizationDashboard organizationId={organizationId} />;
      case 'teams':
        return <TeamManagement organizationId={organizationId} />;
      case 'members':
        return <MemberManagement organizationId={organizationId} />;
      case 'courses':
        return <OrganizationCourses organizationId={organizationId} />;
      case 'analytics':
        return <OrganizationAnalytics organizationId={organizationId} />;
      case 'settings':
        return <OrganizationSettings organizationId={organizationId} />;
      case 'team-view':
        return <TeamDashboard teamId="1" />;
      default:
        return <OrganizationDashboard organizationId={organizationId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } flex flex-col`}>
        {/* Organization Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#395192] rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{organizationInfo.name}</h2>
                <p className="text-xs text-gray-500">{organizationInfo.plan} Plan</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#395192] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-[#395192] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentUser.avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                      </div>
                      <div className="py-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <User className="w-4 h-4" />
                          View Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </button>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay (for collapsed sidebar on mobile) */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}
