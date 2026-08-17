import { createContext } from "react";
import { Cities } from "./CitiesProvider";

// * defining the context for cities
// * this context will be used to provide the cities data to the components
export const CitiesContext = createContext<null | {
    loading: boolean;
    // cities: null | Cities[];
    cities: Cities[];
    currentCity: null | Cities;
    error: string;
    getCity: (id: string) => void;
    createCity: (newCity: {
        cityName: string;
        country: string;
        emoji: string;
        date: Date | null | undefined;
        notes: string;
        position: { lat: number | undefined; lng: number | undefined };
    }) => void;
    deleteCity: (id: string) => void;
}>(null);
