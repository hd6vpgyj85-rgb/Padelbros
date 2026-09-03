import { Outlet } from "react-router-dom";
import Header from "./Header";

function HomeLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default HomeLayout;
