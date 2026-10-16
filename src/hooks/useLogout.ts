import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * Leaves the signed-in part of the app for Sign In, clearing the history so Back can't return.
 * TODO(auth): also clear the session (tokens, cached profile) once the auth service exists.
 */
export function useLogout(): () => void {
  const navigation = useNavigation();
  return useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  }, [navigation]);
}
