import { useContext } from "react";
import { CitiesContext } from "../../contexts/CitiesContext/CitiesContext";

// custom hooks that return the context global state value
// this hook will be used to access the context value in the components
export const useCitiesContext = () => {
    const context = useContext(CitiesContext);

    if (context === null)
        throw new Error("PostContext was used outside the PostProvider!");
    return context;
};
