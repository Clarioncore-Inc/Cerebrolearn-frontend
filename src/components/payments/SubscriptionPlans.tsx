import React, { useState } from 'react';
import { Check, X, Plus, Edit, Trash2, Crown, Users, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';

interface SubscriptionPlansProps {
  userRole: 'admin' | 'student' | 'creator';
  viewMode?: 'admin' | 'public';
}

export function SubscriptionPlans({ userRole, viewMode = 'public' }: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      color: 'gray',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        { name: 'Access to 5 courses', included: true },
        { name: 'Basic progress tracking', included: true },
        { name: 'Community forums', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Certificate of completion', included: false },
        { name: 'Priority support', included: false },
        { name: 'Offline downloads', included: false },
        { name: 'Advanced analytics', included: false }
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      color: 'blue',
      price: { monthly: 19, annual: 190 },
      description: 'For serious learners',
      features: [
        { name: 'Unlimited course access', included: true },
        { name: 'Advanced progress tracking', included: true },
        { name: 'Priority community access', included: true },
        { name: 'Mobile & tablet apps', included: true },
        { name: 'Certificate of completion', included: true },
        { name: 'Email support', included: true },
        { name: 'Offline downloads', included: true },
        { name: 'Advanced analytics', included: false }
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      color: 'purple',
      price: { monthly: 49, annual: 490 },
      description: 'For power users & teams',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Team collaboration tools', included: true },
        { name: '1-on-1 mentorship sessions', included: true },
        { name: 'Custom learning paths', included: true },
        { name: 'Verified certificates', included: true },
        { name: 'Priority support (24/7)', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced analytics', included: true }
      ],
      popular: false,
      cta: 'Go Premium'
    }
  ];

  const enterprisePlans = [
    {
      id: 'team',
      name: 'Team',
      seats: '5-20 seats',
      price: 15,
      perSeat: true,
      features: [
        'All Premium features',
        'Team management dashboard',
        'Bulk user provisioning',
        'Usage analytics',
        'Dedicated support'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      seats: '21-100 seats',
      price: 12,
      perSeat: true,
      features: [
        'Everything in Team',
        'SSO (SAML)',
        'Custom branding',
        'Advanced reporting',
        'API access',
        'Account manager'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      seats: '100+ seats',
      price: 'Custom',
      perSeat: false,
      features: [
        'Everything in Business',
        'Custom integrations',
        'On-premise deployment option',
        'SLA guarantee',
        'Dedicated infrastructure',
        'White-label option'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    toast.success(`Selected ${planId} plan!`);
  };

  const handleCreatePlan = () => {
    toast.success('New plan created!');
    setShowCreateModal(false);
  };

  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Admin View - Manage Plans */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Subscription Plans</h1>
            <p className="text-gray-600">Create and manage subscription tiers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Plan
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Total Subscribers</p>
            <p className="text-2xl font-bold text-gray-900">2,847</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$45,230</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">8.2%</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Churn Rate</p>
            <p className="text-2xl font-bold text-gray-900">3.1%</p>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Active Plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {React.createElement(plan.icon, { className: 'w-5 h-5 text-gray-600' })}
                        <span className="font-medium text-gray-900">{plan.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ${plan.price.monthly}/mo
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Math.floor(Math.random() * 1000 + 100)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      ${(Math.floor(Math.random() * 10000 + 5000)).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Plan Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Create New Plan</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                  <Input
                    type="text"
                    placeholder="e.g., Professional Plan"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Brief description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="29.99"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Price</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="299.99"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="flex-1 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Public View - For Students
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock unlimited learning with our flexible plans
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#395192] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-[#395192] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual;
            const savings = billingCycle === 'annual' ? Math.round((plan.price.monthly * 12 - plan.price.annual) / (plan.price.monthly * 12) * 100) : 0;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 ${
                  plan.popular ? 'border-[#395192] shadow-xl scale-105' : 'border-gray-200'
                } p-8 transition-all hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#395192] text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${plan.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 text-${plan.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-gray-900">${price}</span>
                    {price > 0 && (
                      <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                  {billingCycle === 'annual' && savings > 0 && (
                    <p className="text-sm text-green-600">Save {savings}% annually</p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors mb-6 ${
                    plan.popular
                      ? 'bg-[#395192] text-white hover:bg-[#2d4178]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Plans */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Solutions</h2>
            <p className="text-gray-600">Scalable plans for teams and organizations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enterprisePlans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.seats}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.perSeat && <span className="text-gray-600">/seat/mo</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 border-2 border-[#395192] text-[#395192] rounded-lg hover:bg-blue-50 transition-colors">
                  {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have questions?</h2>
          <p className="text-gray-600 mb-6">Check out our <a href="/faq" className="text-[#395192] hover:underline">FAQ page</a> or contact our sales team</p>
          <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}