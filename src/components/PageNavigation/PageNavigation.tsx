import { /*Link,*/ NavLink } from "react-router-dom";
import style from "./PageNavigation.module.css";
import { Logo } from "../Logo/Logo";

const links: { title: string; link: string }[] = [
    { title: "Pricing", link: "/pricing" },
    { title: "Product", link: "/product" },
    // test purpose
    // { title: "Login", link: "/login" },
];
export const PageNavigation = () => {
    const { nav } = style;
    return (
        <nav className={nav}>
            <Logo />
            <ul>
                {links.map((item) => (
                    <li key={item.title}>
                        {/* we use this rather than using anchor element because when we click the "a" element then the page is reloads, but it's not SPA behavior. when use the "Link" API from react router API then it's no longer reloads */}
                        {/* one way for going to another pages app */}
                        {/* <Link to="/pricing">Pricing</Link> */}
                        {/* <Link to={item.link}>{item.title}</Link> */}

                        {/* second way is better. cuz it's can show us which one is currently are we in or active page using "<NavLink><NavLink/>" */}
                        {/* this another component is adding class named "active" when we currently on that page */}
                        {/* recommended and very important for react developer */}
                        <NavLink
                            to={item.link}
                            // test purpose
                            // className={
                            //     item.title.toLowerCase() === "login"
                            //         ? ctaLink
                            //         : ""
                            // }
                        >
                            {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
