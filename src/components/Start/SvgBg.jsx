import { motion } from 'framer-motion';
import React from 'react';

const pathData = "M 0 150, C 180 200, 190 180, 150 0, L 300 -60, S 300 200, 700 300, C 400 1000, 300 300, 0 400";

const AnimatedPath = ({ color, value }) => {

  return (
    <motion.path
      d={pathData}
      stroke={color}
      strokeWidth="10"
      fill="none"
      strokeDasharray={900}
      initial={{ strokeDashoffset: 0 }}
      animate={{ strokeDashoffset: 1000000 }}
      transition={{
        repeat: Infinity,
        repeatType: 'mirror',
        duration: 1300,
        ease: "linear",
        delay: value
      }}
    />
  );
};

const SvgBackground = () => (
  <svg viewBox="0 0 500 700">
      <AnimatedPath value={-3} color={'#7FE2EF'} />
      <AnimatedPath value={-2} color={'#FB6263'} />
      <AnimatedPath value={-4} color={'#7165E3'} />
  </svg>
);

export default SvgBackground;
