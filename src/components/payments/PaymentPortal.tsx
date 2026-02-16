import React, { useState } from 'react';
import { CreditCard, DollarSign, BarChart3, FileText, RefreshCw, Settings } from 'lucide-react';
import { PaymentSettings } from './PaymentSettings';
import { SubscriptionPlans } from './SubscriptionPlans';
import { CreatorPayouts } from './CreatorPayouts';
import { RevenueAnalytics } from './RevenueAnalytics';
import { RefundManager } from './RefundManager';

interface PaymentPortalProps {
  userRole: 'admin' | 'creator';
}

export function PaymentPortal({ userRole }: PaymentPortalProps) {
  const [activeView, setActiveView] = useState<'overview' | 'settings' | 'plans' | 'payouts' | 'analytics' | 'refunds'>('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'plans', label: 'Subscription Plans', icon: CreditCard },
    { id: 'payouts', label: 'Payouts', icon: DollarSign, role: ['creator', 'admin'] },
    { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
    { id: 'refunds', label: 'Refunds', icon: RefreshCw, role: ['admin'] }
  ];

  const filteredMenu = menuItems.filter(item => 
    !item.role || item.role.includes(userRole)
  );

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <PaymentSettings userRole={userRole} />;
      case 'plans':
        return <SubscriptionPlans userRole={userRole} viewMode="admin" />;
      case 'payouts':
        return <CreatorPayouts creatorId="1" />;
      case 'analytics':
        return <RevenueAnalytics userRole={userRole} />;
      case 'refunds':
        return <RefundManager userRole={userRole} />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="mb-8">Payment Overview</h1>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$124,580</p>
                <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900">2,847</p>
                <p className="text-sm text-green-600 mt-2">+234 this month</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Pending Payouts</p>
                <p className="text-3xl font-bold text-gray-900">$18,450</p>
                <p className="text-sm text-gray-600 mt-2">Next payout: Dec 15</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Refund Rate</p>
                <p className="text-3xl font-bold text-gray-900">2.3%</p>
                <p className="text-sm text-green-600 mt-2">Below industry avg</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredMenu.slice(1).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as any)}
                    className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-[#395192] hover:bg-blue-50 transition-all text-left"
                  >
                    <Icon className="w-8 h-8 text-[#395192] mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-600">Manage {item.label.toLowerCase()}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Payment Portal</h2>
          <p className="text-sm text-gray-500">{userRole === 'admin' ? 'Administrator' : 'Creator'}</p>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-[#395192] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
