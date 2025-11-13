import Sidebar from "../components/Sidebar";
import "./Location.scss";
let Location = () => {
  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left d-none d-md-flex col-md-3">
          <Sidebar></Sidebar>
        </div>
        <div className="Location-mid col-12 col-md-6">
          <h1 className="text-center">Coming soon</h1>
        </div>
        <div className="Location-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
};

export default Location;
