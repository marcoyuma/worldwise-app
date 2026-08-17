import { useSearchParams } from "react-router-dom";

export const useUrlPosition = () => {
    // useSearchParams is a React Router hook used to fetch, update, and manage query parameters in a URL.
    // usually used for filtering
    // in our app case, we stored our data in the url
    const [searchParams] = useSearchParams();

    // "get" method for getting the string name in argument properties. in below case is "lat" and "lng"
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));

    return [lat, lng];
};
