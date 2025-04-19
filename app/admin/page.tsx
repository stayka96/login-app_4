"use client"

import { useState, useEffect } from "react"
import { Users, Settings, TrendingUp } from "lucide-react"
import { WrenchLogo } from "@/components/wrench-logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { getAdminStats } from "@/lib/supabase"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [stats, setStats] = useState({
    usersCount: 0,
    techniciansCount: 0,
    activeOrdersCount: 0,
    completedOrdersCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!user || user.role !== "admin") {
        return
      }

      setIsLoading(true)
      try {
        const data = await getAdminStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading admin stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user])

  const recentRequests = [
    {
      id: 1,
      title: "تسريب مياه",
      user: "محمد أحمد",
      date: "اليوم، 10:30",
      status: "قيد الانتظار",
    },
    {
      id: 2,
      title: "مشكلة كهربائية",
      user: "أحمد علي",
      date: "اليوم، 09:15",
      status: "تم القبول",
    },
    {
      id: 3,
      title: "إصلاح باب",
      user: "سارة محمد",
      date: "أمس، 14:20",
      status: "مكتمل",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "قيد الانتظار":
        return "bg-yellow-100 text-yellow-800"
      case "تم القبول":
        return "bg-blue-100 text-blue-800"
      case "مكتمل":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // التحقق من صلاحيات المستخدم
  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">غير مصرح</h1>
          <p className="mb-4">ليس لديك صلاحية للوصول إلى لوحة الإدارة.</p>
          <Button onClick={() => (window.location.href = "/dashboard")}>العودة إلى الصفحة الرئيسية</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#0066FF] text-white p-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <WrenchLogo size="sm" className="w-8 h-8" />
            <h1 className="text-lg font-bold">لوحة الإدارة</h1>
          </div>
          <Button variant="ghost" className="text-white p-1">
            <Settings size={24} />
          </Button>
        </header>

        <main className="p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-6">لوحة الإحصائيات</h2>

          {isLoading ? (
            <div className="text-center py-8">جاري تحميل الإحصائيات...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">إجمالي المستخدمين</CardTitle>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Users size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.usersCount}</div>
                  <p className="text-xs flex items-center text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +12% منذ الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">إجمالي الحرفيين</CardTitle>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Users size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.techniciansCount}</div>
                  <p className="text-xs flex items-center text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +5% منذ الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">الطلبات النشطة</CardTitle>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <TrendingUp size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOrdersCount}</div>
                  <p className="text-xs flex items-center text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +18% منذ الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">الطلبات المكتملة</CardTitle>
                  <div className="p-2 bg-gray-100 rounded-full">
                    <TrendingUp size={24} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedOrdersCount}</div>
                  <p className="text-xs flex items-center text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +8% منذ الشهر الماضي
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <h3 className="text-xl font-bold mb-4">أحدث الطلبات</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            request.status,
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
