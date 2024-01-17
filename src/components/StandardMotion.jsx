import React from "react";
import { motion } from "framer-motion";

const StandardMotion = ({children, divClass, onClick}) => {
    return(
        <motion.div
        onClick={onClick ? onClick : null}
        className={divClass}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            duration: 0.2
        }}>
            {children}
        </motion.div>
    )
}
export default StandardMotion