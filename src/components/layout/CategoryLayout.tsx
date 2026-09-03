import { Outlet } from "react-router-dom";
import CategoryHeader from "./CategoryHeader";
import BottomTabBar from "./BottomTabBar";

function CategoryLayout() {
  return (
    <>
      <CategoryHeader />
      <main>
        <Outlet />
      </main>
      <BottomTabBar />
    </>
  );
}

export default CategoryLayout;
