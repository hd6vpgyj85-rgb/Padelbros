import { Outlet } from "react-router-dom";
import { useHeaderVisibility } from "../../hooks/useHeaderVisibility";
import TopBar from "./TopBar";
import "./SearchLayout.css";

function SearchLayout() {
  const isVisible = useHeaderVisibility();

  return (
    <>
      <header
        className={`search-layout-header site-header site-header--neon${
          isVisible ? "" : " site-header--hidden"
        }`}
      >
        <TopBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default SearchLayout;
