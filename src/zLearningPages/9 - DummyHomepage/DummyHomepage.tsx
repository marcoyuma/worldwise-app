import { Link } from "react-router-dom";
import { PageNavigation } from "../../components/PageNavigation/PageNavigation";
import { AppNavigation } from "../../components/AppNavigation/AppNavigation";

export const Homepage = () => {
    return (
        <>
            {/* one way to put some navigation links (not recommended) */}
            <PageNavigation />
            <AppNavigation />
            <h1>Worldwise</h1>
            <Link to="/app">Go to the App</Link>
        </>
    );
};
