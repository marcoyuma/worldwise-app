import { createContext } from "react";

export const AuthContext = createContext<null | {
    user: {
        name: string;
        email: string;
        password: string;
        avatar: string;
    };
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
}>(null);
