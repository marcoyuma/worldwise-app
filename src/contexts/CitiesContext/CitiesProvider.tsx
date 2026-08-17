import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { CitiesContext } from "./CitiesContext";

// export const CitiesContext = createContext<null | InitialState>(null);

// cities type
export interface Cities {
    cityName: string;
    country: string;
    emoji: string;
    date: string;
    notes: string;
    position: {
        lat: number;
        lng: number;
    };
    id: string;
}

// initialState type
export interface InitialState {
    // state for storing cities object
    // cities: null | Cities[];
    cities: Cities[];
    // state for storing loading status value in sync with the data
    loading: boolean;
    // state for storing the city currently clicked on the map
    currentCity: null | Cities;
    // state for storing string of error string
    error: string;
}

// define explicitly the Action option
export type ActionType =
    | { type: "CITIES/LOADED"; payload: Cities[] }
    | { type: "CITY/LOADED"; payload: Cities }
    | { type: "CITY/CREATED"; payload: Cities }
    | { type: "CITY/DELETED"; payload: string }
    | { type: "REJECTED"; payload: string }
    | { type: "LOADING" };

const initialState: InitialState = {
    cities: [],
    loading: false,
    currentCity: null,
    error: "",
};
const reducer = (state: InitialState, action: ActionType) => {
    switch (action.type) {
        case "CITIES/LOADED":
            return {
                ...state,
                cities: action.payload,
                loading: false,
            };
        case "CITY/LOADED":
            return {
                ...state,
                currentCity: action.payload,
                loading: false,
            };
        case "CITY/CREATED":
            return {
                ...state,

                // the "state.cities" is define with "null | Cities" which we must give an validation if the value is null by adding "[]" if it's null on the nullish coalescing. (2) but since i refactor the type so the validation shouldn't be mind
                // nully validation, when it's true then the previous value "...cities" + "data" is become the value
                cities: state.cities
                    ? [...state.cities, action.payload]
                    : [action.payload], // nullish coalescing
                loading: false,
            };
        case "CITY/DELETED":
            return {
                ...state,
                // validation if there's no data on the "state.cities"
                cities: state.cities
                    ? state.cities.filter((city) => city.id !== action.payload)
                    : [],
                loading: false,
                currentCity: null,
            };
        // case when fail to fetching
        case "REJECTED":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "LOADING":
            return {
                ...state,
                loading: true,
            };

        default:
            throw new Error(`unhandled action type ${action}`);
    }
};

// ! in the real life app never ever do this
// base url for receiving fake api
const BASE_URL = "http://localhost:8001";

// the provider component to provide the context to the child components
// this component will be used to wrap the child components that need the context
// the "children" prop is the child component that will be wrapped by this provider
// the "children" prop is a ReactNode type which can be any valid React element
// this is the main component that will be used to provide the context to the child components
// the "children" prop is a ReactNode type which can be any valid React element
export const CitiesProvider = ({ children }: { children: ReactNode }) => {
    // destructuring the main state
    const [{ cities, loading, currentCity, error }, dispatch] = useReducer(
        reducer,
        initialState,
    );
    useEffect(() => {
        const fetchCities = async () => {
            dispatch({ type: "LOADING" });
            try {
                const respons = await fetch(`${BASE_URL}/cities`);
                const data: Cities[] = await respons.json();
                dispatch({
                    type: "CITIES/LOADED",
                    // data here is a "Cities[]" object array
                    payload: data,
                });
            } catch {
                dispatch({
                    type: "REJECTED",
                    payload: "there's unknown error while fetching cities...",
                });
            }
        };
        fetchCities();
    }, []);

    /**
     * useCallback is used here to memoize the getCity function,
     * preventing unnecessary re-creations of the function on each render
     * unless its dependencies change.
     *
     * Why we use an arrow function here instead of a function declaration:
     *
     * - Arrow functions are anonymous, which means they don’t need to be
     *   explicitly named within the useCallback. The variable name (`getCity`)
     *   is already sufficient as the function's identifier.
     *
     * - Function declarations (e.g., `function getCity(id) {}`) require
     *   a name internally, even when used inside useCallback. Declaring
     *   the same name twice (once for the function and once for the variable)
     *   becomes redundant and verbose.
     *
     * - Arrow functions are cleaner and more concise, making them the preferred
     *   choice in React functional components, especially when passing functions
     *   to hooks like useCallback.
     *
     * Summary:
     * ✅ use arrow functions with useCallback for clarity and simplicity.
     * ⚠️ avoid function declarations inside useCallback unless there's a
     *     specific need (e.g., recursion or named function for debugging).
     */
    const getCity = useCallback(
        // const getCity =
        async (id: string) => {
            // validation taken for if id is the same as the "currentCity" object "id" property
            if (id === currentCity?.id) return;

            dispatch({ type: "LOADING" });
            try {
                console.log(id, currentCity?.id);
                console.log(currentCity);
                const respons = await fetch(`${BASE_URL}/cities/${id}`);
                const data: Cities = await respons.json();
                console.log(data);

                dispatch({
                    type: "CITY/LOADED",
                    // data here is a "Cities" object
                    payload: data,
                });
            } catch {
                dispatch({
                    type: "REJECTED",
                    payload: "there's unknown error while fetching cities...",
                });
            }
        },
        [currentCity],
    );

    // async function to create a city from the form user input
    const createCity = async (newCity: {
        cityName: string;
        country: string;
        emoji: string;
        date: Date | null | undefined;
        notes: string;
        position: { lat: number | undefined; lng: number | undefined };
    }) => {
        dispatch({ type: "LOADING" });
        try {
            const respons = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                // so that the api knows what data format iy's receiving
                headers: { "Content-type": "application/json" },
            });
            const data: Cities = await respons.json();
            dispatch({ type: "CITY/CREATED", payload: data });
            console.log(data);
        } catch {
            dispatch({
                type: "REJECTED",
                payload: "there's unknown error while adding city...",
            });
        }
    };

    // async function for deleting the object when the button is clicked
    const deleteCity = async (id: string) => {
        dispatch({ type: "LOADING" });
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });
            dispatch({ type: "CITY/DELETED", payload: id });
        } catch {
            dispatch({
                type: "REJECTED",
                payload: "there's unknown error while deleting city...",
            });
        }
    };

    return (
        <CitiesContext.Provider
            value={{
                cities,
                loading,
                currentCity,
                error,
                getCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
};
