import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SubscriptionButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const { user } = useAuth();
  const { subscriptionData, loading, createCheckout, openCustomerPortal } = useSubscription();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    try {
      await createCheckout();
      toast.success('Redirecting to checkout...');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout');
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
      toast.success('Opening subscription management...');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to open customer portal');
    }
  };

  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (subscriptionData.subscribed) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        onClick={handleManageSubscription}
      >
        <Crown className="w-4 h-4 mr-2 text-yellow-500" />
        Manage Premium
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSubscribe}
    >
      <Crown className="w-4 h-4 mr-2" />
      Remove Ads - €1.99/month
    </Button>
  );
};