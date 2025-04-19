"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { getUserOrders } from "@/lib/supabase"
import { BottomNav } from "@/components/bottom-nav"
import { WrenchLogo } from "@/components/wrench-logo"

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user) return

      setIsLoading(true)
      try {
        const { data, error } = await getUserOrders(user.id)
        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewing":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "reviewing":
        return "قيد المراجعة"
      case "accepted":
        return "تم القبول"
      case "completed":
        return "مكتمل"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
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
          <h1 className="text-2xl font-bold">طلباتي</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">لا توجد طلبات. أضف طلبك الأول!</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <h3 className="font-bold text-lg">{order.title}</h3>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>{order.category}</span>
                    <span>{new Date(order.created_at).toLocaleDateString("ar-MA")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="orders" />
    </div>
  )
}
