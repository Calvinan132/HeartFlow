import Sidebar from "../components/Sidebar";
import "./Pet.scss";
let Pet = () => {
  return (
    <div className="Pet-container container-fluid">
      <div className="Pet-content row pt-3">
        <div className="Pet-left d-none d-md-flex col-md-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="Pet-mid col-12 col-md-6">
          <h1 className="text-center">Coming soon</h1>
        </div>
        <div className="Pet-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
};

export default Pet;
