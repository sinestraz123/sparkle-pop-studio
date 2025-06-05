
import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "1 Announcement",
        "1 Checklist",
        "Basic analytics",
        "Email support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      popular: false,
      disabled: true
    },
    {
      name: "Pro",
      price: "$5",
      period: "per month",
      description: "Everything you need to engage users",
      features: [
        "Unlimited Announcements",
        "Unlimited Checklists", 
        "Advanced analytics",
        "Priority support",
        "Custom styling",
        "A/B testing"
      ],
      buttonText: "Get Pro",
      buttonVariant: "default" as const,
      popular: true,
      disabled: false
    },
    {
      name: "Enterprise",
      price: "$20",
      period: "per month",
      description: "Advanced features for growing teams",
      features: [
        "Everything in Pro",
        "Banners & Tooltips",
        "Surveys & Forms", 
        "News Items",
        "Advanced targeting",
        "Team collaboration",
        "White-label options",
        "Custom integrations"
      ],
      buttonText: "Coming Soon",
      buttonVariant: "outline" as const,
      popular: false,
      disabled: true,
      comingSoon: true
    }
  ];

  const handleProPlanClick = () => {
    // This will be connected to Stripe later
    console.log('Pro plan selected');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg scale-105' : 'border border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <CardDescription className="text-base mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : plan.comingSoon 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : ''
                  }`}
                  disabled={plan.disabled}
                  onClick={plan.name === 'Pro' ? handleProPlanClick : undefined}
                >
                  {plan.comingSoon && (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {plan.buttonText}
                </Button>
              </div>

              {plan.comingSoon && (
                <p className="text-xs text-gray-500 text-center">
                  More features coming soon!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Can I change plans anytime?
            </h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600">
              The Free plan lets you test our core features. No credit card required.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-gray-600">
              Yes, we offer a 30-day money-back guarantee for all paid plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
