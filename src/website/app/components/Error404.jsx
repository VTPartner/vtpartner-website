/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// import React from "react";
import { textVariant } from "../utils/motion";
import { styles } from "../../../styles";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";

const Error404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This goes back to the previous page in history
  };
  return (
    <div className="error-container p-0">
      <Container>
        <div>
          <div className="flex justify-content-center">
            <img
              src="../assets/images/background/error-404.png"
              className="img-fluid alice"
              alt=""
            />
          </div>
          <div className="mb-3">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 ">
                <p className="text-center text-secondary f-w-500">
                  The Page you're looking for was not found / Might Be Under
                  Maintenance
                </p>
              </div>
            </div>
          </div>
          <Link
            role="button"
            onClick={handleGoBack}
            className="btn btn-lg btn-primary"
          >
            <i className="ti ti-home"></i> Back To Home
          </Link>
        </div>
      </Container>
    </div>
  );
  // return (
  //   <div className="w-screen h-screen bg-primary text-white ">
  //     <div className="flex items-center justify-center flex-col h-full w-full">
  //       <motion.div
  //         variants={textVariant()}
  //         className="flex flex-col justify-center items-center"
  //       >
  //         <p
  //           className={`${styles.sectionHeadText} text-center mb-8 text-white`}
  //         >
  //           404 : (
  //         </p>
  //         <p className={`${styles.sectionSubText} text-center mb-8`}>
  //           The Page you're looking for was not found / Might Be Under
  //           Maintenance
  //         </p>
  //         <Link
  //           onClick={handleGoBack}
  //           className="bg-blue-600  rounded-md sm:p-4 p-2"
  //         >
  //           Go Back
  //         </Link>
  //       </motion.div>
  //     </div>
  //   </div>
  // );
};

export default Error404;
