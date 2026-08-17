import { useCitiesContext } from "../../hooks/useCitiesContext/useCitiesContext";
import { CountryItem } from "../CountryItem/CountryItem";
import { Message } from "../Message/Message";
import { Spinner } from "../Spinner/Spinner";
import styles from "./CountryList.module.css";
export const CountryList = () =>
    // * no longer using props, we use context api
    // {
    //     cities,
    //     loading,
    // }: {
    //     cities: Cities[] | null;
    //     loading: boolean;
    // }
    {
        const { loading, cities } = useCitiesContext();

        if (loading) return <Spinner />;
        if (!cities) return <Message message="Add ur first city by the map" />;
        const { countryList } = styles;
        // function to handle duplicate
        // const pureCountry = [
        //     ...new Map(cities.map((city) => [city.country, city])).values(),
        // ];
        // console.log(pureCountry);
        // * first way
        // const countries = Array.from(
        //     cities.reduce((acc, { country, emoji }) => {
        //         if (!acc.has(country)) {
        //             acc.set(country, { country, emoji });
        //         }
        //         return acc;
        //     }, new Map<string, { country: string; emoji: string }>())
        // ).map(([_, value]) => value);
        // * easier way but slow
        // const uniqueCountries = visitedCities.reduce((acc, item) => {
        //     if (!acc.some((el) => el.country === item.country)) {
        //       acc.push({ country: item.country, a: item.a });
        //     }
        //     return acc;
        //   }, []);
        // * best practice
        const uniqueCountry = Array.from(
            new Map(
                cities.map((item) => [
                    item.country,
                    { country: item.country, emoji: item.emoji },
                ])
            ).values()
        );
        // console.log(uniqueCountry);
        // const obj = Array.from(
        //     new Map([
        //         ["germany", "berlin"],
        //         ["spain", "barcelona"],
        //         ["spain", "madrid"],
        //         ["uk", "london"],
        //         ["uk", "manchester"],
        //     ])
        // )
        //     .map((item, index) => `${item} adalah item ke ${index + 1}`)
        //     .values();
        // console.log(obj);

        return (
            <ul className={countryList}>
                {uniqueCountry?.map((country) => (
                    <CountryItem country={country} key={country.country} />
                ))}
            </ul>
        );
    };
