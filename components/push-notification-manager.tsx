"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-provider"

export function PushNotificationManager() {
  const { user } = useAuth()
  const [permission, setPermission] = useState<NotificationPermission | "default">("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications not supported")
      return
    }

    // التحقق من حالة الإذن
    setPermission(Notification.permission)

    // تسجيل Service Worker إذا لم يكن مسجلاً بالفعل
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        reg.pushManager.getSubscription().then((sub) => {
          setSubscription(sub)
        })
      })
    } else {
      navigator.serviceWorker.register("/service-worker.js").then((reg) => {
        setRegistration(reg)
      })
    }
  }, [])

  const subscribeUser = async () => {
    if (!registration) return

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })

      setSubscription(sub)

      // إرسال الاشتراك إلى الخادم
      if (user) {
        await saveSubscription(user.id, sub)
        toast({
          title: "تم تفعيل الإشعارات",
          description: "ستتلقى الآن إشعارات فورية من تطبيق Bricool",
        })
      }
    } catch (err) {
      console.error("Failed to subscribe the user: ", err)
      toast({
        title: "فشل تفعيل الإشعارات",
        description: "يرجى التحقق من إعدادات المتصفح الخاص بك",
        variant: "destructive",
      })
    }
  }

  const requestPermission = () => {
    Notification.requestPermission().then((result) => {
      setPermission(result)
      if (result === "granted") {
        subscribeUser()
      }
    })
  }

  // تحويل المفتاح العام VAPID إلى تنسيق مناسب
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // حفظ الاشتراك في الخادم
  async function saveSubscription(userId: string, subscription: PushSubscription) {
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        subscription: subscription.toJSON(),
      }),
    })

    return response.json()
  }

  if (!user || permission === "granted" || subscription) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 border border-blue-200">
      <div className="flex items-center gap-3">
        <Bell className="text-blue-500" />
        <div className="flex-1">
          <h3 className="font-bold">تفعيل الإشعارات</h3>
          <p className="text-sm text-gray-600">احصل على إشعارات فورية للرسائل والعروض الجديدة</p>
        </div>
        <Button onClick={requestPermission} className="bg-blue-500 hover:bg-blue-600">
          تفعيل
        </Button>
      </div>
    </div>
  )
}
