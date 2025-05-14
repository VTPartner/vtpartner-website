export const sidebarConfig = [
  {
    type: "dropdown",
    title: "Dashboard",
    iconClass: "ph-duotone ph-house-line",
    name: "dashboard",
    badgeCount: 5,
    collapseId: "dashboard",
    path: "/dashboard",
    children: [
      { name: "Goods Admin Panel", path: "/dashboard/home" },
      { name: "Cab Admin Panel", path: "/dashboard/cab-home" },
      { name: "JCB/Crane Admin Panel", path: "/dashboard/jcb-crane-home" },
      { name: "Drivers Admin Panel", path: "/dashboard/drivers-home" },
      { name: "HandyMan Admin Panel", path: "/dashboard/handyman-home" },
    ],
  },

  //Goods All Routes
  {
    type: "dropdown",
    title: "Main Configurations",
    iconClass: "ph-bold ph-gear-fine",
    name: "Settings",
    collapseId: "Main",
    path: "/dashboard/settings",
    children: [
      { name: "Regions", path: "/dashboard/all-regions" },
      { name: "Services", path: "/dashboard/all-services" },
      { name: "Goods Types", path: "/dashboard/all-goods_types" },
      { name: "Recharge Plans", path: "/dashboard/all-recharge-plans" },
      { name: "Banners", path: "/dashboard/all-banners" },
      { name: "Coupons", path: "/dashboard/all-coupons" },
    ],
  },

  //Customers
  {
    type: "dropdown",
    title: "Customer",
    iconClass: "ph-duotone ph-user",
    name: "customer details",
    collapseId: "Customer",
    path: "/dashboard/customer",
    children: [{ name: "Customers", path: "/dashboard/all-customers" }],
  },

  //Goods All Routes
  {
    type: "dropdown",
    title: "Goods",
    iconClass: "ph-duotone ph-van",
    name: "goods details",
    collapseId: "Goods",
    path: "/dashboard/goods",
    children: [
      { name: "Drivers", path: "/dashboard/all-goods-drivers" },
      { name: "Bookings", path: "/dashboard/goods/bookings" },
      { name: "Orders", path: "/dashboard/goods/orders" },
    ],
  },

  //Cab All Routes
  {
    type: "dropdown",
    title: "Cabs",
    iconClass: "ph-duotone ph-car",
    name: "Cabs details",
    collapseId: "Cabs",
    path: "/dashboard/cab",
    children: [
      { name: "Drivers", path: "/dashboard/all-cab-drivers" },
      { name: "Bookings", path: "/dashboard/cab/bookings" },
      { name: "Orders", path: "/dashboard/cab/orders" },
    ],
  },

  //Driver Agent All Routes
  {
    type: "dropdown",
    title: "Drivers",
    iconClass: "ph-duotone ph-person",
    name: "Drivers details",
    collapseId: "Drivers",
    path: "/dashboard/other-drivers",
    children: [
      { name: "Agents", path: "/dashboard/all-other-drivers" },
      { name: "Bookings", path: "/dashboard/other-drivers/bookings" },
      { name: "Orders", path: "/dashboard/other-drivers/orders" },
    ],
  },

  //JCB Crane Agent All Routes
  {
    type: "dropdown",
    title: "JCB/Crane",
    iconClass: "ph-duotone ph-stack",
    name: "JCB/Crane details",
    collapseId: "JCB/Crane",
    path: "/dashboard/jcb-crane-drivers",
    children: [
      { name: "Agents", path: "/dashboard/all-jcb-crane-drivers" },
      { name: "Bookings", path: "/dashboard/jcb-crane/bookings" },
      { name: "Orders", path: "/dashboard/jcb-crane/orders" },
    ],
  },

  //HandyMan Agent All Routes
  {
    type: "dropdown",
    title: "HandyMan",
    iconClass: "ph-duotone ph-wrench",
    name: "Handyman details",
    collapseId: "HandyMan",
    path: "/dashboard/handyman",
    children: [
      { name: "Agents", path: "/dashboard/all-handyman" },
      { name: "Bookings", path: "/dashboard/handyman/bookings" },
      { name: "Orders", path: "/dashboard/handyman/orders" },
    ],
  },

  //Reports
  {
    type: "dropdown",
    title: "Reports",
    iconClass: "ph-duotone ph-stack",
    name: "All Reports",
    collapseId: "Reports",
    path: "/dashboard/reports",
    children: [
      { name: "Goods Orders Report", path: "/dashboard/all-orders-report" },
      { name: "Cab Orders Report", path: "/dashboard/all-cab-orders-report" },
      {
        name: "Drivers Orders Report",
        path: "/dashboard/all-other-drivers-orders-report",
      },
      {
        name: "Jcb/Crane Orders Report",
        path: "/dashboard/all-jcb-crane-drivers-orders-report",
      },
      {
        name: "Handyman Orders Report",
        path: "/dashboard/all-handyman-orders-report",
      },
    ],
  },
];

// sidebarConfig.forEach((item, index) => {
//   console.log(`Item ${index + 1}:`);
//   console.log(item);

//   // Check for nested children and print them recursively
//   if (item.children) {
//     item.children.forEach((child, childIndex) => {
//       console.log(`  Child ${childIndex + 1}:`);
//       console.log(child);

//       // Check for deeper levels of children
//       if (child.children) {
//         child.children.forEach((subChild, subChildIndex) => {
//           console.log(`    Sub Child ${subChildIndex + 1}:`);
//           console.log(subChild);
//         });
//       }
//     });
//   }
// });
