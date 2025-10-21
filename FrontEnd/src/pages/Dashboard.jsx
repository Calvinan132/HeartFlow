import "./Dashboard.scss";
import Sidebar from "../components/SideBar";
const Dashboard = () => {
  return (
    <div className="Dashboard-container container-fluid">
      <div className="Dashboard-content row pt-3">
        <div className="Dashboard-left col-3 ">
          <Sidebar></Sidebar>
        </div>
        <div className="Dashboard-mid col-6 row mr-5">
          <div className="Dashboard-counter col-12">
            <i className="fa-solid fa-heart"></i>
            <div className="Day-counter">1234</div>
            <span>Days Together</span>
            <span>200 days milestone in 10 days</span>
          </div>
          <div className="Message col-6 mt-3">
            <i className="fa-solid fa-envelope"></i>Send message
          </div>
          <div className="Gift col-6 mt-3">
            <i className="fa-solid fa-gift"></i>Send gift
          </div>
          <div className="Memories col-12 mt-3">
            <div className="Memories-about col-12">
              <span>Recent Memories</span>
              <span>View All</span>
            </div>
            <div className="Picture-box row">
              <div className="Picture col-3">1</div>
              <div className="Picture col-3">2</div>
              <div className="Picture col-3">3</div>
            </div>
          </div>
        </div>
        <div className="Dashboard-right col-3 row  ">
          <div className="Pet col-7 "></div>
          <div className="Task col-7 mt-3"></div>
          <div className="Partner col-7 mt-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
