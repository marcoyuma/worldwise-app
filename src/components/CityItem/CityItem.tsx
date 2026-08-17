import { Link } from "react-router-dom";
import { Cities } from "../../App";
import styles from "./CityItem.module.css";
import { MouseEvent } from "react";
import { useCitiesContext } from "../../hooks/useCitiesContext/useCitiesContext";

const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        // weekday: "long",
    }).format(new Date(date));

export const CityItem = ({
    // receiving props from "../CityList/CityList.tsx"
    city,
}: {
    city: Cities;
}) => {
    // destructuring
    const { cityItem, emojii, name, datee, deleteBtn } = styles;
    const { id, cityName, emoji, date, position } = city;

    // destructuring context api
    const { currentCity, deleteCity } = useCitiesContext();

    // handle delete button
    // we shouldn't using the arrow function when calling the function because function is defined with auto event parameter
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        deleteCity(id);
    };

    return (
        <li>
            <Link
                // pada path "to"
                to={`${id}?lat=${position.lat}&lng=${position.lng}`}
                className={`${cityItem} ${
                    id === currentCity?.id ? styles["cityItem--active"] : ""
                }`}
            >
                <span className={emojii}>{emoji}</span>
                <h3 className={name}>{cityName}</h3>
                <time className={datee}>({formatDate(date)})</time>
                <button className={deleteBtn} onClick={handleClick}>
                    &times;
                </button>
            </Link>
        </li>
    );
};
