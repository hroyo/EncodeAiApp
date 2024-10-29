// hooks/useUserProfileLink.js
import { useSession as useLensSession, SessionType, Profile } from "@lens-protocol/react-web";

export const useUserProfileLink = (): string | null => {
    const { data: session } = useLensSession();
    if (session?.type !== SessionType.WithProfile) {
        return null; // Return null if there's no profile
    }

    const profile = session.profile as Profile;
    const userHandle = profile?.handle?.fullHandle?.substring(5); // Remove 'lens/' part if it exists
    if (!userHandle) {
        console.warn("User handle is undefined");
        return null; // Return null if userHandle is undefined
    }

    return `/u/${userHandle}`;
};
