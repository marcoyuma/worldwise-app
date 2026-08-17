import { NavLink } from "react-router-dom";
import style from "./AppNavigation.module.css";
const links: { title: string; link: string }[] = [
    { title: "Cities", link: "cities" },
    { title: "Countries", link: "countries" },
];
export const AppNavigation = () => {
    const { nav } = style;
    return (
        <nav className={nav}>
            <ul>
                {links.map((item) => (
                    <li key={item.title}>
                        <NavLink key={item.title} to={item.link}>
                            {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
