import { useCitiesContext } from "../../hooks/useCitiesContext/useCitiesContext";
import { CityItem } from "../CityItem/CityItem";
import { Message } from "../Message/Message";
import { Spinner } from "../Spinner/Spinner";
import styles from "./CityList.module.css";

export const CityList = () =>
    //     {
    // receiving props from "../../App.tsx"
    // * we using context api so no longer props
    //     cities,
    //     loading,
    // }
    // : {
    //     cities: Cities[] | null;
    //     loading: boolean;
    // }
    {
        // * call the context api
        const { loading, cities } = useCitiesContext();

        const { cityList } = styles;
        if (loading) return <Spinner />;
        if (!cities) return <Message message="Add ur first city by the map" />;
        return (
            <ul className={cityList}>
                {cities?.map((city) => (
                    <CityItem city={city} key={city.cityName} />
                ))}
            </ul>
        );
    };
