import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SubscriptionButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
}) => {
  const { user } = useAuth();
  const { subscribed, loading, createCheckout } = useSubscription();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    try {
      await createCheckout();
      toast.success('Redirecting to checkout...');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start checkout process');
    }
  };

  if (loading) {
    return (
      <Button disabled variant={variant} size={size} className={className}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (subscribed) {
    return (
      <Button disabled variant="secondary" size={size} className={className}>
        <Crown className="w-4 h-4 mr-2 text-yellow-500" />
        Premium Active
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSubscribe}
      variant={variant}
      size={size}
      className={className}
    >
      <Crown className="w-4 h-4 mr-2" />
      Remove Ads - €1.99/month
    </Button>
  );
};