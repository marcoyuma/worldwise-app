import styles from "./CountryItem.module.css";

export const CountryItem = ({
    country,
}: {
    country: { country: string; emoji: string };
}) => {
    const { countryItem } = styles;
    return (
        <li className={countryItem}>
            <span>{country.emoji}</span>
            <span>{country.country}</span>
        </li>
    );
};
