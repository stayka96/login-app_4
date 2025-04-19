"use client"

import { motion } from "framer-motion"

interface WorkMoneyLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animate?: boolean
  showText?: boolean
}

export function WorkMoneyLogo({ size = "md", className = "", animate = false, showText = true }: WorkMoneyLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const toolsVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const moneyVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
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
        <circle cx="50" cy="50" r="50" fill="#0066FF" />

        {/* Tools Group */}
        <motion.g variants={animate ? toolsVariants : {}}>
          {/* Wrench */}
          <path
            d="M30 40C25 40 20 35 20 30C20 25 25 20 30 20C32 20 34 21 35 22L45 12C44 11 43 9 43 7C43 2 48 -3 53 -3C58 -3 63 2 63 7C63 12 58 17 53 17C51 17 49 16 48 15L38 25C39 26 40 28 40 30C40 35 35 40 30 40Z"
            fill="white"
            stroke="#0066FF"
            strokeWidth="1"
          />

          {/* Hammer */}
          <path
            d="M65 35L75 25C77 23 80 23 82 25L85 28C87 30 87 33 85 35L75 45L65 35Z"
            fill="white"
            stroke="#0066FF"
            strokeWidth="1"
          />
          <path
            d="M65 35L55 45L50 50C48 52 48 55 50 57L53 60C55 62 58 62 60 60L65 55L75 45L65 35Z"
            fill="white"
            stroke="#0066FF"
            strokeWidth="1"
          />
        </motion.g>

        {/* Money Symbols */}
        <motion.g variants={animate ? moneyVariants : {}}>
          <circle cx="30" cy="70" r="15" fill="#4CAF50" />
          <text x="30" y="75" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
            $
          </text>

          <circle cx="70" cy="70" r="15" fill="#4CAF50" />
          <text x="70" y="75" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
            €
          </text>
        </motion.g>

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
