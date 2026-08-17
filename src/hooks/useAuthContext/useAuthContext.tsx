import { useContext } from "react";
import { AuthContext } from "../../contexts/FakeAuthContext/FakeAuthContext";

// custom hooks that return the context global state value
export const useAuthContext = () => {
    // define a variable that valued the useContext with the argument "AuthContext" from "../contexts/FakeAuthContext"
    const context = useContext(AuthContext);
    if (context === null)
        throw new Error("AuthContext was used outside AuthProvider");

    return context;
};
