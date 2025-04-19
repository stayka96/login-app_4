"use client"

import { motion } from "framer-motion"

interface BrecoolLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animate?: boolean
  showText?: boolean
}

export function BrecoolLogo({ size = "md", className = "", animate = false, showText = true }: BrecoolLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const wrenchVariants = {
    hidden: { rotate: -45, x: -20, opacity: 0 },
    visible: {
      rotate: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const screwdriverVariants = {
    hidden: { rotate: 45, x: 20, opacity: 0 },
    visible: {
      rotate: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  }

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={animate ? "hidden" : "visible"}
        animate="visible"
      >
        {/* Background */}
        <rect width="100" height="100" fill="#0066FF" />

        {/* Wrench */}
        <motion.path
          d="M30 65C25 65 20 60 20 55C20 50 25 45 30 45C32 45 34 46 35 47L55 27C54 26 53 24 53 22C53 17 58 12 63 12C68 12 73 17 73 22C73 27 68 32 63 32C61 32 59 31 58 30L38 50C39 51 40 53 40 55C40 60 35 65 30 65Z"
          fill="white"
          variants={animate ? wrenchVariants : {}}
        />

        {/* Screwdriver */}
        <motion.path
          d="M70 70C70 72 69 74 67 76L57 66C55 64 55 61 57 59L77 39C79 37 82 37 84 39L86 41C88 43 88 46 86 48L66 68C64 70 62 70 60 70L70 70Z"
          fill="white"
          variants={animate ? screwdriverVariants : {}}
        />
        <motion.path
          d="M57 66L67 76C65 78 62 80 60 80L50 80C48 80 45 78 43 76L53 66C55 64 55 61 57 59L57 66Z"
          fill="white"
          variants={animate ? screwdriverVariants : {}}
        />

        {/* Text */}
        {showText && (
          <motion.text
            x="50"
            y="95"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            variants={animate ? textVariants : {}}
          >
            BRECOOL
          </motion.text>
        )}
      </motion.svg>
      <span className="sr-only">BRECOOL - الشعار الرسمي</span>
    </div>
  )
}
