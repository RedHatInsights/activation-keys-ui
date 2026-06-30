import { useQuery } from '@tanstack/react-query';
import { useAuthenticateUser } from '../utils/platformServices';

const useUser = () => {
  const authenticateUser = useAuthenticateUser();

  return useQuery({
    queryKey: ['user'],
    queryFn: () =>
      Promise.all([authenticateUser]).then(([userStatus]) => ({
        accountNumber: userStatus?.data.identity?.account_number,
        orgId: userStatus?.data.identity?.internal?.org_id,
      })),
  });
};

export default useUser;
