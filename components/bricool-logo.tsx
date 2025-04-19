"use client"

import { motion } from "framer-motion"

interface BricoolLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animate?: boolean
  showText?: boolean
}

export function BricoolLogo({ size = "md", className = "", animate = false, showText = true }: BricoolLogoProps) {
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
          d="M25 65C25 60 30 55 35 55C40 55 45 60 45 65C45 67 44 69 43 70L65 48C64 47 63 45 63 43C63 38 68 33 73 33C78 33 83 38 83 43C83 48 78 53 73 53C71 53 69 52 68 51L46 73C47 74 48 76 48 78C48 83 43 88 38 88C33 88 28 83 28 78C28 73 33 68 38 68"
          fill="white"
          stroke="white"
          strokeWidth="1"
          variants={animate ? wrenchVariants : {}}
        />

        {/* Screwdriver */}
        <motion.path
          d="M20 35L30 25C32 23 35 23 37 25L40 28C42 30 42 33 40 35L30 45L20 35Z"
          fill="white"
          variants={animate ? screwdriverVariants : {}}
        />
        <motion.path
          d="M30 45L20 55L15 60C13 62 13 65 15 67L18 70C20 72 23 72 25 70L30 65L40 55L30 45Z"
          fill="white"
          variants={animate ? screwdriverVariants : {}}
        />
        <motion.path
          d="M40 25L50 15C52 13 55 13 57 15L60 18C62 20 62 23 60 25L50 35L40 25Z"
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
            BRICOOL
          </motion.text>
        )}
      </motion.svg>
      <span className="sr-only">BRICOOL - الشعار الرسمي</span>
    </div>
  )
}
