import { useState } from 'react';

import { toast } from 'sonner';

import { paymentsApi } from '../../../utils/api-client';
import { useAuth } from '../contexts/AuthContext';

type NavigateHandler = (page: string, data?: any) => void;

export function useIQTestCheckout(onNavigate?: NavigateHandler) {
  const { user } = useAuth();
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  const startCheckout = async (intent?: string) => {
    if (!user) {
      onNavigate?.('iq-test-signup');
      return false;
    }

    sessionStorage.setItem('cerebrolearn.user.intent', 'iq-only');
    setIsStartingCheckout(true);

    try {
      const session = await paymentsApi.createIQTestCheckoutSession({
        cancel_path: window.location.pathname,
        ...(intent ? { intent } : {}),
      });
      window.location.assign(session.checkout_url);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to start checkout.');
      return false;
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return {
    isAuthenticated: Boolean(user),
    isStartingCheckout,
    startCheckout,
  };
}