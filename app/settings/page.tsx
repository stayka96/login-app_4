"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Bell, Shield, LogOut } from "lucide-react"
import { WrenchLogo } from "@/components/wrench-logo"
import { StatusToggle } from "@/components/status-toggle"
import { useAuth } from "@/components/auth-provider"
import { BottomNav } from "@/components/bottom-nav"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // تحديث استدعاء وظيفة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await logout()
      // تم تحديث وظيفة تسجيل الخروج في AuthProvider لتقوم بالتوجيه تلقائيًا
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const settingsOptions = [
    {
      id: "profile",
      title: "الملف الشخصي",
      icon: <User size={20} />,
    },
    {
      id: "notifications",
      title: "الإشعارات",
      icon: <Bell size={20} />,
    },
    {
      id: "privacy",
      title: "الخصوصية والأمان",
      icon: <Shield size={20} />,
    },
    {
      id: "logout",
      title: "تسجيل الخروج",
      icon: <LogOut size={20} />,
      danger: true,
      onClick: async () => {
        await logout()
      },
    },
  ]

  const handleStatusChange = (status: boolean) => {
    // إرسال الحالة إلى الخادم (محاكاة)
    console.log("تغيير الحالة إلى:", status ? "متصل" : "غير متصل")
  }

  if (!isClient) {
    return null // No renderizar nada durante SSR
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-[#0066FF] text-white p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <WrenchLogo size="sm" className="w-10 h-10" />
          <h1 className="text-2xl font-bold">الإعدادات</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 flex items-center gap-4">
            <Image
              src={user.avatar_url || "/placeholder.svg?height=80&width=80"}
              alt="صورة الملف الشخصي"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.phone}</p>
              <p className="text-xs text-gray-500">
                {user.role === "user" ? "مستخدم" : user.role === "technician" ? "حرفي" : "مدير"}
              </p>
            </div>

            {/* إظهار زر تبديل الحالة للحرفيين فقط */}
            {user.role === "technician" && <StatusToggle onStatusChange={handleStatusChange} />}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm divide-y">
          {settingsOptions.map((option) => (
            <div key={option.id}>
              {option.onClick ? (
                // تحديث زر تسجيل الخروج (داخل الدالة)
                <button
                  onClick={handleLogout}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 w-full text-right text-red-600`}
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>تسجيل الخروج</span>
                  </div>
                </button>
              ) : (
                <Link
                  href={`/settings/${option.id}`}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                    option.danger ? "text-red-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <span>{option.title}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* إظهار رابط لوحة الإدارة للمديرين فقط */}
        {user.role === "admin" && (
          <div className="mt-6">
            <Link
              href="/admin"
              className="block w-full py-4 text-center bg-[#0066FF] text-white rounded-lg font-semibold hover:bg-[#0055DD]"
            >
              الذهاب إلى لوحة الإدارة
            </Link>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="settings" />
    </div>
  )
}
