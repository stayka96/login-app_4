"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
import {
  Home,
  ListChecks,
  MessageSquare,
  Settings,
  Plus,
  Clock,
  Star,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Bell,
  Search,
  MapPin,
  Calendar,
  Loader2,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { ProLogo } from "@/components/pro-logo"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// إضافة دعم للوضع غير المتصل:
import { OfflineManager } from "@/components/offline-manager"
import { PushNotificationManager } from "@/components/push-notification-manager"

// نوع المشكلة
interface Problem {
  id: string
  title: string
  category: string
  categoryLabel: string
  image: string
  date: string
  status: string
  location: string
  price?: number
}

// نوع الحرفي
interface Technician {
  id: string
  name: string
  profession: string
  rating: number
  image: string
  isOnline: boolean
  completedJobs?: number
}

// مكون متحرك للعناصر عند الظهور
function AnimatedSection({ children, delay = 0, className = "" }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
            delay: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// مكون لوحة التحكم للمستخدم العادي
function UserDashboard({ user }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // مشاكل المستخدم الأخيرة
  const [recentProblems, setRecentProblems] = useState<Problem[]>([
    {
      id: "1",
      title: "تسريب مياه",
      category: "plumbing",
      categoryLabel: "سباكة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-15",
      status: "pending",
      location: "الرباط، حي الرياض",
    },
    {
      id: "2",
      title: "أسلاك كهربائية تالفة",
      category: "electricity",
      categoryLabel: "كهرباء",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-10",
      status: "in-progress",
      location: "الدار البيضاء، حي المعاريف",
    },
    {
      id: "3",
      title: "باب لا يغلق بشكل جيد",
      category: "carpentry",
      categoryLabel: "نجارة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-05",
      status: "completed",
      location: "مراكش، المدينة القديمة",
    },
  ])

  // الحرفيون المميزون
  const [featuredTechnicians, setFeaturedTechnicians] = useState<Technician[]>([
    {
      id: "1",
      name: "أحمد محمد",
      profession: "سباكة",
      rating: 4.8,
      image: "/placeholder.svg?height=100&width=100",
      isOnline: true,
      completedJobs: 124,
    },
    {
      id: "2",
      name: "محمد علي",
      profession: "كهرباء",
      rating: 4.7,
      image: "/placeholder.svg?height=100&width=100",
      isOnline: true,
      completedJobs: 98,
    },
    {
      id: "3",
      name: "خالد عمر",
      profession: "نجارة",
      rating: 4.9,
      image: "/placeholder.svg?height=100&width=100",
      isOnline: false,
      completedJobs: 156,
    },
  ])

  // الفئات الشائعة
  const categories = [
    { id: "plumbing", name: "سباكة", icon: <Wrench className="h-6 w-6" />, color: "bg-blue-500" },
    { id: "electricity", name: "كهرباء", icon: <Zap className="h-6 w-6" />, color: "bg-yellow-500" },
    { id: "carpentry", name: "نجارة", icon: <Hammer className="h-6 w-6" />, color: "bg-orange-500" },
    { id: "painting", name: "دهان", icon: <Paintbrush className="h-6 w-6" />, color: "bg-green-500" },
  ]

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      toast({
        title: "تم تحديث الطلبات",
        description: "تم تحديث قائمة الطلبات الخاصة بك",
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "in-progress":
        return "قيد التنفيذ"
      case "completed":
        return "مكتمل"
      default:
        return status
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "جاري البحث",
        description: `جاري البحث عن: ${searchQuery}`,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message & Search */}
      <AnimatedSection delay={0.1}>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
            <h2 className="text-xl font-bold mb-2">مرحباً، {user.name || "مستخدم"}</h2>
            <p className="mb-4 opacity-90">ما هي المشكلة التي تحتاج إلى حلها اليوم؟</p>
          </div>
          <div className="p-4 bg-white">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="ابحث عن خدمة أو حرفي..."
                className="pl-3 pr-10 text-right border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 px-2 h-7"
                onClick={handleSearch}
              >
                بحث
              </Button>
            </div>
          </div>
        </Card>
      </AnimatedSection>

      {/* Add Problem Button */}
      <AnimatedSection delay={0.2}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 rounded-xl flex items-center justify-center gap-2 shadow-lg border-0"
            onClick={() => router.push("/add-problem")}
          >
            <Plus size={24} />
            <span>إضافة مشكلة جديدة</span>
          </Button>
        </motion.div>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection delay={0.3}>
        <div className="flex justify-between items-center mb-3">
          <Link href="/categories" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            عرض الكل
            <ChevronRight size={16} />
          </Link>
          <h2 className="text-xl font-bold">الفئات الشائعة</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant="outline"
                className="flex flex-col items-center p-3 h-auto w-full bg-white hover:bg-blue-50 border-2 hover:border-blue-300"
                onClick={() => router.push(`/category/${category.id}`)}
              >
                <div className={`${category.color} text-white p-3 rounded-full mb-2`}>{category.icon}</div>
                <span className="text-sm font-medium">{category.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Featured Technicians */}
      <AnimatedSection delay={0.4} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <Link href="/technicians" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            عرض الكل
            <ChevronRight size={16} />
          </Link>
          <h2 className="text-xl font-bold">حرفيون مميزون</h2>
        </div>
        <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
          {featuredTechnicians.map((technician, index) => (
            <motion.div
              key={technician.id}
              className="flex-shrink-0 w-36 bg-white rounded-lg shadow-sm p-3 text-center cursor-pointer"
              onClick={() => router.push(`/technician/${technician.id}`)}
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="relative mx-auto mb-2">
                <Image
                  src={technician.image || "/placeholder.svg"}
                  alt={technician.name}
                  width={60}
                  height={60}
                  className="rounded-full mx-auto border-2 border-blue-100"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    technician.isOnline ? "bg-green-500" : "bg-gray-400"
                  } ${technician.isOnline ? "animate-pulse" : ""}`}
                ></span>
              </div>
              <h3 className="font-bold text-sm">{technician.name}</h3>
              <p className="text-gray-600 text-xs">{technician.profession}</p>
              <div className="flex items-center justify-center mt-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm mr-1">{technician.rating}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{technician.completedJobs} مهمة منجزة</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Recent Problems */}
      <AnimatedSection delay={0.5}>
        <div className="flex justify-between items-center mb-3">
          <Link href="/orders" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            عرض الكل
            <ChevronRight size={16} />
          </Link>
          <h2 className="text-xl font-bold">مشاكلك الأخيرة</h2>
        </div>
        <div className="space-y-3">
          {recentProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <Card className="p-3 border rounded-lg overflow-hidden">
                <Link href={`/orders/${problem.id}`} className="flex items-center justify-between">
                  <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                    <Image
                      src={problem.image || "/placeholder.svg"}
                      alt={problem.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 mr-4 text-right">
                    <h3 className="text-lg font-bold">{problem.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin size={12} className="ml-1" />
                      <span>{problem.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500 text-xs flex items-center">
                        <Clock size={12} className="ml-1" />
                        {new Date(problem.date).toLocaleDateString("ar-MA")}
                      </span>
                      <div className="flex gap-2">
                        <Badge className={`${getStatusColor(problem.status)}`}>{getStatusText(problem.status)}</Badge>
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{problem.categoryLabel}</Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Available Offers */}
      <AnimatedSection delay={0.6}>
        <motion.div className="mt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full py-4 text-lg font-semibold text-blue-600 border-blue-300 hover:bg-blue-50 rounded-xl shadow-sm"
            onClick={() => router.push("/offers")}
          >
            العروض المتوفرة
          </Button>
        </motion.div>
      </AnimatedSection>
    </div>
  )
}

// مكون لوحة التحكم للحرفي
function TechnicianDashboard({ user }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const { toast } = useToast()

  // طلبات العمل المتاحة
  const [availableJobs, setAvailableJobs] = useState<Problem[]>([
    {
      id: "1",
      title: "تسريب مياه في المطبخ",
      category: "plumbing",
      categoryLabel: "سباكة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-15",
      status: "pending",
      location: "الرباط، حي الرياض",
      price: 300,
    },
    {
      id: "2",
      title: "إصلاح مفتاح كهربائي",
      category: "electricity",
      categoryLabel: "كهرباء",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-14",
      status: "pending",
      location: "الدار البيضاء، حي المعاريف",
      price: 150,
    },
    {
      id: "3",
      title: "تركيب رفوف خشبية",
      category: "carpentry",
      categoryLabel: "نجارة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-13",
      status: "pending",
      location: "مراكش، المدينة القديمة",
      price: 400,
    },
    {
      id: "4",
      title: "طلاء غرفة النوم",
      category: "painting",
      categoryLabel: "دهان",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-12",
      status: "pending",
      location: "طنجة، وسط المدينة",
      price: 600,
    },
  ])

  // المهام الحالية
  const [currentJobs, setCurrentJobs] = useState<Problem[]>([
    {
      id: "5",
      title: "إصلاح تسريب في الحمام",
      category: "plumbing",
      categoryLabel: "سباكة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-10",
      status: "in-progress",
      location: "الرباط، حي أكدال",
      price: 350,
    },
    {
      id: "6",
      title: "تركيب مصابيح LED",
      category: "electricity",
      categoryLabel: "كهرباء",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-09",
      status: "in-progress",
      location: "الدار البيضاء، عين الشق",
      price: 250,
    },
  ])

  // المهام المكتملة
  const [completedJobs, setCompletedJobs] = useState<Problem[]>([
    {
      id: "7",
      title: "إصلاح صنبور المطبخ",
      category: "plumbing",
      categoryLabel: "سباكة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-05",
      status: "completed",
      location: "الرباط، حي الرياض",
      price: 200,
    },
    {
      id: "8",
      title: "تركيب باب خشبي",
      category: "carpentry",
      categoryLabel: "نجارة",
      image: "/placeholder.svg?height=200&width=300",
      date: "2023-06-03",
      status: "completed",
      location: "مراكش، جليز",
      price: 500,
    },
  ])

  // إحصائيات الحرفي
  const technicianStats = {
    totalEarnings: 1250,
    completedJobs: 8,
    rating: 4.8,
    activeJobs: 2,
  }

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      toast({
        title: "تم تحديث الوظائف",
        description: "تم تحديث قائمة الوظائف المتاحة",
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast])

  // تصفية الوظائف المتاحة حسب الفئة
  const filteredJobs =
    activeFilter === "all" ? availableJobs : availableJobs.filter((job) => job.category === activeFilter)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "جاري البحث",
        description: `جاري البحث عن: ${searchQuery}`,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message & Stats */}
      <AnimatedSection delay={0.1}>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">مرحباً، {user.name || "حرفي"}</h2>
                <p className="opacity-90">إليك ملخص أدائك</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <p className="font-bold text-xl">{technicianStats.totalEarnings} درهم</p>
                <p className="text-xs">الأرباح الإجمالية</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <p className="font-bold">{technicianStats.completedJobs}</p>
                <p className="text-xs">مهام مكتملة</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center">
                  <Star size={14} className="text-yellow-300 fill-yellow-300 mr-1" />
                  <p className="font-bold">{technicianStats.rating}</p>
                </div>
                <p className="text-xs">التقييم</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <p className="font-bold">{technicianStats.activeJobs}</p>
                <p className="text-xs">مهام نشطة</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="ابحث عن وظائف..."
                className="pl-3 pr-10 text-right border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 px-2 h-7"
                onClick={handleSearch}
              >
                بحث
              </Button>
            </div>
          </div>
        </Card>
      </AnimatedSection>

      {/* Job Categories Filter */}
      <AnimatedSection delay={0.2}>
        <div className="flex overflow-x-auto gap-2 pb-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            className={`rounded-full ${activeFilter === "all" ? "bg-gradient-to-r from-blue-700 to-blue-500" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            الكل
          </Button>
          <Button
            variant={activeFilter === "plumbing" ? "default" : "outline"}
            className={`rounded-full ${
              activeFilter === "plumbing" ? "bg-gradient-to-r from-blue-700 to-blue-500" : ""
            }`}
            onClick={() => setActiveFilter("plumbing")}
          >
            سباكة
          </Button>
          <Button
            variant={activeFilter === "electricity" ? "default" : "outline"}
            className={`rounded-full ${
              activeFilter === "electricity" ? "bg-gradient-to-r from-blue-700 to-blue-500" : ""
            }`}
            onClick={() => setActiveFilter("electricity")}
          >
            كهرباء
          </Button>
          <Button
            variant={activeFilter === "carpentry" ? "default" : "outline"}
            className={`rounded-full ${
              activeFilter === "carpentry" ? "bg-gradient-to-r from-blue-700 to-blue-500" : ""
            }`}
            onClick={() => setActiveFilter("carpentry")}
          >
            نجارة
          </Button>
          <Button
            variant={activeFilter === "painting" ? "default" : "outline"}
            className={`rounded-full ${
              activeFilter === "painting" ? "bg-gradient-to-r from-blue-700 to-blue-500" : ""
            }`}
            onClick={() => setActiveFilter("painting")}
          >
            دهان
          </Button>
        </div>
      </AnimatedSection>

      {/* Available Jobs */}
      <AnimatedSection delay={0.3} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <Link href="/available-jobs" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            عرض الكل
            <ChevronRight size={16} />
          </Link>
          <h2 className="text-xl font-bold">الوظائف المتاحة</h2>
        </div>
        <div className="space-y-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                <Card className="p-3 border rounded-lg overflow-hidden bg-white">
                  <Link href={`/job/${job.id}`} className="flex items-center justify-between">
                    <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                      <Image src={job.image || "/placeholder.svg"} alt={job.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 mr-4 text-right">
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="ml-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-green-600 font-bold">{job.price} درهم</span>
                        <div className="flex gap-2">
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{job.categoryLabel}</Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-8 text-center text-gray-500 bg-white">لا توجد وظائف متاحة في هذه الفئة حاليًا</Card>
          )}
        </div>
      </AnimatedSection>

      {/* Current Jobs */}
      <AnimatedSection delay={0.4}>
        <div className="flex justify-between items-center mb-3">
          <Link href="/current-jobs" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            عرض الكل
            <ChevronRight size={16} />
          </Link>
          <h2 className="text-xl font-bold">المهام الحالية</h2>
        </div>
        <div className="space-y-3">
          {currentJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <Card className="p-3 border-2 rounded-lg overflow-hidden border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                <Link href={`/job/${job.id}`} className="flex items-center justify-between">
                  <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                    <Image src={job.image || "/placeholder.svg"} alt={job.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 mr-4 text-right">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin size={12} className="ml-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-600 font-bold">{job.price} درهم</span>
                      <Badge className="bg-blue-100 text-blue-800">قيد التنفيذ</Badge>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Completed Jobs */}
      <AnimatedSection delay={0.5}>
        <div className="flex justify-between items-center mb-3">
          <Link href="/completed-jobs" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            عرض الكل
            <ChevronRight size={16} />
          </Link>
          <h2 className="text-xl font-bold">المهام المكتملة</h2>
        </div>
        <div className="space-y-3">
          {completedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <Card className="p-3 border-2 rounded-lg overflow-hidden border-green-200 bg-gradient-to-r from-green-50 to-white">
                <Link href={`/job/${job.id}`} className="flex items-center justify-between">
                  <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                    <Image src={job.image || "/placeholder.svg"} alt={job.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 mr-4 text-right">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar size={12} className="ml-1" />
                      <span>{new Date(job.date).toLocaleDateString("ar-MA")}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-600 font-bold">{job.price} درهم</span>
                      <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)

    // إظهار رسالة ترحيب بعد فترة قصيرة من التحميل
    if (user) {
      // محاكاة وقت التحميل
      const timer = setTimeout(() => {
        setIsLoading(false)
        toast({
          title: `مرحباً ${user.name || "بك"}!`,
          description: "نحن سعداء برؤيتك مرة أخرى في تطبيق Bricool",
        })
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router, isClient])

  if (loading || !isClient || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="text-center space-y-4">
          <ProLogo size="md" animate={true} />
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-xl font-semibold text-blue-800">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <motion.header
        className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 sticky top-0 z-10 shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <ProLogo size="sm" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">BRICOOL</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-white p-1 rounded-full relative"
              onClick={() => router.push("/notifications")}
            >
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                3
              </span>
            </Button>
            <Avatar className="h-9 w-9 border-2 border-white/50">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full pb-20">
        {/* Tabs for User/Technician */}
        {user.role === "technician" && (
          <Tabs defaultValue="dashboard" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-blue-100 p-1">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                لوحة التحكم
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                الوظائف المتاحة
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Conditional Rendering based on User Role */}
        {user.role === "technician" ? <TechnicianDashboard user={user} /> : <UserDashboard user={user} />}
      </main>

      {/* Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 border-t py-2 bg-white shadow-lg z-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center text-blue-600">
            <Home size={24} />
            <span className="text-xs mt-1">الرئيسية</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center text-gray-500">
            <ListChecks size={24} />
            <span className="text-xs mt-1">طلباتي</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center text-gray-500">
            <MessageSquare size={24} />
            <span className="text-xs mt-1">الرسائل</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center text-gray-500">
            <Settings size={24} />
            <span className="text-xs mt-1">الإعدادات</span>
          </Link>
        </div>
      </motion.div>

      {/* إضافة مدير الوضع غير المتصل ومدير الإشعارات */}
      <OfflineManager />
      <PushNotificationManager />
    </div>
  )
}
