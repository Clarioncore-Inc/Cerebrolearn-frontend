import React, { useState } from 'react';
import { DollarSign, CreditCard, Globe, AlertCircle, CheckCircle, Settings, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';

interface PaymentSettingsProps {
  userRole: 'admin' | 'creator';
}

export function PaymentSettings({ userRole }: PaymentSettingsProps) {
  const [activeTab, setActiveTab] = useState<'stripe' | 'flutterwave' | 'general' | 'payouts'>('general');
  const [stripeConnected, setStripeConnected] = useState(false);
  const [flutterwaveConnected, setFlutterwaveConnected] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Payment settings saved successfully!');
  };

  const handleConnectStripe = () => {
    // Simulate OAuth flow
    setTimeout(() => {
      setStripeConnected(true);
      toast.success('Stripe account connected successfully!');
    }, 1000);
  };

  const handleConnectFlutterwave = () => {
    // Simulate OAuth flow
    setTimeout(() => {
      setFlutterwaveConnected(true);
      toast.success('Flutterwave account connected successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: DollarSign },
    { id: 'stripe', label: 'Stripe', icon: CreditCard },
    { id: 'flutterwave', label: 'Flutterwave', icon: Globe },
    { id: 'payouts', label: 'Payouts', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Payment Settings</h1>
        <p className="text-gray-600">Configure payment providers and payout settings</p>
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
                <h2 className="font-semibold text-gray-900 mb-6">General Payment Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                    </select>
                  </div>

                  {userRole === 'admin' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platform Commission Rate (%)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue="15"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Percentage of revenue taken as platform fee from creators
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Payout Amount
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            placeholder="Minimum amount"
                            defaultValue="50"
                            className="flex-1"
                          />
                          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payout Schedule
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                          <option value="weekly">Weekly (every Monday)</option>
                          <option value="biweekly">Bi-weekly (1st and 15th)</option>
                          <option value="monthly">Monthly (1st of month)</option>
                          <option value="manual">Manual approval</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Accepted Payment Methods
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Credit/Debit Cards</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Mobile Money (Africa)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-4 h-4 text-[#395192] rounded" />
                        <DollarSign className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Bank Transfer</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Tax & Compliance
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Collect tax information from creators</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Apply VAT/Sales Tax</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-4 h-4 text-[#395192] rounded" />
                        <span className="text-sm text-gray-700">Generate 1099 forms (US only)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Stripe Settings */}
            {activeTab === 'stripe' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-1">Stripe Integration</h2>
                    <p className="text-sm text-gray-600">Connect your Stripe account for global payments</p>
                  </div>
                  {stripeConnected && (
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                  )}
                </div>

                {!stripeConnected ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-[#395192]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Connect Stripe</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Connect your Stripe account to accept payments from customers worldwide.
                      Stripe handles cards, wallets, and more.
                    </p>
                    <button
                      onClick={handleConnectStripe}
                      className="px-6 py-3 bg-[#635bff] text-white rounded-lg hover:bg-[#5347e8] transition-colors"
                    >
                      Connect with Stripe
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                      You'll be redirected to Stripe to complete the connection
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium text-green-900 mb-1">Stripe Connected</h3>
                          <p className="text-sm text-green-700">
                            Your Stripe account is connected and ready to accept payments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Account ID
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="acct_1234567890abcdef"
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('acct_1234567890abcdef');
                            toast.success('Copied to clipboard!');
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Keys
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Publishable Key</label>
                          <Input
                            type="text"
                            placeholder="pk_live_..."
                            className="w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Secret Key</label>
                          <Input
                            type="password"
                            placeholder="sk_live_..."
                            className="w-full text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Webhooks
                      </label>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Webhook Endpoint</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                        </div>
                        <code className="text-sm text-gray-600 bg-gray-50 p-2 rounded block mb-2">
                          https://cerebrolearn.com/api/webhooks/stripe
                        </code>
                        <p className="text-xs text-gray-500">
                          Listening for: payment_intent.succeeded, customer.subscription.updated
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View in Stripe Dashboard
                      </button>
                      <button
                        onClick={() => setStripeConnected(false)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Flutterwave Settings */}
            {activeTab === 'flutterwave' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-1">Flutterwave Integration</h2>
                    <p className="text-sm text-gray-600">Accept payments across Africa with mobile money & local cards</p>
                  </div>
                  {flutterwaveConnected && (
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                  )}
                </div>

                {!flutterwaveConnected ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Connect Flutterwave</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Accept payments via Mobile Money (M-Pesa, MTN, etc.), cards, and bank transfers
                      across 30+ African countries.
                    </p>
                    <button
                      onClick={handleConnectFlutterwave}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Connect with Flutterwave
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                      You'll be redirected to Flutterwave to complete the connection
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium text-green-900 mb-1">Flutterwave Connected</h3>
                          <p className="text-sm text-green-700">
                            Your Flutterwave account is connected and ready for African payments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Keys
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Public Key</label>
                          <Input
                            type="text"
                            placeholder="FLWPUBK_..."
                            className="w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Secret Key</label>
                          <Input
                            type="password"
                            placeholder="FLWSECK_..."
                            className="w-full text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Supported Payment Methods
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['M-Pesa', 'MTN Mobile Money', 'Airtel Money', 'Visa/Mastercard', 'Verve', 'Bank Transfer', 'USSD', 'Ghana Card'].map((method) => (
                          <div key={method} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Supported Countries
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Uganda', 'Tanzania', 'Rwanda', 'Zambia', 'Cameroon'].map((country) => (
                          <div key={country} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 text-center">
                            {country}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View in Flutterwave Dashboard
                      </button>
                      <button
                        onClick={() => setFlutterwaveConnected(false)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payout Settings */}
            {activeTab === 'payouts' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Payout Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Method
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option value="stripe">Stripe Direct Deposit</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="mobile">Mobile Money</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Details
                    </label>
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Bank Name"
                        className="w-full"
                      />
                      <Input
                        type="text"
                        placeholder="Account Number"
                        className="w-full"
                      />
                      <Input
                        type="text"
                        placeholder="Account Name"
                        className="w-full"
                      />
                      <Input
                        type="text"
                        placeholder="Routing Number (if applicable)"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Balance for Payout
                    </label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Payouts will only process when your balance reaches this amount
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Tax Information
                    </label>
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Tax ID / VAT Number"
                        className="w-full"
                      />
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                        <option value="">Select Tax Residency</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="NG">Nigeria</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900 mb-1">Important</h3>
                        <p className="text-sm text-blue-700">
                          Payout information must match your legal business/personal details.
                          Incorrect information may delay or prevent payouts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                  >
                    Save Payout Settings
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