import { useSession, SessionType } from '@lens-protocol/react-web';
import toast from 'react-hot-toast';

type AuthStatus = 'anonymous' | 'authenticated' | 'unauthenticated';

export const useAuthStatus = () => {
    const { data: session, loading: sessionLoading, error: sessionError } = useSession();

    const getAuthStatus = (): AuthStatus => {
        if (!session) return 'unauthenticated';

        switch (session.type) {
            case SessionType.Anonymous:
                return 'anonymous';
            case SessionType.JustWallet:
            case SessionType.WithProfile:
                return 'authenticated';
            default:
                return 'unauthenticated';
        }
    };

    const requireAuth = (action: () => void) => {
        const status = getAuthStatus();
        if (status === 'authenticated') {
            action();
        } else if (status === 'anonymous') {
            toast.error('Anonymous users cannot perform this action. Please log in.');
        } else {
            toast.error('You must be logged in to perform this action.');
        }
    };

    return {
        authStatus: getAuthStatus(),
        requireAuth,
        sessionLoading,
        sessionError,
    };
};
