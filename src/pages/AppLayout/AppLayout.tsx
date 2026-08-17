import { Map } from "../../components/Map/Map";
import { Sidebar } from "../../components/Sidebar/Sidebar";
// testament only
// import { User } from "../../components/User/User";
import style from "./AppLayout.module.css";
const AppLayout = () => {
    const { app } = style;
    return (
        <div className={app}>
            {/* test */}
            {/* <User /> */}
            <Sidebar />
            <Map />
        </div>
    );
};

export default AppLayout;
