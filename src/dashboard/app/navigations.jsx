export const navigations = [
  { name: "Dashboard", path: "/dashboard/home", icon: "dashboard" },

  // { label: "Enquiry", type: "label" },
  // {
  //   name: "All Enquiry",
  //   icon: "outlined_flag",
  //   // badge: { value: "30+", color: "secondary" },
  //   children: [
  //     {
  //       name: "Goods Driver",
  //       iconText: "GD",
  //       path: "/goods-driver/all-enquires",
  //     },
  //     {
  //       name: "Cab Driver",
  //       iconText: "CD",
  //       path: "/cab-driver/all-enquires",
  //     },
  //     {
  //       name: "JCB Driver",
  //       iconText: "JCB",
  //       path: "/jcb-driver/all-enquires",
  //     },
  //     {
  //       name: "Crane Driver",
  //       iconText: "CRD",
  //       path: "/crane-driver/all-enquires",
  //     },
  //   ],
  // },

  { label: "Requests", type: "label" },
  {
    name: "All Requests",
    icon: "person",
    // badge: { value: "30+", color: "secondary" },
    children: [
      {
        name: "Enquiries",
        iconText: "AC",
        path: "/all_full_enquiries",
      },
      {
        name: "Estimations",
        iconText: "AC",
        path: "/all_estimations",
      },
    ],
  },
  { label: "Configurations", type: "label" },
  {
    name: "Main Configuration",
    icon: "settings",
    // badge: { value: "30+", color: "secondary" },
    children: [
      {
        name: "Allowed Cities",
        iconText: "AC",
        path: "/location_configuration/all_allow_cities",
      },
      {
        name: "All Services",
        iconText: "AS",
        path: "/all_services",
      },
    ],
  },

  // { label: "CUSTOMER", type: "label" },
  // {
  //   name: "Customer Settings",
  //   icon: "person_pin",
  //   children: [
  //     {
  //       name: "All Customers",
  //       iconText: "SI",
  //       path: "/customer/all-customers",
  //     },
  //   ],
  // },
  { label: "Partners", type: "label" },
  {
    name: "Delivery Agents",
    icon: "local_shipping",
    children: [
      {
        name: "Goods Drivers",
        iconText: "GD",
        path: "/all_goods_drivers",
      },
      { name: "Cab Drivers", iconText: "SI", path: "/all_cab_drivers" },
      {
        name: "JCB Crane Drivers",
        iconText: "SI",
        path: "/all_jcb_crane_drivers",
      },
    ],
  },

  { label: "Service Agents", type: "label" },
  {
    name: "Agents",
    icon: "build",
    // badge: { value: "30+", color: "secondary" },
    children: [
      { name: "HandyMan Agents", iconText: "SI", path: "/all_vendors" },
      { name: "Drivers", iconText: "SI", path: "/all_drivers" },
    ],
  },
];
