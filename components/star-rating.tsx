"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface StarRatingProps {
  initialRating?: number
  totalStars?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  initialRating = 0,
  totalStars = 5,
  size = "md",
  readOnly = false,
  onChange,
  className = "",
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleStarClick = (selectedRating: number) => {
    if (readOnly) return

    setRating(selectedRating)
    if (onChange) {
      onChange(selectedRating)
    }
  }

  const starSize = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const containerSize = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  }

  return (
    <div className={`flex ${containerSize[size]} ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1
        const isFilled = (hoveredRating || rating) >= starValue

        return (
          <motion.button
            key={index}
            type="button"
            className={`focus:outline-none ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => !readOnly && setHoveredRating(starValue)}
            onMouseLeave={() => !readOnly && setHoveredRating(0)}
            whileHover={!readOnly ? { scale: 1.2 } : {}}
            whileTap={!readOnly ? { scale: 0.9 } : {}}
          >
            <Star
              className={`${starSize[size]} ${
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              } transition-colors`}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
