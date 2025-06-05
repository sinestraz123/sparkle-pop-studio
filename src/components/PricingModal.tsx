
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "per month",
    description: "Perfect for getting started",
    features: [
      "1 announcement",
      "1 checklist"
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    popular: false,
    isDefault: true
  },
  {
    name: "Standard",
    price: "$5",
    period: "per month",
    description: "Unlimited announcements and checklists",
    features: [
      "Unlimited announcements",
      "Unlimited checklists"
    ],
    buttonText: "Buy Now",
    buttonVariant: "default" as const,
    popular: true,
    available: true
  },
  {
    name: "Pro",
    price: "$20",
    period: "per month",
    description: "Everything plus advanced features",
    features: [
      "Unlimited announcements",
      "Unlimited checklists",
      "Banners",
      "Tooltips", 
      "Survey",
      "News items",
      "And more"
    ],
    buttonText: "Coming Soon",
    buttonVariant: "secondary" as const,
    popular: false,
    comingSoon: true
  }
];

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-8">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant={plan.buttonVariant}
                  className="w-full mt-6"
                  disabled={plan.comingSoon || plan.isDefault}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            All plans include support and regular updates
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
