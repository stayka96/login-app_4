"use client"

import { motion } from "framer-motion"

interface ProLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animate?: boolean
  showText?: boolean
}

export function ProLogo({ size = "md", className = "", animate = false, showText = true }: ProLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const logoVariants = {
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

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.4,
        ease: "easeOut",
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
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
        variants={logoVariants}
      >
        {/* Main Circle */}
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background Shape */}
        <circle cx="50" cy="50" r="48" fill="url(#blueGradient)" filter="url(#shadow)" />

        {/* Interior Circle */}
        <circle cx="50" cy="50" r="40" fill="white" opacity="0.1" />

        {/* Tool Icon - Wrench */}
        <motion.path
          d="M35 65C30 65 25 60 25 55C25 50 30 45 35 45C37 45 39 46 40 47L60 27C59 26 58 24 58 22C58 17 63 12 68 12C73 12 78 17 78 22C78 27 73 32 68 32C66 32 64 31 63 30L43 50C44 51 45 53 45 55C45 60 40 65 35 65Z"
          fill="white"
          variants={animate ? iconVariants : {}}
          custom={1}
        />

        {/* Money Icon - Dollar */}
        <motion.circle
          cx="30"
          cy="30"
          r="12"
          fill="url(#goldGradient)"
          variants={animate ? iconVariants : {}}
          custom={2}
        />
        <motion.text
          x="30"
          y="34"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
          variants={animate ? iconVariants : {}}
          custom={2.5}
        >
          $
        </motion.text>

        {/* Work Icon - Hammer */}
        <motion.circle
          cx="70"
          cy="70"
          r="12"
          fill="url(#greenGradient)"
          variants={animate ? iconVariants : {}}
          custom={3}
        />
        <motion.path
          d="M65 75L70 70L75 65L70 60L65 65L60 70L65 75Z"
          fill="white"
          stroke="white"
          strokeWidth="1"
          variants={animate ? iconVariants : {}}
          custom={3.5}
        />

        {/* Text */}
        {showText && (
          <motion.g variants={animate ? textVariants : {}}>
            <text x="50" y="90" fontSize="12" fontWeight="bold" textAnchor="middle" fill="white" filter="url(#shadow)">
              BRICOOL PRO
            </text>
          </motion.g>
        )}
      </motion.svg>
      <span className="sr-only">BRICOOL PRO - الشعار الرسمي</span>
    </div>
  )
}
