'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    const key = `creto-view-${profileId}`;
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < 30 * 60 * 1000) return;
    sessionStorage.setItem(key, String(Date.now()));
    void createClient().from('creto_page_views').insert({ profile_id: profileId, referrer: document.referrer || null });
  }, [profileId]);
  return null;
}
