"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "./auth-provider"
import { updateTechnicianStatus } from "@/lib/supabase"

interface StatusToggleProps {
  initialStatus?: boolean
  onStatusChange?: (status: boolean) => void
  className?: string
}

export function StatusToggle({ initialStatus = false, onStatusChange, className = "" }: StatusToggleProps) {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(initialStatus)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // تحميل الحالة الأولية من المستخدم
  useEffect(() => {
    if (isClient && user && user.is_active !== undefined) {
      setIsActive(user.is_active)
    }
  }, [user, isClient])

  const handleStatusChange = async (checked: boolean) => {
    setIsActive(checked)

    if (user && user.role === "technician") {
      try {
        await updateTechnicianStatus(user.id, checked)
      } catch (error) {
        console.error("Error updating technician status:", error)
        // إعادة الحالة إلى ما كانت عليه في حالة الخطأ
        setIsActive(!checked)
      }
    }

    if (onStatusChange) {
      onStatusChange(checked)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="status-toggle"
        checked={isActive}
        onCheckedChange={handleStatusChange}
        className="data-[state=checked]:bg-green-500"
      />
      <Label htmlFor="status-toggle" className="mr-2 text-sm font-medium">
        {isActive ? "متصل" : "غير متصل"}
      </Label>
    </div>
  )
}
