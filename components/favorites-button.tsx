"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { toast } from "@/components/ui/use-toast"

interface FavoritesButtonProps {
  itemId: string
  itemType: "order" | "technician" | "offer"
  className?: string
}

export function FavoritesButton({ itemId, itemType, className = "" }: FavoritesButtonProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    // التحقق مما إذا كان العنصر مفضلاً بالفعل
    const checkFavorite = async () => {
      try {
        const response = await fetch(`/api/favorites/check?userId=${user.id}&itemId=${itemId}&itemType=${itemType}`)
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    checkFavorite()
  }, [user, itemId, itemType])

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب عليك تسجيل الدخول لإضافة عناصر إلى المفضلة",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          itemId,
          itemType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsFavorite(data.isFavorite)
        toast({
          title: data.isFavorite ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة",
          description: data.isFavorite
            ? "تمت إضافة العنصر إلى قائمة المفضلة بنجاح"
            : "تمت إزالة العنصر من قائمة المفضلة بنجاح",
        })
      } else {
        throw new Error(data.message || "حدث خطأ أثناء تحديث المفضلة")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المفضلة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full ${isFavorite ? "text-red-500" : "text-gray-400"} ${className}`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
      <span className="sr-only">{isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}</span>
    </Button>
  )
}
