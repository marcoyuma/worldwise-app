import { FormEvent, MouseEvent, ReactNode } from "react";
import styles from "./Button.module.css";

export const Button = ({
    children,
    onClick,
    type,
}: {
    children?: ReactNode;
    onClick?: (
        e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
    ) => void;
    type?: keyof typeof styles;
}) => {
    const { btn } = styles;
    return (
        <button className={`${btn} ${styles[type ?? ""]}`} onClick={onClick}>
            {children}
        </button>
    );
};
