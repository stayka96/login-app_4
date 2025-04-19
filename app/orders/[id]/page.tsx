"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, MessageSquare, Star, Loader2, MapPin, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProLogo } from "@/components/pro-logo"
import { useAuth } from "@/components/auth-provider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getOrderOffers, acceptOffer, createOffer, createNotification } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// بيانات تجريبية للعروض
const DEMO_OFFERS = [
  {
    id: "1",
    order_id: "1",
    technician_id: "tech-1",
    price: 250,
    estimated_time: "ساعتين",
    message: "يمكنني إصلاح التسريب بسرعة. لدي خبرة كبيرة في هذا النوع من المشاكل.",
    created_at: new Date().toISOString(),
    technician: {
      id: "tech-1",
      name: "أحمد محمد",
      avatar_url: "/placeholder.svg?height=50&width=50",
      rating: 4.8,
      completedJobs: 124,
    },
  },
  {
    id: "2",
    order_id: "1",
    technician_id: "tech-2",
    price: 200,
    estimated_time: "ثلاث ساعات",
    message: "سأقوم بإصلاح التسريب واختبار النظام بالكامل للتأكد من عدم وجود مشاكل أخرى.",
    created_at: new Date().toISOString(),
    technician: {
      id: "tech-2",
      name: "محمد علي",
      avatar_url: "/placeholder.svg?height=50&width=50",
      rating: 4.5,
      completedJobs: 98,
    },
  },
]

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)

  // للحرفيين - حالة تقديم عرض
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerPrice, setOfferPrice] = useState("")
  const [offerTime, setOfferTime] = useState("")
  const [offerMessage, setOfferMessage] = useState("")
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [offerError, setOfferError] = useState("")

  // تحديد ما إذا كنا في وضع تجريبي
  const isDemoMode = !params.id.includes("-") // ال UUIDs تحتوي على شرطات

  useEffect(() => {
    async function loadOrderDetails() {
      if (!user || !params.id) return

      setIsLoading(true)
      try {
        console.log("Loading order details for ID:", params.id)

        // تحميل تفاصيل الطلب
        // في التطبيق الحقيقي، يجب استرجاع تفاصيل الطلب من الخادم
        // هنا نقوم بمحاكاة ذلك
        const mockOrder = {
          id: params.id,
          title: "تسريب مياه في المطبخ",
          description:
            "هناك تسريب مياه تحت حوض المطبخ، يبدو أنه من الأنبوب الرئيسي. أحتاج إلى إصلاح سريع قبل أن يسبب ضررًا أكبر للمطبخ.",
          status: "reviewing",
          created_at: "2023-06-15T10:30:00Z",
          category: "plumbing",
          categoryLabel: "سباكة",
          location: "الرباط، حي الرياض",
          urgency: "متوسطة",
          price_range: "200 - 300 درهم",
          images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
          user_id: user.role === "user" ? user.id : "other-user-id",
          user: {
            name: "محمد أحمد",
            avatar_url: "/placeholder.svg?height=40&width=40",
            phone: "06xxxxxxxx",
          },
        }

        setOrder(mockOrder)
        console.log("Order loaded:", mockOrder)

        // تحميل العروض المقدمة
        if (isDemoMode) {
          // استخدام بيانات تجريبية في وضع العرض
          setOffers(DEMO_OFFERS)
          console.log("Loaded demo offers:", DEMO_OFFERS)
        } else {
          // في وضع الإنتاج، استرجاع البيانات الحقيقية من Supabase
          const { data, error } = await getOrderOffers(params.id)
          if (error) {
            console.error("Error loading offers:", error)
            throw error
          }
          setOffers(data || [])
          console.log("Loaded real offers:", data)
        }
      } catch (error) {
        console.error("Error loading order details:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل تفاصيل الطلب",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderDetails()
  }, [user, params.id, isDemoMode])

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

  const handleAcceptOffer = async (offerId: string | number, technicianId: string) => {
    if (!user || !order) return

    setIsAccepting(true)

    try {
      console.log("Accepting offer:", offerId, "for technician:", technicianId)

      if (!isDemoMode) {
        // في وضع الإنتاج، إرسال إلى Supabase
        const { error } = await acceptOffer(offerId.toString(), order.id, technicianId)
        if (error) {
          console.error("Error accepting offer:", error)
          throw error
        }

        // إرسال إشعار للحرفي
        await createNotification({
          user_id: technicianId,
          title: "تم قبول عرضك",
          message: `تم قبول عرضك للطلب: ${order.title}`,
          type: "offer",
        })
      }

      // إضافة إشعار محلي باستخدام toast
      toast({
        title: "تم قبول العرض",
        description: "تم قبول عرض الفني بنجاح. سيتواصل معك قريبًا.",
      })

      // تحديث حالة الطلب
      setOrder({ ...order, status: "accepted" })

      // التوجيه إلى صفحة المحادثة مع الفني بعد فترة قصيرة
      setTimeout(() => {
        router.push(`/messages/${technicianId}`)
      }, 1500)
    } catch (error: any) {
      console.error("Error accepting offer:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قبول العرض. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setOfferError("")

    if (!user || !order) return

    // التحقق من صحة البيانات
    if (!offerPrice) {
      setOfferError("السعر مطلوب")
      return
    }
    if (!offerTime) {
      setOfferError("الوقت المقدر مطلوب")
      return
    }
    if (!offerMessage) {
      setOfferError("الرسالة مطلوبة")
      return
    }

    setIsSubmittingOffer(true)

    try {
      console.log("Submitting offer:", {
        order_id: order.id,
        technician_id: user.id,
        price: Number.parseFloat(offerPrice),
        estimated_time: offerTime,
        message: offerMessage,
      })

      let newOffer

      if (!isDemoMode) {
        // في وضع الإنتاج، إرسال إلى Supabase
        const { data, error } = await createOffer({
          order_id: order.id,
          technician_id: user.id,
          price: Number.parseFloat(offerPrice),
          estimated_time: offerTime,
          message: offerMessage,
        })

        if (error) {
          console.error("Error creating offer:", error)
          throw error
        }

        newOffer = data[0]

        // إرسال إشعار لصاحب الطلب
        await createNotification({
          user_id: order.user_id,
          title: "عرض جديد",
          message: `لديك عرض جديد على طلب: ${order.title}`,
          type: "offer",
        })
      } else {
        // في وضع العرض التجريبي، إنشاء كائن عرض محاكى
        newOffer = {
          id: `demo-${Date.now()}`,
          order_id: order.id,
          technician_id: user.id,
          price: Number.parseFloat(offerPrice),
          estimated_time: offerTime,
          message: offerMessage,
          created_at: new Date().toISOString(),
        }
      }

      // إضافة العرض إلى القائمة
      setOffers((prev) => [
        ...prev,
        {
          ...newOffer,
          technician: {
            id: user.id,
            name: user.name,
            avatar_url: user.avatar_url,
            rating: 4.5, // قيمة افتراضية
            completedJobs: 30, // قيمة افتراضية
          },
        },
      ])

      // إغلاق نموذج تقديم العرض
      setShowOfferForm(false)
      setOfferPrice("")
      setOfferTime("")
      setOfferMessage("")

      // إضافة إشعار محلي باستخدام toast
      toast({
        title: "تم تقديم العرض",
        description: "تم تقديم عرضك بنجاح. سيتم إشعارك عند قبوله.",
      })
    } catch (error: any) {
      console.error("Error submitting offer:", error)
      setOfferError(error.message || "حدث خطأ أثناء تقديم العرض")
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تقديم العرض",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  if (isLoading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
          <p className="text-lg font-semibold text-gray-700">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    )
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
          <h1 className="text-xl font-bold">تفاصيل الطلب</h1>
        </div>
        <div className="w-8"></div> {/* للمحافظة على التوازن */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 max-w-md mx-auto">
        {/* بطاقة معلومات الطلب */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="overflow-hidden border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                <CardTitle className="text-xl">{order.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-700 text-base">{order.description}</CardDescription>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString("ar-MA")}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  <span>{new Date(order.created_at).toLocaleTimeString("ar-MA")}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={14} />
                  <span>{order.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <User size={14} />
                  <span>{order.user?.name || "مستخدم"}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">أولوية:</span>
                <Badge variant="outline" className="w-fit">
                  {order.urgency || "عادية"}
                </Badge>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">ميزانية تقديرية:</span>
                <span className="font-semibold text-green-600">{order.price_range || "غير محدد"}</span>
              </div>

              {/* صور المشكلة */}
              {order.images && order.images.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2 text-sm text-gray-500">صور المشكلة:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {order.images.map((image: string, index: number) => (
                      <div key={index} className="relative h-40 rounded-lg overflow-hidden border">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`صورة ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              {/* تواصل مع المستخدم - للحرفيين فقط */}
              {user.role === "technician" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => router.push(`/messages/${order.user_id}`)}
                >
                  <MessageSquare size={16} />
                  تواصل مع المستخدم
                </Button>
              )}

              {/* تواصل مع الحرفي - للمستخدمين فقط */}
              {user.role === "user" && order.status === "accepted" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => router.push(`/messages/${order.technician_id}`)}
                >
                  <MessageSquare size={16} />
                  تواصل مع الحرفي
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {/* زر تقديم عرض - للحرفيين فقط */}
        {user.role === "technician" && order.status === "pending" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              {!showOfferForm ? (
                <CardContent className="p-4">
                  <Button
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    onClick={() => setShowOfferForm(true)}
                  >
                    تقديم عرض
                  </Button>
                </CardContent>
              ) : (
                <CardContent className="p-4">
                  <form onSubmit={handleSubmitOffer} className="space-y-4">
                    <h3 className="text-lg font-bold">تقديم عرض</h3>

                    <div className="space-y-2">
                      <label htmlFor="price" className="block font-medium">
                        السعر (درهم)
                      </label>
                      <Input
                        id="price"
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="مثال: 300"
                        className="text-right"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="time" className="block font-medium">
                        الوقت المقدر
                      </label>
                      <Input
                        id="time"
                        value={offerTime}
                        onChange={(e) => setOfferTime(e.target.value)}
                        placeholder="مثال: ساعة واحدة"
                        className="text-right"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block font-medium">
                        رسالة
                      </label>
                      <Textarea
                        id="message"
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        placeholder="اشرح كيف يمكنك حل المشكلة..."
                        className="text-right min-h-[100px]"
                        required
                      />
                    </div>

                    {offerError && <p className="text-red-500 text-sm">{offerError}</p>}

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                        disabled={isSubmittingOffer}
                      >
                        {isSubmittingOffer ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الإرسال...
                          </>
                        ) : (
                          "إرسال العرض"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowOfferForm(false)}
                        disabled={isSubmittingOffer}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}

        {/* العروض المقدمة - للمستخدمين فقط */}
        {user.role === "user" && (
          <div>
            <h3 className="text-lg font-bold mb-3">العروض المقدمة ({offers.length})</h3>
            {offers.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="text-center p-6">
                  <CardContent>
                    <div className="py-8 text-gray-500">لا توجد عروض مقدمة بعد</div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={offer.technician.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback>{offer.technician.name?.charAt(0) || "م"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{offer.technician.name}</CardTitle>
                              <div className="flex items-center text-sm">
                                <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                                <span className="mr-1">{offer.technician.rating}</span>
                                <span className="text-gray-500 text-xs">
                                  ({offer.technician.completedJobs || 0} مهمة)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-xl text-green-600">{offer.price} درهم</div>
                            <div className="text-sm text-gray-500">{offer.estimated_time}</div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="py-2">
                        <p className="text-gray-700">{offer.message}</p>
                      </CardContent>

                      <CardFooter className="flex justify-between pt-2 border-t">
                        <Button
                          className="flex-1 mr-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                          onClick={() => handleAcceptOffer(offer.id, offer.technician_id)}
                          disabled={isAccepting || order.status !== "reviewing"}
                        >
                          {isAccepting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              جاري القبول...
                            </>
                          ) : (
                            "قبول العرض"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => router.push(`/messages/${offer.technician_id}`)}
                        >
                          <MessageSquare size={16} />
                          محادثة
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* زر التقييم - للمستخدمين فقط وللطلبات المكتملة */}
        {user.role === "user" && order.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              onClick={() => router.push(`/rate-service/${order.id}`)}
            >
              تقييم الخدمة
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
