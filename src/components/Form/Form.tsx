// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { FormEvent, useEffect, useReducer } from "react";

import styles from "./Form.module.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import { Message } from "../Message/Message";
import { Spinner } from "../Spinner/Spinner";
// library for date picker component api
import DatePicker from "react-datepicker";
// styling for the date picker component
import "react-datepicker/dist/react-datepicker.css";
import { useCitiesContext } from "../../hooks/useCitiesContext/useCitiesContext";

const convertToEmoji = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        // before
        // .map((char) => 127397 + char.charCodeAt());
        // after
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// base url
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

// define the state type one by one
export interface InitialState {
    cityName: string;
    country: string;
    date: Date | null | undefined;
    notes: string;
    emoji: string;
    loadingGeocoding: boolean;
    geocodingError: string;
}

// define the dispatch option explicitly
export type ActionType =
    | {
          type: "SET_DATA";
          payload: { cityName: string; country: string; emoji: string };
      }
    | { type: "SET_LOADING_GEOCODING"; payload: boolean }
    | { type: "SET_GEOCODING_ERROR"; payload: string }
    | { type: "RESET_GEOCODING_ERROR" }
    // define one action type but with each of them with unique payload value based on the user input data type
    | { type: "HANDLE_INPUT"; payload: { name: string; value: string } }
    | { type: "HANDLE_INPUT"; payload: { name: string; value: Date | null } };

// define the state name by making an object
const initialState = {
    cityName: "",
    country: "",
    date: new Date(),
    notes: "",
    emoji: "",
    loadingGeocoding: false,
    geocodingError: "",
};

//

// define reducer hooks
const reducer = (state: InitialState, action: ActionType) => {
    switch (action.type) {
        case "SET_DATA":
            return {
                ...state,
                // cityName: action.payload,
                // country: action.payload,
                // emoji: action,
                // * best way to updating more than one state is using destructuring
                ...action.payload,
            };
        case "SET_LOADING_GEOCODING":
            return {
                ...state,
                loadingGeocoding: action.payload,
            };
        case "SET_GEOCODING_ERROR":
            return {
                ...state,
                geocodingError: action.payload,
            };
        case "RESET_GEOCODING_ERROR":
            return {
                ...state,
                geocodingError: "",
            };
        // one for all input query handle
        case "HANDLE_INPUT":
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
    }
};

export const Form = () => {
    // destructuring the custom hook which contain the "lat" and "lng" properties from the "useSearchParams()" hook
    const [lat, lng] = useUrlPosition();

    // destrcturing the context api or the global state
    const { createCity, loading } = useCitiesContext();

    // define useReducer as state
    const [
        {
            cityName,
            country,
            emoji,
            date,
            notes,
            loadingGeocoding,
            geocodingError,
        },
        dispatch,
    ] = useReducer(reducer, initialState);

    // * state for handle form
    // const [cityName, setCityName] = useState("");
    // const [country, setCountry] = useState("");
    // * updated
    // const [date, setDate] = useState<Date | string>(new Date());
    // const [notes, setNotes] = useState("");
    // * emoji convert
    // const [emoji, setEmoji] = useState("");

    // useNavigate from react router
    // return a function call navigate to move to other url by passing the path string as an argument
    const navigate = useNavigate();

    // * state for store loading indicator
    // const [loadingGeocoding, setLoadingGeocoding] = useState(false);

    // * state for storing geocoding error
    // const [geocodingError, setGeocodingError] = useState("");

    useEffect(() => {
        // validation logic when the "lat" & "lng" is falsy or when the form is accessed without clicking the map which means the "lat" & "lng" value will not setted and updated
        if (!lat && !lng) return;
        const fetchCityData = async () => {
            try {
                dispatch({ type: "SET_LOADING_GEOCODING", payload: true });
                dispatch({ type: "RESET_GEOCODING_ERROR" });
                // post method for updating the json data from /data/cities.json
                const respon = await fetch(
                    `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                );
                const data = await respon.json();
                console.log(data);

                // error validation when the user click the "neutral sea" or part of the sea that isn't owned by some country
                if (!data.countryCode)
                    throw new Error(
                        "That doesn't seem to be a city. Click somewhere else"
                    );

                // set the value from the fetched api object "data" properties with some conditional logic
                dispatch({
                    type: "SET_DATA",
                    payload: {
                        cityName: data.city || data.locality || "",
                        country: data.countryName,
                        emoji: convertToEmoji(data.countryCode),
                    },
                });
            } catch (err: unknown) {
                // catch the error.
                // define more validation for optimalization
                if (err instanceof Error) {
                    dispatch({
                        type: "SET_GEOCODING_ERROR",
                        payload: err.message,
                    });
                } else {
                    console.log(err);
                }
            } finally {
                dispatch({ type: "SET_LOADING_GEOCODING", payload: false });
            }
        };
        fetchCityData();
    }, [lat, lng]);

    // handle form submit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cityName || !date) return;
        const newCity: {
            cityName: string;
            country: string;
            emoji: string;
            date: Date | null | undefined;
            notes: string;
            position: { lat: number | undefined; lng: number | undefined };
        } = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: { lat: lat, lng: lng },
        };
        await createCity(newCity);
        console.log(newCity);
        navigate("/app/cities");
    };

    // logic validation when there's a condition where user shouldn't access the form in this way
    if (!lat && !lng)
        return <Message message="Start by clicking somewhere on the map" />;

    // handle validation when loading while fetching data from api
    if (loadingGeocoding) return <Spinner />;

    // handle validation when the "geocodingError" state is truthy which means there's an error
    if (geocodingError) return <Message message={geocodingError} />;

    return (
        <form
            className={`${styles.form} ${loading ? styles.loading : ""}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) =>
                        // dispatch for handle the input and update the state with one for all query input method
                        dispatch({
                            type: "HANDLE_INPUT",
                            payload: {
                                // the "name" property is must be the same as the initial state name. because the state key value change depends on it
                                name: "cityName",
                                value: e.target.value,
                            },
                        })
                    }
                    value={cityName}
                />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                {/* <input
                    id="date"
                    onChange={(e) =>
                        // dispatch for handle the input and update the state with one for all query input method
                        dispatch({
                            type: "HANDLE_INPUT",
                            payload: { name: "date", value: e.target.value },
                        })
                    }
                    // updated
                    value={date.toString()}
                /> */}

                {/* component api for date picker */}
                <DatePicker
                    dateFormat="dd/MM/YY"
                    selected={date}
                    // the component is asking for the parameter type to be "null | Date" not the "ChangeEvent<htmlInputElement>" like usual
                    onChange={(date) =>
                        dispatch({
                            type: "HANDLE_INPUT",
                            // the "name" property is must be the same as the initial state name. because the state key value change depends on it
                            payload: { name: "date", value: date },
                        })
                    }
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) =>
                        // dispatch for handle the input and update the state with one for all query input method
                        dispatch({
                            type: "HANDLE_INPUT",
                            payload: { name: "notes", value: e.target.value },
                        })
                    }
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <Button
                    type="back"
                    onClick={(e) => {
                        e.preventDefault();
                        // back to one page before
                        navigate(-1);
                    }}
                >
                    &larr; Back
                </Button>
            </div>
        </form>
    );
};
