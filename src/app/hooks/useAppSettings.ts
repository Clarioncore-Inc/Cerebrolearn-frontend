import { useEffect, useMemo, useState } from 'react';

import { appSettingsApi } from '../../../utils/api-client';
import type { AppSettings } from '../types/database';

const DEFAULT_APP_SETTINGS: AppSettings = {
  id: 'default-app-settings',
  app_name: 'CerebroLearn',
  logo: null,
  contacts: null,
  email: null,
  iq_test_price: 299,
  refresh_booking_in_minute: 5,
  psychologist_booking_reminder_in_minutes: 30,
  created_at: '',
  updated_at: '',
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSettings = async () => {
      try {
        const data = await appSettingsApi.getPublic();
        if (!isActive) {
          return;
        }

        setSettings({
          ...DEFAULT_APP_SETTINGS,
          ...data,
          iq_test_price: Number(data.iq_test_price ?? DEFAULT_APP_SETTINGS.iq_test_price),
          refresh_booking_in_minute: Number(
            data.refresh_booking_in_minute ?? DEFAULT_APP_SETTINGS.refresh_booking_in_minute,
          ),
          psychologist_booking_reminder_in_minutes: Number(
            data.psychologist_booking_reminder_in_minutes ??
              DEFAULT_APP_SETTINGS.psychologist_booking_reminder_in_minutes,
          ),
        });
      } catch (err) {
        if (!isActive) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load app settings.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const formattedIQTestPrice = useMemo(() => {
    const isWholeNumber = Number.isInteger(settings.iq_test_price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: isWholeNumber ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(settings.iq_test_price);
  }, [settings.iq_test_price]);

  return {
    settings,
    loading,
    error,
    iqTestPrice: settings.iq_test_price,
    formattedIQTestPrice,
  };
}