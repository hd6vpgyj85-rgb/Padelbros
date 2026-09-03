import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomTabBar from "./BottomTabBar";

function HomeLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomTabBar />
    </>
  );
}

export default HomeLayout;
