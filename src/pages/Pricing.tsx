
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pricing Plans</h1>
        <p className="text-muted-foreground mt-1">Choose the perfect plan for your needs. Upgrade or downgrade at any time.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-2 border-green-500 shadow-lg' : ''} hover:shadow-md transition-shadow`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="mt-3">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <CardDescription className="text-sm mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="pt-3">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : plan.comingSoon 
                        ? 'text-muted-foreground cursor-not-allowed'
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
                <p className="text-xs text-muted-foreground text-center">
                  More features coming soon!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-sm text-muted-foreground">
                  The Free plan lets you test our core features. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee for all paid plans.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
