'use client';

import { useEffect } from 'react';

export function ViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    const key = `creto-view-${profileId}`;
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < 30 * 60 * 1000) return;
    const trackedAt = Date.now();
    sessionStorage.setItem(key, String(trackedAt));
    void fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, referrer: document.referrer || null }),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) sessionStorage.removeItem(key);
      })
      .catch(() => {
        sessionStorage.removeItem(key);
      });
  }, [profileId]);
  return null;
}
