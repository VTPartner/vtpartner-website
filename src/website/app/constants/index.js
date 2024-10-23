/* eslint-disable no-unused-vars */
import { path } from "framer-motion/client";
import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../../../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Goods Delivery",
    icon: web,
  },
  {
    title: "Cab",
    icon: mobile,
  },
  {
    title: "JCB ",
    icon: backend,
  },
  {
    title: "Crane",
    icon: creator,
  },
  {
    title: "Service Providers",
    icon: creator,
  },
];

const areas = [
  {
    name: "Belgaum",
  },
  {
    name: "Pune",
  },
];

const technologies = [
  {
    name: "Html",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "React.js Developer",
    company_name: "Starbucks",
    icon: starbucks,
    iconBg: "#383E56",
    date: "March 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React Native Developer",
    company_name: "Tesla",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Jan 2021 - Feb 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Shopify",
    icon: shopify,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Meta",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "3 Wheeler",
    price: "200",
    description:
      "The 3-Wheeled Transport Vehicle is a versatile and efficient solution designed for transporting goods with ease and reliability. Engineered to carry up to 500 kg, this vehicle is ideal for urban logistics, delivery services, and small-scale transportation needs.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "mongodb",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "tailwind",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "500 kg",
    image:
      "https://images.jdmagicbox.com/quickquotes/images_main/piaggio-ape-xtra-ld-mini-truck-2220305507-n9ndvo0n.jpg",
    source_code_link: "https://github.com/",
  },
  {
    name: "Tata Ace Mini",
    price: "350",
    description:
      "This vehicle has a substantial load capacity of around 750 kg, making it suitable for transporting various goods, including groceries, merchandise, and construction materials. Its small footprint allows for easy navigation through congested streets, making it perfect for last-mile delivery.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "restapi",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "scss",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "750 kg",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/9/ED/MU/VN/99155142/gold-petrol-cx-bs6-tata-ace-500x500.jpg",
    source_code_link: "https://github.com/",
  },
  {
    name: "Cab",
    price: "100",
    description:
      "We offer dependable cab services tailored to meet your transportation needs. Our fleet of well-maintained vehicles ensures a comfortable ride, whether you're commuting to work, heading to the airport, or exploring the city. Our professional drivers are trained to provide safe and efficient travel, guaranteeing timely arrivals at your destination.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "restapi",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "scss",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "",
    image: "https://5.imimg.com/data5/LY/UF/HF/GLADMIN-46187974/c-h-6.jpg",
    source_code_link: "https://github.com/",
  },
  {
    name: "407",
    price: "1200",
    description:
      "With its spacious cargo area, the 407 allows for efficient loading and unloading, optimizing operational efficiency. Whether used for urban deliveries or long-distance transport, the 407 Big Truck stands out as a dependable choice for businesses seeking a capable and efficient solution for their transportation needs.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "supabase",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "css",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "2500 kg",
    image:
      "https://img.gaadibazaar.in/new-vehicle-images/1450578/conversions/d2186137-f825-4861-828a-6e291ca458fc-vdp.webp",
    source_code_link: "https://github.com/",
  },
  {
    name: "Tata Ace",
    price: "550",
    description:
      "The Tata Ace Mini is a compact and efficient 4-wheeler truck designed to meet the demands of urban and rural transportation. With a load capacity of up to 1200 kg, it offers a practical solution for businesses needing to transport goods quickly and reliably.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "restapi",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "scss",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "1200 kg",
    image: "https://5.imimg.com/data5/AF/IK/GLADMIN-46404058/tata-ace.jpg",
    source_code_link: "https://github.com/",
  },
  {
    name: "JCB",
    price: "1500",
    description:
      "At VT Partner, we offer professional JCB drivers to ensure your construction and excavation projects run smoothly and efficiently. Our skilled operators are trained to handle JCB machinery with expertise, ensuring safe and effective operation on any job site.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "supabase",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "css",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "",
    image:
      "https://i.pinimg.com/736x/5a/4c/5d/5a4c5d63cc63a7d398c7a413974a0692.jpg",
    source_code_link: "https://github.com/",
  },
  {
    name: "Crane",
    price: "2000",
    description:
      "At VT Partner, we offer professional crane services tailored to your heavy lifting and transportation needs. Our diverse fleet includes a range of cranes specifically designed for various applications, allowing us to effectively meet the unique requirements of your project—be it in construction, industrial work, or logistics.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "supabase",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "css",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2024/3/396902819/YH/LS/XW/9485545/tyre-mounted-mobile-cranes.jpg",
    source_code_link: "https://github.com/",
  },
  {
    name: "Vendor Service",
    price: "200",
    description:
      "VT Partner provides a range of professional vendor services to meet your everyday needs. From skilled electricians and plumbers to reliable mechanics and cleaners, our vetted experts are just a call away. We prioritize quality and efficiency, ensuring that you receive prompt, trustworthy service for all your household and business requirements.",
    tags: [
      {
        name: "Get Estimation",
        color: "blue-text-gradient",
      },
      // {
      //   name: "supabase",
      //   color: "green-text-gradient",
      // },
      // {
      //   name: "css",
      //   color: "pink-text-gradient",
      // },
    ],
    weight: "",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2024/1/373914045/HB/NZ/RR/8100122/plumber-electrician-and-mst-service-provider.jpg",
    source_code_link: "https://github.com/",
  },
];

const faqData = [
  {
    question: "What services does VTpartner offer?",
    answer:
      "VTpartner offers a range of services including goods delivery, cab services, and JCB driver provision.",
  },
  {
    question: "How can I book a service?",
    answer:
      "You can book a service through our website or by contacting our customer service directly.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We operate in various locations, including Nagpur, Mumbai, and Pune. Please check our website for specific service areas.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support via the contact form on our website or by calling our support hotline.",
  },
];

export {
  services,
  technologies,
  experiences,
  testimonials,
  projects,
  areas,
  faqData,
};

