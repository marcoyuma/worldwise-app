import { useState } from "react";

export const useGeolocate = (
    defaultPosition: null | { lat?: number; lng?: number } = null
) => {
    const [position, setPosition] = useState<null | {
        lat?: number;
        lng?: number;
    }>(defaultPosition);
    const [error, setError] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const { lat, lng } = position;

    function getPosition() {
        // setCountClicks((count) => count + 1);

        if (!navigator.geolocation)
            return setError("Your browser does not support geolocation");

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                setError(error.message);
                setIsLoading(false);
            }
        );
    }

    return { position, error, isLoading, getPosition };
};
