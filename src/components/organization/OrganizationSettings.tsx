import React, { useState } from 'react';
import { Building2, Palette, CreditCard, Key, Globe, Upload, Save, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';

interface OrganizationSettingsProps {
  organizationId: string;
}

export function OrganizationSettings({ organizationId }: OrganizationSettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'billing' | 'integrations' | 'security'>('general');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Key }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Organization Settings</h1>
        <p className="text-gray-600">Manage your organization's configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#395192] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">General Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <Input
                      type="text"
                      defaultValue="Acme Corporation"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      defaultValue="contact@acme.com"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Finance</option>
                      <option>Retail</option>
                      <option>Manufacturing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>500+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://www.acme.com"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option>UTC (GMT+0:00)</option>
                      <option>EST (GMT-5:00)</option>
                      <option>PST (GMT-8:00)</option>
                      <option>CET (GMT+1:00)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Branding Settings */}
            {activeTab === 'branding' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Branding & Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px, PNG or SVG</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        defaultValue="#395192"
                        className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        type="text"
                        defaultValue="#395192"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Domain
                    </label>
                    <Input
                      type="text"
                      placeholder="learn.acme.com"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-2">Use your own domain for the learning portal</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Email Templates
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Include company logo in emails</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Use custom email footer</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                
                {/* Current Plan */}
                <div className="bg-gradient-to-br from-[#395192] to-[#4a63a8] p-6 rounded-lg text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">Enterprise Plan</h3>
                      <p className="text-blue-100 text-sm">300 licenses • Billed annually</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">$4,500</p>
                      <p className="text-blue-100 text-sm">/month</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-[#395192] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                      Upgrade Plan
                    </button>
                    <button className="flex-1 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                      View Invoices
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/2025</p>
                        </div>
                      </div>
                      <button className="text-[#395192] text-sm hover:underline">Update</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Email
                    </label>
                    <Input
                      type="email"
                      defaultValue="billing@acme.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Address
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="123 Business St&#10;San Francisco, CA 94105&#10;United States"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Notifications
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Send invoice receipts via email</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Notify before renewal</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Integrations</h2>
                <div className="space-y-4">
                  {/* SSO Integration */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Key className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Single Sign-On (SSO)</h3>
                          <p className="text-sm text-gray-500">SAML 2.0 authentication</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#395192]"></div>
                      </label>
                    </div>
                    <button className="text-[#395192] text-sm hover:underline">Configure SSO</button>
                  </div>

                  {/* Slack Integration */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Slack</h3>
                          <p className="text-sm text-gray-500">Get notifications in Slack</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>

                  {/* Microsoft Teams Integration */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Microsoft Teams</h3>
                          <p className="text-sm text-gray-500">Sync with Teams calendar</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>

                  {/* Theraships Integration */}
                  <div className="border-2 border-[#395192] rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#395192] rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Theraships</h3>
                          <p className="text-sm text-gray-600">Connect with your professional network</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Connected
                        </span>
                        <button className="px-4 py-2 bg-[#395192] text-white rounded-lg text-sm hover:bg-[#2d4178] transition-colors">
                          Configure
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Share achievements, sync profiles, and connect with your Theraships network
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Authentication
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Require two-factor authentication (2FA)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Force password reset every 90 days</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Enforce strong passwords</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option selected>1 hour</option>
                      <option>2 hours</option>
                      <option>Never</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Data & Privacy
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Enable audit logs</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">GDPR compliance mode</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">API Access</h3>
                    <p className="text-sm text-yellow-700 mb-3">Your organization API key (keep this secret)</p>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value="sk_live_••••••••••••••••••••••••••••"
                        readOnly
                        className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg bg-white"
                      />
                      <button className="px-4 py-2 border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}