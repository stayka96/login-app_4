"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { ProLogo } from "@/components/pro-logo"
import { BottomNav } from "@/components/bottom-nav"

export default function FavoritesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"technicians" | "orders" | "offers">("technicians")
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadFavorites = async () => {
      setIsLoading(true)
      try {
        // في التطبيق الحقيقي، استرجع البيانات من الخادم
        // هنا نستخدم بيانات تجريبية
        setTimeout(() => {
          let demoData: any[] = []

          if (activeTab === "technicians") {
            demoData = [
              {
                id: "tech-1",
                name: "أحمد محمد",
                profession: "سباكة",
                rating: 4.8,
                image: "/placeholder.svg?height=100&width=100",
                isOnline: true,
                completedJobs: 124,
              },
              {
                id: "tech-2",
                name: "محمد علي",
                profession: "كهرباء",
                rating: 4.7,
                image: "/placeholder.svg?height=100&width=100",
                isOnline: false,
                completedJobs: 98,
              },
            ]
          } else if (activeTab === "orders") {
            demoData = [
              {
                id: "order-1",
                title: "تسريب مياه في المطبخ",
                category: "plumbing",
                categoryLabel: "سباكة",
                image: "/placeholder.svg?height=200&width=300",
                date: "2023-06-15",
                status: "pending",
                location: "الرباط، حي الرياض",
              },
            ]
          } else if (activeTab === "offers") {
            demoData = [
              {
                id: "offer-1",
                title: "خصم 20% على خدمات السباكة",
                description: "استفد من خصم 20% على جميع خدمات السباكة خلال هذا الشهر",
                price: 200,
                discount: 20,
                category: "plumbing",
                categoryLabel: "سباكة",
                image: "/placeholder.svg?height=200&width=300",
                expiryDate: "2023-07-30",
              },
            ]
          }

          setFavorites(demoData)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error loading favorites:", error)
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [user, router, activeTab])

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 flex items-center justify-between">
        <Button variant="ghost" className="text-white p-0" onClick={() => router.back()}>
          <ArrowRight size={24} />
        </Button>
        <div className="flex items-center gap-2">
          <ProLogo size="sm" className="w-10 h-10" />
          <h1 className="text-xl font-bold">المفضلة</h1>
        </div>
        <div className="w-8"></div> {/* للمحافظة على التوازن */}
      </header>

      {/* Tabs */}
      <div className="p-4">
        <Tabs defaultValue="technicians" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="technicians">الحرفيون</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="offers">العروض</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mr-2 text-gray-600">جاري التحميل...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Heart className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-bold text-lg text-gray-700">لا توجد عناصر في المفضلة</h3>
            <p className="text-gray-500 max-w-xs">
              {activeTab === "technicians"
                ? "لم تقم بإضافة أي حرفي إلى المفضلة بعد"
                : activeTab === "orders"
                  ? "لم تقم بإضافة أي طلب إلى المفضلة بعد"
                  : "لم تقم بإضافة أي عرض إلى المفضلة بعد"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "technicians" && (
              <div className="grid grid-cols-2 gap-4">
                {favorites.map((technician) => (
                  <Card
                    key={technician.id}
                    className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/technician/${technician.id}`)}
                  >
                    <div className="relative mx-auto mb-2">
                      <Image
                        src={technician.image || "/placeholder.svg"}
                        alt={technician.name}
                        width={80}
                        height={80}
                        className="rounded-full mx-auto border-2 border-blue-100"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                          technician.isOnline ? "bg-green-500" : "bg-gray-400"
                        } ${technician.isOnline ? "animate-pulse" : ""}`}
                      ></span>
                    </div>
                    <h3 className="font-bold text-lg">{technician.name}</h3>
                    <p className="text-gray-600">{technician.profession}</p>
                    <div className="flex items-center justify-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-yellow-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm mr-1">{technician.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{technician.completedJobs} مهمة منجزة</p>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {favorites.map((order) => (
                  <Card
                    key={order.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                        <Image
                          src={order.image || "/placeholder.svg"}
                          alt={order.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 mr-4">
                        <h3 className="font-bold text-lg">{order.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3 ml-1"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{order.location}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-500 text-xs flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-3 h-3 ml-1"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {new Date(order.date).toLocaleDateString("ar-MA")}
                          </span>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{order.categoryLabel}</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "offers" && (
              <div className="space-y-4">
                {favorites.map((offer) => (
                  <Card
                    key={offer.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/offers/${offer.id}`)}
                  >
                    <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                      <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        خصم {offer.discount}%
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                      <p className="text-gray-600 mb-3">{offer.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{offer.categoryLabel}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through">{offer.price} درهم</span>
                          <span className="text-blue-600 font-bold">
                            {offer.price - (offer.price * offer.discount) / 100} درهم
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        ينتهي في {new Date(offer.expiryDate).toLocaleDateString("ar-MA")}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
