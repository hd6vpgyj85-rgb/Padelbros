import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomTabBar from "./BottomTabBar";
import "./SearchLayout.css";

function SearchLayout() {
  return (
    <>
      <header className="search-layout-header">
        <TopBar />
      </header>
      <main>
        <Outlet />
      </main>
      <BottomTabBar />
    </>
  );
}

export default SearchLayout;
