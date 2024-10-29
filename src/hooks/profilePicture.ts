import { useSession, SessionType, ProfilePictureSet } from '@lens-protocol/react-web';
import LOGO from "../../public/LOGO.svg"; // Ensure this path is correct

// Type guard for checking if the picture is of type ProfilePictureSet
const isProfilePictureSet = (picture: any): picture is ProfilePictureSet => {
    return picture?.__typename === "ImageSet";
};

export const useProfilePicture = () => {
    const { data: session } = useSession({ suspense: true });

    if (!session || session.type !== SessionType.WithProfile) {
        return LOGO; // Return default logo if session or profile picture is not available
    }

    // Check if the profile picture is available in metadata
    const picture = session.profile?.metadata?.picture;

    if (isProfilePictureSet(picture)) {
        // Return the URI from the image set
        return picture.optimized?.uri || LOGO;
    }

    // Return default logo if the picture type is unknown or not handled
    return LOGO;
};
