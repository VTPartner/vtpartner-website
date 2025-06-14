/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { styles } from "../../../styles";
import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.45 }}
        className={`${styles.paddingNew} max-w-7xl mx-auto relative z-0`}
      >
        <span className="hash-span" id={idName}></span>
        &nbsp;
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
