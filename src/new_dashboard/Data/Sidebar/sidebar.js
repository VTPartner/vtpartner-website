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
      // { name: "Cab Admin Panel", path: "/dashboard/cab-home" },
      // { name: "JCB/Crane Admin Panel", path: "/dashboard/jcb-crane-home" },
      // { name: "Drivers Admin Panel", path: "/dashboard/drivers-home" },
      // { name: "HandyMan Admin Panel", path: "/dashboard/handyman-home" },
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
      { name: "Banners", path: "/dashboard/all-banners" },
      { name: "Coupons", path: "/dashboard/all-coupons" },
    ],
  },

  //Customers
  {
    type: "dropdown",
    title: "Customer",
    iconClass: "ph-duotone ph-stack",
    name: "customer details",
    collapseId: "Customer",
    path: "/dashboard/customer",
    children: [{ name: "Customers", path: "/dashboard/all-customers" }],
  },

  //Goods All Routes
  {
    type: "dropdown",
    title: "Goods",
    iconClass: "ph-duotone ph-stack",
    name: "goods details",
    collapseId: "Goods",
    path: "/dashboard/goods",
    children: [
      { name: "Drivers", path: "/dashboard/all-goods-drivers" },
      { name: "Bookings", path: "/dashboard/goods/bookings" },
      { name: "Orders", path: "/dashboard/goods/orders" },
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
    children: [{ name: "Orders Report", path: "/dashboard/all-orders-report" }],
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
