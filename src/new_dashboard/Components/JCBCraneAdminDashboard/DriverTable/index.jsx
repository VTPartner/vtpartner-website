/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Switch } from "@mui/material";

const DriverTable = ({
  drivers,
  tableType,
  handleOnlineStatusToggle,
  togglingDrivers,
  showOnlineStatus = true,
  showRegistrationDate = true,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  setCurrentPage,
  driverIdPrefix = "jcb_crane_driver_id",
  routePrefix = "jcb-crane",
  driverNamePrefix = "driver_name",
  isHandyman = false,
  showVehicleDetails = false,
}) => {
  // Helper function to safely get service details, handling different response structures
  const getServiceDetails = (driver) => {
    // If service_details exists as an object
    if (driver.service_details && typeof driver.service_details === "object") {
      return {
        name: driver.service_details.service_name || "NA",
        image: driver.service_details.service_image || "",
        base_price: driver.service_details.service_base_price || 0,
        price_per_hour: driver.service_details.service_price_per_hour || 0,
      };
    }
    // If service_details are directly in the driver object
    else if (driver.service_name) {
      return {
        name: driver.service_name || "NA",
        image: driver.service_image || "",
        base_price: driver.service_base_price || 0,
        price_per_hour: driver.service_price_per_hour || 0,
      };
    }
    // Default empty values
    return {
      name: "NA",
      image: "",
      base_price: 0,
      price_per_hour: 0,
    };
  };

  // Helper function to safely get subcategory details, handling different response structures
  const getSubCategoryDetails = (driver) => {
    // If sub_category_details exists as an object
    if (
      driver.sub_category_details &&
      typeof driver.sub_category_details === "object"
    ) {
      return {
        name: driver.sub_category_details.sub_cat_name || "NA",
        image: driver.sub_category_details.sub_cat_image || "",
        base_price: driver.sub_category_details.sub_cat_service_base_price || 0,
        price_per_hour: driver.sub_category_details.sub_cat_price_per_hour || 0,
      };
    }
    // If sub_category_details are directly in the driver object
    else if (driver.sub_cat_name) {
      return {
        name: driver.sub_cat_name || "NA",
        image: driver.sub_cat_image || "",
        base_price: driver.sub_cat_service_base_price || 0,
        price_per_hour: driver.sub_cat_price_per_hour || 0,
      };
    }
    // Default empty values
    return {
      name: "NA",
      image: "",
      base_price: 0,
      price_per_hour: 0,
    };
  };

  // Get vehicle details if available (for goods drivers)
  const getVehicleDetails = (driver) => {
    return {
      name: driver.vehicle_name || "NA",
      plate_no: driver.vehicle_plate_no || "NA",
      fuel_type: driver.vehicle_fuel_type || "NA",
      image: driver.driver_vehicle_image || "",
    };
  };

  // Get the correct driver name field
  const getDriverName = (driver) => {
    if (isHandyman && driver.name) {
      return driver.name;
    }
    return driver[driverNamePrefix] || "NA";
  };

  // Get actual route prefix removing "-driver" suffix for handyman
  const getRoutePrefix = () => {
    return isHandyman ? "handyman" : routePrefix + "-driver";
  };

  return (
    <div className="driver-list-table table-responsive app-scroll">
      <div className="mb-3">
        <input
          type="text"
          className="form-control m-4 align-middle"
          placeholder="Search by Driver Name or Mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="table table-bottom-bdriver align-middle mb-0">
        <thead>
          <tr>
            <th>Driver ID</th>
            <th scope="col">Driver Name</th>
            <th scope="col">Address</th>
            {showVehicleDetails ? (
              <th scope="col">Vehicle Details</th>
            ) : (
              <th scope="col">Service Details</th>
            )}
            <th scope="col">Status</th>
            {showOnlineStatus && <th scope="col">Online Status</th>}
            {showRegistrationDate && <th scope="col">Registration Date</th>}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => {
            const subCategory = getSubCategoryDetails(driver);
            const service = getServiceDetails(driver);
            const vehicle = getVehicleDetails(driver);
            const driverName = getDriverName(driver);
            const actualRoutePrefix = getRoutePrefix();

            return (
              <tr key={index}>
                <td># {driver[driverIdPrefix]}</td>
                <td>
                  <div className="position-relative">
                    <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                      <img
                        src={driver.profile_pic || ""}
                        alt={driverName}
                        className="img-fluid"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/40";
                        }}
                      />
                    </div>
                    <div className="ms-5">
                      <h6 className="mb-0 f-s-16">{driverName}</h6>
                      <p className="mb-0 f-s-14 text-secondary">
                        {driver.mobile_no || "NA"}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="mb-0 f-s-12 text-secondary">
                    {tableType === "online"
                      ? driver.address || "NA"
                      : driver.full_address || "NA"}
                  </p>
                </td>
                {showVehicleDetails ? (
                  <td>
                    <div className="position-relative">
                      <div className="h-40 w-40 d-flex-center b-r-15 overflow-hidden p-1 position-absolute">
                        <img
                          src={vehicle.image || ""}
                          alt={vehicle.name}
                          className="img-fluid"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                      </div>
                      <div className="ms-5">
                        <h6 className="mb-0 f-s-16">
                          {vehicle.name} {" | "} {vehicle.plate_no}
                        </h6>
                        <p className="mb-0 f-s-14 text-secondary">
                          {vehicle.fuel_type}
                        </p>
                      </div>
                    </div>
                  </td>
                ) : (
                  <td>
                    <div>
                      <h6 className="mb-0 f-s-16">{subCategory.name}</h6>
                      {driver.service_id !== -1 && (
                        <p className="mb-0 f-s-14 text-secondary">
                          {service.name}
                        </p>
                      )}
                      <p className="mb-0 f-s-12 text-primary">
                        Base Price: ₹{subCategory.base_price} | Per Hour: ₹
                        {subCategory.price_per_hour}
                      </p>
                      {driver.service_id !== -1 && (
                        <p className="mb-0 f-s-12 text-info">
                          Service Base: ₹{service.base_price} | Per Hour: ₹
                          {service.price_per_hour}
                        </p>
                      )}
                    </div>
                  </td>
                )}
                <td>
                  <span
                    className={`badge bg-${
                      tableType === "online"
                        ? driver.current_status === 1
                          ? "success"
                          : "danger"
                        : driver.status === 1
                        ? "success"
                        : driver.status === 2
                        ? "danger"
                        : driver.status === 3
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {tableType === "online"
                      ? driver.current_status === 1
                        ? "Free"
                        : "Occupied"
                      : driver.status === 1
                      ? "Verified"
                      : driver.status === 2
                      ? "Blocked"
                      : driver.status === 3
                      ? "Rejected"
                      : "Not Verified"}
                  </span>
                </td>
                {showOnlineStatus && (
                  <td>
                    <div className="d-flex align-items-center">
                      <Switch
                        checked={driver.is_online === 1}
                        onChange={() => handleOnlineStatusToggle(driver)}
                        disabled={togglingDrivers[driver[driverIdPrefix]]}
                        color="success"
                        size="small"
                      />
                      <span
                        className={`ms-2 badge bg-${
                          driver.is_online === 1 ? "success" : "secondary"
                        }`}
                      >
                        {driver.is_online === 1 ? "Online" : "Offline"}
                      </span>
                    </div>
                  </td>
                )}
                {showRegistrationDate && (
                  <td>{driver.registration_date || "NA"}</td>
                )}
                <td>
                  <Link
                    to={`/dashboard/${actualRoutePrefix}-profile-details/${driver[driverIdPrefix]}`}
                    role="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                  >
                    <i className="ti ti-eye"></i>
                  </Link>
                  {tableType !== "unverified" && (
                    <>
                      <Link
                        to={`/dashboard/${actualRoutePrefix}-recharge/${
                          driver[driverIdPrefix]
                        }/${encodeURIComponent(driverName)}`}
                        role="button"
                        className="btn btn-outline-info icon-btn w-30 h-30 b-r-22"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <i className="ti ti-history"></i>
                      </Link>
                      <Link
                        to={`/dashboard/${actualRoutePrefix}-wallet-details/${
                          driver[driverIdPrefix]
                        }/${encodeURIComponent(driverName)}`}
                        role="button"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 ms-2"
                      >
                        <i className="ti ti-wallet"></i>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination-controls d-flex justify-content-end align-items-center mt-3 p-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          className="btn btn-outline-primary"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
          }
          disabled={currentPage === (totalPages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DriverTable;
