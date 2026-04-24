import { useAuth } from '@/hooks';

export const useNavbarUI = () => {
  const { user } = useAuth();

  return {
    displayName: user?.player?.display_name || user?.username,
  };
};
