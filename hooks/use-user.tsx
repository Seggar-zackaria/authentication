"use client"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react";

// Create a module-level variable to store the latest avatar URL
// This allows different components to share the same updated avatar URL
let latestAvatarUrl: string | null = null;

export const useUser = () => {
    const session = useSession();
    const userSession = session.data?.user;
    const [localImageUrl, setLocalImageUrl] = useState<string | null>(
        latestAvatarUrl || userSession?.image || null
    );

    // If the session image changes, update our local state
    if (userSession?.image && userSession.image !== localImageUrl && !latestAvatarUrl) {
        setLocalImageUrl(userSession.image);
        latestAvatarUrl = userSession.image;
    }

    // Function to refresh only the session data when needed
    const refreshUserData = useCallback(() => {
        session.update();
    }, [session]);

    // Function to update just the avatar image without a full session refresh
    const updateAvatar = useCallback((newImageUrl: string | null) => {
        setLocalImageUrl(newImageUrl);
        latestAvatarUrl = newImageUrl;
    }, []);

    return {
        ...userSession,
        // Override the image with our locally managed one
        image: localImageUrl,
        refreshUserData,
        updateAvatar,
        isLoading: session.status === "loading",
    };
}


