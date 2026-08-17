import { Outlet } from "react-router-dom";
import { AppNavigation } from "../AppNavigation/AppNavigation";
import { Footer } from "../Footer/Footer";
import { Logo } from "../Logo/Logo";
import styles from "./Sidebar.module.css";
export const Sidebar = () => {
    const { sidebar } = styles;
    return (
        <div className={sidebar}>
            <Logo />
            <AppNavigation />
            {/* similar to children props. which it's render the child element from the nested routing */}
            <Outlet />
            <Footer />
        </div>
    );
};
