"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WrenchLogo } from "@/components/wrench-logo"
import { useAuth } from "@/components/auth-provider"
import { BottomNav } from "@/components/bottom-nav"

// نوع العرض
interface Offer {
  id: string
  title: string
  description: string
  price: number
  discount: number
  category: string
  categoryLabel: string
  image: string
  expiryDate: string
}

export default function Offers() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  // العروض المتوفرة
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([
    {
      id: "1",
      title: "خصم 20% على خدمات السباكة",
      description: "استفد من خصم 20% على جميع خدمات السباكة خلال هذا الشهر",
      price: 200,
      discount: 20,
      category: "plumbing",
      categoryLabel: "سباكة",
      image: "/images/plumbing.jpg",
      expiryDate: "2023-07-30",
    },
    {
      id: "2",
      title: "فحص مجاني للأعطال الكهربائية",
      description: "احصل على فحص مجاني للأعطال الكهربائية عند طلب أي خدمة كهربائية",
      price: 150,
      discount: 100,
      category: "electricity",
      categoryLabel: "كهرباء",
      image: "/images/electricity.jpg",
      expiryDate: "2023-07-15",
    },
    {
      id: "3",
      title: "خصم 15% على أعمال النجارة",
      description: "خصم خاص على جميع أعمال النجارة والإصلاحات الخشبية",
      price: 300,
      discount: 15,
      category: "carpentry",
      categoryLabel: "نجارة",
      image: "/images/door.jpg",
      expiryDate: "2023-08-10",
    },
  ])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push("/")
    }
  }, [user, loading, router, isClient])

  if (loading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-[#0066FF] text-white p-4 flex items-center justify-between">
        <Button variant="ghost" className="text-white p-0" onClick={() => router.back()}>
          <ArrowRight size={24} />
        </Button>
        <div className="flex items-center gap-2">
          <WrenchLogo size="sm" className="w-10 h-10" />
          <h1 className="text-xl font-bold">العروض المتوفرة</h1>
        </div>
        <div className="w-8"></div> {/* للمحافظة على التوازن */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="space-y-4">
          {availableOffers.map((offer) => (
            <Card key={offer.id} className="p-4 border rounded-lg overflow-hidden">
              <div className="flex flex-col">
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
                      <span className="text-[#0066FF] font-bold">
                        {offer.price - (offer.price * offer.discount) / 100} درهم
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ينتهي في {new Date(offer.expiryDate).toLocaleDateString("ar-MA")}
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-[#0066FF] hover:bg-[#0055DD]"
                  onClick={() => router.push(`/offers/${offer.id}`)}
                >
                  استفد من العرض
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
