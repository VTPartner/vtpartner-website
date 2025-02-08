/* eslint-disable react/prop-types */
import { Card } from "reactstrap";

const GoodsDriverProfileTab = ({ data, setData }) => {
  return (
    <Card className="shadow-sm border-0 rounded">
      <div className="card-body">
        <div className="tab-wrapper">
          <ul className="profile-app-tabs ">
            <li
              className={`${
                data === "tab1" ? "active" : ""
              } tab-link fw-medium f-s-16 f-w-600`}
              onClick={() => setData("tab1")}
            >
              <i className="ti ti-user fw-bold"></i> Profile
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default GoodsDriverProfileTab;
