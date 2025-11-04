import Sidebar from "../components/SideBar";
import "./Location.scss";
let Location = () => {
  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left col-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="Location-mid col-6">
          <h1 className="text-center">Coming soon</h1>
        </div>
        <div className="Location-right col-3"></div>
      </div>
    </div>
  );
};

export default Location;
