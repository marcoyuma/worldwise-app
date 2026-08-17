import { ReactNode, useReducer } from "react";
import { AuthContext } from "./FakeAuthContext";

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

type ActionType =
    | {
          type: "login";
          // state user has 4 properties. but just filling 2 value as a payload
          payload: {
              //   name: string;
              email: string;
              password: string;
              //   avatar: string;
          };
      }
    | { type: "logout" };

export type InitialState = {
    user: {
        name: string;
        email: string;
        password: string;
        avatar: string;
    };
    isAuthenticated: boolean;
};

const initialState: InitialState = {
    user: {
        name: "",
        avatar: "",
        email: "",
        password: "",
    },
    isAuthenticated: false,
};

const reducer = (state: InitialState, action: ActionType) => {
    switch (action.type) {
        case "login":
            return {
                ...state,
                user: {
                    name: FAKE_USER.name,
                    avatar: FAKE_USER.avatar,
                    email: action.payload.email ?? "",
                    password: action.payload.password ?? "",
                },
                isAuthenticated: true,
            };
        case "logout":
            return {
                ...state,
                user: { name: "", avatar: "", email: "", password: "" },
                isAuthenticated: false,
            };
        default:
            throw new Error("Unknown Action");
    }
};

export const FakeAuthProvider = ({ children }: { children: ReactNode }) => {
    // reducer hook to set the state
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState
    );

    // login function that will be call when the click event in login page is clicked
    // received two argument {email: string, password: string}
    const login = (email: string, password: string) => {
        if (email === FAKE_USER.email && password === FAKE_USER.password)
            dispatch({
                type: "login",
                payload: { email: email, password: password },
            });
    };

    // logout function that will be call when the click event in right top map page is clicked
    const logout = () => {
        dispatch({ type: "logout" });
    };
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
