export const navigations = [
  { name: "Dashboard", path: "/dashboard/home", icon: "dashboard" },
  { label: "Locations", type: "label" },
  {
    name: "Service Configuration",
    icon: "pin_drop",
    // badge: { value: "30+", color: "secondary" },
    children: [
      {
        name: "Allowed Location Details",
        iconText: "SI",
        path: "/location-configuration/all-allow-pincodes",
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
