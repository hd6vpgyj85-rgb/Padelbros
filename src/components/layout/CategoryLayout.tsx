import { Outlet } from "react-router-dom";
import CategoryHeader from "./CategoryHeader";

function CategoryLayout() {
  return (
    <>
      <CategoryHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default CategoryLayout;
