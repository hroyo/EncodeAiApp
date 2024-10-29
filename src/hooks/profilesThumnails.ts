// profileHelpers.ts

import { ProfilePictureSet } from '@lens-protocol/react-web'; // Adjust the import based on your project structure

// Type guard to check if picture is of type ProfilePictureSet
export const isProfilePictureSet = (picture: any): picture is ProfilePictureSet => {
    return picture?.__typename === "ImageSet";
};

// Helper function to get the thumbnail URI
export const getThumbnailUri = (picture: any): string | undefined => {
    if (isProfilePictureSet(picture) && picture.thumbnail?.uri) {
        return picture.thumbnail.uri;
    }
    return undefined;
}

export const getOptimizedUri = (picture: any): string | undefined => {
    if (isProfilePictureSet(picture) && picture.optimized?.uri) {
        return picture.optimized.uri;
    }
    return undefined;
}