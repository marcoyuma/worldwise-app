import { useNavigate, useParams /*useSearchParams*/ } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect } from "react";
import { Button } from "../Button/Button";
import { Spinner } from "../Spinner/Spinner";
import { useCitiesContext } from "../../hooks/useCitiesContext/useCitiesContext";

const formatDate = (date: string | undefined) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date ?? new Date()));

export const City = () => {
    // TEMP DATA
    // const currentCity = {
    //     cityName: "Lisbon",
    //     emoji: "🇵🇹",
    //     date: "2027-10-31T15:59:59.138Z",
    //     notes: "My favorite city so far!",
    // };

    // catch current url path
    const { id } = useParams();
    console.log(id);

    // destructuring state from the context api
    const { getCity, currentCity, loading } = useCitiesContext();
    console.log(currentCity);

    // destructuring property from the "currentCity" objek with validation truthy logic
    const { cityName, emoji, date, notes } = currentCity ?? {};

    // effect for calling the "getCity(id)" function to catch the current city's id from the params whenever the "id" is updated
    useEffect(() => {
        getCity(id ?? "");
    }, [id, getCity]);

    // define the useNavigate hooks from react-router
    const navigate = useNavigate();

    // we're not using below code anymore cuz we moved it on the global state
    // useSearchParams is a React Router hook used to fetch, update, and manage query parameters in a URL.
    //  usually used for filtering
    // const [searchParams, setSearchParams] = useSearchParams();

    // basic logic to render below component whenever the "loading" is true
    if (loading) return <Spinner />;

    // display the city
    return (
        <div className={styles.city}>
            <div className={styles.row}>
                <h6>City name</h6>
                <h3>
                    <span>{emoji}</span> {cityName}
                </h3>
            </div>

            <div className={styles.row}>
                <h6>You went to {cityName} on</h6>
                <p>{formatDate(date)}</p>
            </div>

            {notes && (
                <div className={styles.row}>
                    <h6>Your notes</h6>
                    <p>{notes}</p>
                </div>
            )}

            <div className={styles.row}>
                <h6>Learn more</h6>
                <a
                    href={`https://en.wikipedia.org/wiki/${cityName}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Check out {cityName} on Wikipedia &rarr;
                </a>
            </div>

            <div>
                <Button type="back" onClick={() => navigate(-1)}>
                    &larr; Back
                </Button>
            </div>
        </div>
    );
};
