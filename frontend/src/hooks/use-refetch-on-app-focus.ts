import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useRefetchOnAppFocus(refetch: () => void) {
  useEffect(() => {
    function handleAppStateChange(state: AppStateStatus) {
      if (state === 'active') {
        refetch();
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [refetch]);
}
