import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { useAuthContext } from "../../hooks/useAuthContext/useAuthContext";
import { FormEvent } from "react";

// const FAKE_USER = {
//     name: "Jack",
//     email: "jack@example.com",
//     password: "qwerty",
//     avatar: "https://i.pravatar.cc/100?u=zz",
// };

export const User = () => {
    const { user, logout } = useAuthContext();
    /**
     * 🚀 Programmatic Navigation in React Router
     *
     * The `navigate()` function from React Router is used to redirect users programmatically.
     * However, it must be used **properly** to avoid unexpected behavior like infinite redirects.
     *
     * ✅ Use `navigate()` inside:
     * - A `useEffect()` when reacting to state/prop changes (e.g., after login).
     * - An event handler (e.g., onClick, onSubmit).
     *
     * ❌ Avoid using `navigate()` directly during render. React components must stay pure,
     * and navigating directly in the body of a component can cause re-renders and routing loops.
     *
     * 🧠 Example (correct usage inside useEffect):
     *
     * useEffect(() => {
     *   if (isAuthenticated) {
     *     navigate("/app", { replace: true });
     *   }
     * }, [isAuthenticated, navigate]);
     *
     * 🔁 The `{ replace: true }` option prevents pushing a new entry into the history stack.
     * Useful to avoid the user going "back" to the login page after being redirected.
     */
    const navigate = useNavigate();
    const handleClick = (e: FormEvent) => {
        e.preventDefault();
        logout();
        navigate("/");
    };

    // validation if the "user" object is falsy
    // ! FOR DEVELOPMENT ONLY
    // later the user that not logged in cant access the app
    if (!user.email || !user.password) return;

    return (
        <div className={styles.user}>
            <img src={user?.avatar} alt={user?.name} />
            <span>Welcome, {user?.name}</span>
            <button onClick={handleClick}>Logout</button>
        </div>
    );
};

/*
CHALLENGE

1) Add `AuthProvider` to `App.jsx`
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppLayout.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
