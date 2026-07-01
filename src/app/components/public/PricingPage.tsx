import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  CheckCircle2,
  X,
  Zap,
  Crown,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Headphones,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      icon: Zap,
      color: 'from-gray-500 to-gray-600',
      price: {
        monthly: 0,
        annual: 0,
      },
      popular: false,
      cta: 'Get Started Free',
      features: [
        { name: 'Access to 50+ free courses', included: true },
        { name: 'Basic progress tracking', included: true },
        { name: 'Community forums', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Certificate of completion', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Offline downloads', included: false },
      ],
    },
    {
      name: 'Pro',
      description: 'For serious learners',
      icon: Crown,
      color: 'from-primary to-purple-600',
      price: {
        monthly: 29,
        annual: 290, // ~$24/month
      },
      popular: true,
      cta: 'Start Free Trial',
      features: [
        { name: 'Access to all 500+ courses', included: true },
        { name: 'Advanced progress tracking', included: true },
        { name: 'Professional certificates', included: true },
        { name: 'Personalized learning paths', included: true },
        { name: 'Advanced analytics & insights', included: true },
        { name: 'Offline course downloads', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Ad-free experience', included: true },
      ],
    },
    {
      name: 'Enterprise',
      description: 'For teams and organizations',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      price: {
        monthly: 'Custom',
        annual: 'Custom',
      },
      popular: false,
      cta: 'Contact Sales',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Unlimited team members', included: true },
        { name: 'Custom course creation', included: true },
        { name: 'Advanced team analytics', included: true },
        { name: 'SSO & SAML integration', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'SLA & priority support', included: true },
        { name: 'Custom integrations', included: true },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Pro plan comes with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'What happens when I cancel?',
      answer: 'You\'ll continue to have access until the end of your billing period. Your data is saved for 30 days if you decide to come back.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with your purchase.',
    },
    {
      question: 'Can I get a custom plan?',
      answer: 'Absolutely! Contact our sales team to discuss custom pricing for your organization\'s needs.',
    },
  ];

  const savings = billingCycle === 'annual' ? '17% savings' : null;

  return (
    <div className="min-h-screen py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-5xl font-bold mb-4">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready. All plans include a 30-day money-back guarantee.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as 'monthly' | 'annual')} className="w-auto">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">
                Annual
                {savings && (
                  <Badge className="ml-2 bg-green-500 text-white" variant="default">
                    Save 17%
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={plan.popular ? 'lg:-mt-4' : ''}
            >
              <Card className={`h-full relative ${plan.popular ? 'border-primary shadow-xl' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    {typeof plan.price[billingCycle] === 'number' ? (
                      <>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-5xl font-bold">
                            ${plan.price[billingCycle]}
                          </span>
                          <span className="text-muted-foreground">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </div>
                        {billingCycle === 'annual' && plan.price.annual > 0 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            ${Math.round(plan.price.annual / 12)}/month billed annually
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-4xl font-bold">{plan.price[billingCycle]}</div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Button 
                    className={`w-full mb-6 ${plan.popular ? 'bg-primary' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => onNavigate(plan.name === 'Enterprise' ? 'contact' : 'signup')}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Features</th>
                      <th className="text-center p-4">Free</th>
                      <th className="text-center p-4 bg-primary/5">Pro</th>
                      <th className="text-center p-4">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Courses Access</td>
                      <td className="text-center p-4">50+</td>
                      <td className="text-center p-4 bg-primary/5">500+</td>
                      <td className="text-center p-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Progress Tracking</td>
                      <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Certificates</td>
                      <td className="text-center p-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Analytics</td>
                      <td className="text-center p-4">Basic</td>
                      <td className="text-center p-4 bg-primary/5">Advanced</td>
                      <td className="text-center p-4">Enterprise</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Support</td>
                      <td className="text-center p-4">Community</td>
                      <td className="text-center p-4 bg-primary/5">Email</td>
                      <td className="text-center p-4">Dedicated</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Team Members</td>
                      <td className="text-center p-4">1</td>
                      <td className="text-center p-4 bg-primary/5">1</td>
                      <td className="text-center p-4">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="grid gap-6 md:grid-cols-4 mb-20">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">256-bit SSL encryption</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-1">30-Day Guarantee</h4>
              <p className="text-sm text-muted-foreground">Money-back promise</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Headphones className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-1">Cancel Anytime</h4>
              <p className="text-sm text-muted-foreground">No long-term contracts</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our team is here to help you choose the right plan
          </p>
          <Button size="lg" onClick={() => onNavigate('contact')}>
            Contact Sales
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
