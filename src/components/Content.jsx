import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

const Content = () => {
  return (
    <>
      <Navbar />
      <div className="pt-14">
        <Outlet />
      </div>
    </>
  );
};
export { Content };
