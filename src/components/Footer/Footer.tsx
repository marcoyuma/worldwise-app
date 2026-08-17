import styles from "./Footer.module.css";

export const Footer = () => {
    const { footer, copyright } = styles;
    return (
        <footer className={footer}>
            <p className={copyright}>
                &copy; copyright {new Date().getFullYear()} by Worldwise Inc.
            </p>
        </footer>
    );
};
