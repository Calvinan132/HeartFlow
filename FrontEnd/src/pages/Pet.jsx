import Sidebar from "../components/SideBar";
import "./Pet.scss";
let Pet = () => {
  return (
    <div className="Pet-container container-fluid">
      <div className="Pet-content row pt-3">
        <div className="Pet-left col-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="Pet-mid col-6">
          <h1 className="text-center">Coming soon</h1>
        </div>
        <div className="Pet-right col-3"></div>
      </div>
    </div>
  );
};

export default Pet;
