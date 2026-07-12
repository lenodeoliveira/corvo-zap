import { useEffect, useRef, useState } from 'react';

import { computeLiveTracking, type LiveTracking } from '@/utils/message-tracking';

type UseLiveTrackingOptions = {
  departureAt: string;
  arrivalAt: string;
  distanceKm: number;
  onDelivered?: () => void;
};

export function useLiveTracking({
  departureAt,
  arrivalAt,
  distanceKm,
  onDelivered,
}: UseLiveTrackingOptions): LiveTracking {
  const onDeliveredRef = useRef(onDelivered);
  const hasNotifiedDeliveryRef = useRef(false);

  onDeliveredRef.current = onDelivered;

  const [tracking, setTracking] = useState(() =>
    computeLiveTracking(departureAt, arrivalAt, distanceKm),
  );

  useEffect(() => {
    hasNotifiedDeliveryRef.current = false;

    function tick() {
      const next = computeLiveTracking(departureAt, arrivalAt, distanceKm);
      setTracking(next);

      if (next.status === 'DELIVERED' && !hasNotifiedDeliveryRef.current) {
        hasNotifiedDeliveryRef.current = true;
        onDeliveredRef.current?.();
      }
    }

    tick();

    if (computeLiveTracking(departureAt, arrivalAt, distanceKm).status === 'DELIVERED') {
      return;
    }

    const intervalId = setInterval(tick, 1_000);

    return () => clearInterval(intervalId);
  }, [arrivalAt, departureAt, distanceKm]);

  return tracking;
}
