import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext/useAuthContext";

const ProtectingRoute = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthContext();
    useEffect(() => {
        // a condition based on the "isAuthenticated" and "user.email" boolean value.
        // so when the user not logged in then this code will prevent user to view the content page
        // if the "isAuthenticated" is false and "user.email" is just a string ("") which means falsy then make the user navigated to "/" route
        // if the condition is false then continue to next line code
        if (!isAuthenticated || !user.email) navigate("/");
    }, [user, isAuthenticated, navigate]);

    // if true then return the children which means will make the page rendered
    return children;
};

export default ProtectingRoute;
