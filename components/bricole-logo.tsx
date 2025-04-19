"use client"

import { motion } from "framer-motion"

interface BricoleLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animate?: boolean
}

export function BricoleLogo({ size = "md", className = "", animate = false }: BricoleLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const screwdriverVariants = {
    hidden: { rotate: -45, scale: 0.8, opacity: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut",
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
        {/* Background Circle */}
        <motion.circle cx="50" cy="50" r="45" fill="#0066FF" variants={animate ? circleVariants : {}} />

        {/* Screwdriver Handle */}
        <motion.path
          d="M30 65C30 60 35 55 40 55C45 55 50 60 50 65C50 70 45 75 40 75C35 75 30 70 30 65Z"
          fill="#FFA500"
          stroke="white"
          strokeWidth="2"
          variants={animate ? screwdriverVariants : {}}
        />

        {/* Screwdriver Shaft */}
        <motion.path
          d="M50 65L75 40C76 39 76 37 75 36C74 35 72 35 71 36L46 61C47 62 48 63 50 65Z"
          fill="#D3D3D3"
          stroke="white"
          strokeWidth="2"
          variants={animate ? screwdriverVariants : {}}
        />

        {/* Screwdriver Tip */}
        <motion.path
          d="M75 40L80 35C81 34 81 32 80 31C79 30 77 30 76 31L71 36C72 37 74 39 75 40Z"
          fill="#A9A9A9"
          stroke="white"
          strokeWidth="2"
          variants={animate ? screwdriverVariants : {}}
        />

        {/* Text */}
        <motion.text
          x="50"
          y="90"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          variants={animate ? textVariants : {}}
        >
          بريكول
        </motion.text>
      </motion.svg>
      <span className="sr-only">بريكول - الشعار الرسمي</span>
    </div>
  )
}
