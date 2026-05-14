import { useAuthContext } from '@/context';

export const useNavbarUI = () => {
  const { user } = useAuthContext();

  return {
    displayName: user?.player?.display_name || user?.username,
  };
};
