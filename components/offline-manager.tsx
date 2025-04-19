"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OfflineManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    // تعيين الحالة الأولية
    setIsOnline(navigator.onLine)

    // إضافة مستمعي الأحداث
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "متصل بالإنترنت",
        description: "تم استعادة الاتصال بالإنترنت",
        variant: "default",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowAlert(true)
      toast({
        title: "غير متصل بالإنترنت",
        description: "أنت الآن في وضع عدم الاتصال. بعض الميزات قد لا تعمل.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline || !showAlert) return null

  return (
    <Alert variant="destructive" className="fixed bottom-16 left-4 right-4 z-50">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>غير متصل بالإنترنت</AlertTitle>
      <AlertDescription>أنت الآن في وضع عدم الاتصال. بعض الميزات قد لا تعمل حتى تستعيد الاتصال.</AlertDescription>
      <button className="absolute top-2 right-2 text-xs underline" onClick={() => setShowAlert(false)}>
        إغلاق
      </button>
    </Alert>
  )
}
