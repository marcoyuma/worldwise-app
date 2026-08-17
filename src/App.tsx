// defining react router using
// npm i react-router-dom@6
import {
    // * used for define first way react router
    // BrowserRouter,
    // Route,
    // Routes,

    // * used for define second way react router
    createBrowserRouter,
    Navigate,
    RouterProvider,
    // useNavigate,
} from "react-router-dom";

// * importing components
import { CityList } from "./components/CityList/CityList";
import { CountryList } from "./components/CountryList.tsx/CountryList";
import { City } from "./components/City/City";
import { Form } from "./components/Form/Form";
import { CitiesProvider } from "./contexts/CitiesContext/CitiesProvider";
import { FakeAuthProvider } from "./contexts/FakeAuthContext/FakeAuthProvider";
import { lazy, Suspense } from "react";
import { SpinnerFullPage } from "./components/SpinnerFullPage/SpinnerFullPage";

// * importing components from pages folder with "React.lazy" function
// import { Homepage } from "./pages/Homepage/Homepage";
// import { Product } from "./pages/Product/Product";
// import { Pricing } from "./pages/Pricing/Pricing";
// import { AppLayout } from "./pages/AppLayout/AppLayout";
// import { PageNotFound } from "./pages/PageNotFound/PageNotFound";
// import { Login } from "./pages/Login/Login";
// import { ProtectingRoute } from "./pages/ProtectingRoute/ProtectingRoute";
/**
 * * lazy loading
 * * importing the component as a callback function argument
 * ! always export with default export when exporting the component that will use the lazy loading method
 * NB: assign the variable named with as same as the component name
 */
const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const Product = lazy(() => import("./pages/Product/Product"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing"));
const AppLayout = lazy(() => import("./pages/AppLayout/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
const Login = lazy(() => import("./pages/Login/Login"));
const ProtectingRoute = lazy(
    () => import("./pages/ProtectingRoute/ProtectingRoute"),
);

// * comparison between with lazy loading and without
// dist/assets/index-DeTDf3HM.css   30.24 kB │ gzip:   5.06 kB | WITH LAZY LOADING
// dist/assets/index-sNfAJppJ.js   596.60 kB │ gzip: 176.31 kB | WITHOUT LAZT LOADING

/**
 * React Router Best Practice: Defining createBrowserRouter
 *
 * Why NOT to define `createBrowserRouter()` inside a component?
 *
 * Best Practice:
 *    - Define `createBrowserRouter()` OUTSIDE of any React component.
 *    - This ensures the router is created only once during the app’s lifecycle.
 *
 * Avoid:
 *    - Defining the router inside a component (e.g., inside `App()`)
 *    - This causes the router to re-initialize on every re-render,
 *      which can break navigation state and hurt performance.
 *
 * Structure Example:
 * * router.ts
 * const router = createBrowserRouter([
 *   { path: "/", element: <Home /> },
 *   { path: "/about", element: <About /> },
 * ]);
 * export default router;
 *
 * * main.tsx
 * <RouterProvider router={router} />
 *
 * Summary:
 * - `createBrowserRouter()` = create once, outside component
 * - Use `<RouterProvider />` to inject it into the React tree
 * - Helps keep routing stable and performant
 */
const router = createBrowserRouter([
    { path: "/", element: <Homepage /> },
    { path: "/product", element: <Product /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/login", element: <Login /> },
    // nested routing
    {
        path: "/app",
        element: (
            // a way to protecting the route from unlogged user with wrapping the children component by "ProtectingRoute" component
            // the "ProtectingRoute" is basically just return the children but with validation on some condition on effect by doing something
            // in this case is a useEffect that programmaticly navigate to the homepage ("/") route when the "isAuthenticated" is false and based on the useEffect dependency array dynamic value
            <ProtectingRoute>
                <AppLayout />
            </ProtectingRoute>
        ),

        // ways to place a nested routing using "createBrowserRouter" properties "children[]"
        children: [
            // must not use the "/" on the path property or the child route will then dianggap absolute path and not assign with the parent
            {
                path: "cities",
                element: (
                    <CityList
                    // * now we using context api
                    //  cities={cities} loading={loading}
                    />
                ),
            },
            {
                // we must not use the "/cities/:id" because "cities" is from the parent "/app" path
                // we use this instead "cities/:id"
                path: "cities/:id",
                element: <City />,
            },
            {
                path: "countries",
                element: (
                    <CountryList
                    // * we now using context api
                    // cities={cities}
                    // loading={loading}
                    />
                ),
            },
            { path: "form", element: <Form /> },

            /**
             * Handling default routes in nested routing:
             *
             * - Using `index: true` in child routes ensures a default component is rendered when accessing the parent route.
             *   Example: Visiting `/dashboard` automatically renders `DashboardHome`.
             *
             * - Alternatively, `<Navigate to="/dashboard/home" replace />` can be used in the parent component to redirect users
             *   to a specific child route when they visit `/dashboard`.
             *
             * - Best practice: Prefer `index: true` for simplicity and performance, unless a redirect is explicitly needed.
             */
            // which means when we go to the "/app" path then the routing will direct the path to the "cities" child using the "Navigate" api by "to" property
            {
                index: true,
                element: (
                    // * first way. declarative way to navigate which not common to use anymore
                    <Navigate
                        // used when we back to previous page stack or when we click <-
                        replace
                        to={"cities"}
                    />
                ),
            },
        ],
    },
    // the code below will catch when there's no url matched our defined path
    // just like the "finally" on try-catch or "default" on switch-case
    { path: "*", element: <PageNotFound /> },
]);
export const App = () => {
    return (
        <>
            {/* first ways to define routes */}
            {/* <BrowserRouter>
            <Routes>
                <Route path="product" element={<Product />} />
            </Routes>
            </BrowserRouter> */}

            {/* the provider to provide child component the global state  */}
            {/* imported from "./contexts/CitiesContext/CitiesProvider */}
            <CitiesProvider>
                {/* another provider to provide child component the needed global state */}
                {/* imported from "./contexts/FakeAuthContext/FakeAuthProvider" */}
                {/* second way to define routes */}
                {/* if we used "createBrowserRouter" to define the path and element, then we must used API "<RouterProvider routes={nameOfObject}/>" */}
                {/* <Navigation /> */}
                <FakeAuthProvider>
                    {/* whenever the children of "Suspense" component is not yet ready so the "SpinnerFullPage" will fallback and rendered */}
                    <Suspense fallback={<SpinnerFullPage />}>
                        <RouterProvider router={router} />
                    </Suspense>
                </FakeAuthProvider>
            </CitiesProvider>
        </>
    );
};
