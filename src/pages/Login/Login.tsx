import { FormEvent, useEffect, useState } from "react";
import styles from "./Login.module.css";
import { PageNavigation } from "../../components/PageNavigation/PageNavigation";
import { useAuthContext } from "../../hooks/useAuthContext/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";

const Login = () => {
    // define and destructuring the state from useAuth
    const { isAuthenticated, login } = useAuthContext();

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
    // PRE-FILL FOR DEV PURPOSES
    const [email, setEmail] = useState("jack@example.com");
    const [password, setPassword] = useState("qwerty");

    useEffect(() => {
        if (isAuthenticated === true) {
            // tidak diperlukan navigate di tempat selain effect ini.
            // effect ini memiliki 2 fungsi
            // berkaitan dengan nilai "isAuthenticated" dan navigate
            // lalu memastikan setiap kali "isAuthenticated" bernilai true maka page akan navigate ke "/app" secara programatik
            // programmatically navigate to "/app"
            // "{replace: true}" means that we're not saving the previous page in history, so then user cannot clicking left arrow (back) on the search engine and go back to the previous page
            navigate("/app", { replace: true });
        }
    }, [isAuthenticated, navigate]);
    const handleClick = (e: FormEvent) => {
        e.preventDefault();
        //  if (user?.email !== email || user?.password !== password) return;
        if (email && password) login(email, password);

        // navigate("/app");
    };
    // useEffect(() => {
    //     console.log(
    //         `user email: ${user?.email}, email: ${email}, user password: ${user?.password}, password: ${password}`
    //     );
    // }, [user.email]);

    return (
        <main className={styles.login}>
            <PageNavigation />
            <form className={styles.form}>
                <div className={styles.row}>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className={styles.row}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <div>
                    {/* <button onClick={handleClick}>Login</button> */}
                    <Button type="primary" onClick={handleClick}>
                        login
                    </Button>
                </div>
            </form>
        </main>
    );
};

export default Login;
