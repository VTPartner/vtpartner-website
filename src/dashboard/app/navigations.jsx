export const navigations = [
  { name: "Dashboard", path: "/dashboard/home", icon: "dashboard" },

  { label: "Enquiry", type: "label" },
  {
    name: "All Enquiry",
    icon: "outlined_flag",
    // badge: { value: "30+", color: "secondary" },
    children: [
      {
        name: "Goods Driver",
        iconText: "GD",
        path: "/goods-driver/all-enquires",
      },
      {
        name: "Cab Driver",
        iconText: "CD",
        path: "/cab-driver/all-enquires",
      },
      {
        name: "JCB Driver",
        iconText: "JCB",
        path: "/jcb-driver/all-enquires",
      },
      {
        name: "Crane Driver",
        iconText: "CRD",
        path: "/crane-driver/all-enquires",
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

  { label: "CUSTOMER", type: "label" },
  {
    name: "Customer Settings",
    icon: "person_pin",
    children: [
      {
        name: "All Customers",
        iconText: "SI",
        path: "/customer/all-customers",
      },
    ],
  },
  { label: "Delivery Partners", type: "label" },
  {
    name: "Delivery Agents Settings",
    icon: "local_shipping",
    children: [
      {
        name: "All Delivery Agents",
        iconText: "SI",
        path: "/delivery-agents/all",
      },
    ],
  },
  { label: "Cab Drivers", type: "label" },
  {
    name: "Cab Drivers Settings",
    icon: "local_taxi",
    children: [
      { name: "All Cab Drivers", iconText: "SI", path: "/cab-driver/all" },
    ],
  },
  { label: "JCB Drivers", type: "label" },
  {
    name: "JCB Drivers Settings",
    icon: "rowing",
    children: [
      { name: "All JCB Drivers", iconText: "SI", path: "/jcb-driver/all" },
    ],
  },
  { label: "Service Vendors", type: "label" },
  {
    name: "Service Vendors",
    icon: "build",
    // badge: { value: "30+", color: "secondary" },
    children: [
      { name: "All Vendors", iconText: "SI", path: "/service-vendor/all" },
    ],
  },
];
