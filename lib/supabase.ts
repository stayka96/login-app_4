import { createClient } from "@supabase/supabase-js"

// Patrón singleton para el cliente de Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required. Please check your environment variables.")
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Función para obtener el cliente del lado del servidor
export const getServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and Service Role Key are required for server operations.")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// تعريف أنواع المستخدمين
export type UserRole = "user" | "technician" | "admin"

// تعريف أنواع حالات الطلبات
export type OrderStatus = "pending" | "reviewing" | "accepted" | "completed" | "cancelled"

// واجهة المستخدم
export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: UserRole
  avatar_url?: string
  is_active?: boolean
  created_at: string
  auth_id?: string
}

// واجهة الطلب
export interface Order {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: OrderStatus
  user_id: string
  technician_id?: string
  created_at: string
  images?: string[]
}

// واجهة العرض
export interface Offer {
  id: string
  order_id: string
  technician_id: string
  price: number
  estimated_time: string
  message: string
  created_at: string
}

// واجهة الرسالة
export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

// واجهة المحادثة
export interface Conversation {
  id: string
  user_id: string
  technician_id: string
  order_id?: string
  created_at: string
}

// واجهة التقييم
export interface Rating {
  id: string
  order_id: string
  user_id: string
  technician_id: string
  rating: number
  comment?: string
  created_at: string
}

// واجهة الإشعار
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "message" | "offer" | "status" | "system"
  read: boolean
  created_at: string
}

// دالة للتحقق من الجلسة الحالية
export async function getCurrentSession() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("Error fetching session:", error)
      return null
    }
    return data.session
  } catch (error) {
    console.error("Error accessing Supabase:", error)
    return null
  }
}

// دالة للحصول على المستخدم الحالي
export async function getCurrentUser() {
  try {
    const session = await getCurrentSession()
    if (!session) return null

    const supabase = getSupabase()
    // البحث عن المستخدم باستخدام auth_id
    const { data, error } = await supabase.from("users").select("*").eq("auth_id", session.user.id).single()

    if (error) {
      console.error("Error fetching user:", error)

      // إذا لم يتم العثور على المستخدم، قد نحتاج إلى إنشائه
      if (error.code === "PGRST116") {
        // لا توجد نتائج
        const newUser = {
          name: session.user.user_metadata?.name || "مستخدم جديد",
          email: session.user.email,
          phone: session.user.phone || "",
          role: session.user.user_metadata?.role || "user",
          auth_id: session.user.id,
        }

        const { data: createdUser, error: createError } = await supabase
          .from("users")
          .insert([newUser])
          .select()
          .single()

        if (createError) {
          console.error("Error creating user:", createError)
          return null
        }

        return createdUser as User
      }

      return null
    }

    return data as User
  } catch (error) {
    console.error("Error accessing Supabase:", error)
    return null
  }
}

// دالة لتسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = getSupabase()

    // البحث عن المستخدم باستخدام البريد الإلكتروني
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("email", email).single()

    if (userError) {
      console.error("Error finding user by email:", userError)
      return {
        data: null,
        error: {
          message: "لم يتم العثور على مستخدم بهذا البريد الإلكتروني",
        },
      }
    }

    // التحقق من كلمة المرور
    if (userData.password !== password) {
      return {
        data: null,
        error: {
          message: "كلمة المرور غير صحيحة",
        },
      }
    }

    return { data: userData, error: null }
  } catch (error) {
    console.error("Error signing in with email:", error)
    return {
      data: null,
      error: {
        message: "حدث خطأ أثناء تسجيل الدخول",
      },
    }
  }
}

// دالة لتسجيل الدخول باستخدام رقم الهاتف
export async function signInWithPhone(phone: string, password: string) {
  try {
    const supabase = getSupabase()

    // البحث عن المستخدم باستخدام رقم الهاتف
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("phone", phone).single()

    if (userError) {
      console.error("Error finding user by phone:", userError)
      return {
        data: null,
        error: {
          message: "لم يتم العثور على مستخدم بهذا الرقم",
        },
      }
    }

    // التحقق من كلمة المرور (في التطبيق الحقيقي، يجب استخدام نظام المصادقة)
    if (userData.password !== password) {
      return {
        data: null,
        error: {
          message: "كلمة المرور غير صحيحة",
        },
      }
    }

    return { data: userData, error: null }
  } catch (error) {
    console.error("Error signing in with phone:", error)
    return {
      data: null,
      error: {
        message: "حدث خطأ أثناء تسجيل الدخول",
      },
    }
  }
}

// دالة لإنشاء حساب جديد
export async function signUp(email: string, password: string, phone: string, name: string, role: UserRole = "user") {
  try {
    const supabase = getSupabase()

    console.log("Starting signup process with:", { email, phone, name, role })

    // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني في جدول المستخدمين
    const { data: existingEmailUser, error: emailCheckError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (emailCheckError) {
      console.error("Error checking existing email:", emailCheckError)
    }

    if (existingEmailUser) {
      console.log("User with this email already exists in users table:", existingEmailUser)
      return {
        data: null,
        error: {
          message: "البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول.",
        },
      }
    }

    // التحقق من عدم وجود مستخدم بنفس رقم الهاتف
    const { data: existingPhoneUser, error: phoneCheckError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle()

    if (phoneCheckError) {
      console.error("Error checking existing phone:", phoneCheckError)
    }

    if (existingPhoneUser) {
      console.log("User with this phone already exists:", existingPhoneUser)
      return {
        data: null,
        error: {
          message: "رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم هاتف آخر.",
        },
      }
    }

    // إنشاء المستخدم مباشرة في جدول المستخدمين بدون استخدام نظام المصادقة
    const newUser = {
      name,
      email,
      phone,
      role,
      is_active: true,
      password, // للتبسيط فقط، في الإنتاج لا تخزن كلمات المرور بشكل صريح
    }

    console.log("Inserting user record:", newUser)

    const { data: userData, error: userError } = await supabase.from("users").insert([newUser]).select().single()

    if (userError) {
      console.error("User creation error:", userError)

      // التحقق من نوع الخطأ
      if (userError.message.includes("duplicate key") && userError.message.includes("email")) {
        return {
          data: null,
          error: {
            message: "البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول.",
          },
        }
      }

      if (userError.message.includes("duplicate key") && userError.message.includes("phone")) {
        return {
          data: null,
          error: {
            message: "رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم هاتف آخر.",
          },
        }
      }

      return { data: null, error: userError }
    }

    console.log("User record created successfully:", userData)

    return { data: { user: userData, session: null }, error: null }
  } catch (error) {
    console.error("Error signing up:", error)
    return {
      data: null,
      error: {
        message: "حدث خطأ أثناء إنشاء الحساب",
      },
    }
  }
}

// دالة لتسجيل الخروج
export async function signOut() {
  try {
    const supabase = getSupabase()
    return await supabase.auth.signOut()
  } catch (error) {
    console.error("Error signing out:", error)
    return { error }
  }
}

// دالة لإنشاء طلب جديد
export async function createOrder(order: Omit<Order, "id" | "created_at" | "status">) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...order,
          status: "pending",
        },
      ])
      .select()

    return { data, error }
  } catch (error) {
    console.error("Error creating order:", error)
    return { data: null, error }
  }
}

// دالة للحصول على طلبات المستخدم
export async function getUserOrders(userId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return { data: null, error }
  }
}

// دالة للحصول على الطلبات المفتوحة (للحرفيين)
export async function getOpenOrders() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["pending", "reviewing"])
      .order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching open orders:", error)
    return { data: null, error }
  }
}

// دالة لإنشاء عرض جديد
export async function createOffer(offer: Omit<Offer, "id" | "created_at">) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("offers").insert([offer]).select()

    // تحديث حالة الطلب إلى "قيد المراجعة"
    if (!error) {
      await supabase.from("orders").update({ status: "reviewing" }).eq("id", offer.order_id)
    }

    return { data, error }
  } catch (error) {
    console.error("Error creating offer:", error)
    return { data: null, error }
  }
}

// دالة للحصول على عروض طلب معين
export async function getOrderOffers(orderId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("offers")
      .select(`
        *,
        technician:technician_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq("order_id", orderId)

    return { data, error }
  } catch (error) {
    console.error("Error fetching order offers:", error)
    return { data: null, error }
  }
}

// دالة لقبول عرض
export async function acceptOffer(offerId: string, orderId: string, technicianId: string) {
  try {
    const supabase = getSupabase()
    // تحديث حالة الطلب
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: "accepted",
        technician_id: technicianId,
      })
      .eq("id", orderId)

    if (orderError) {
      return { data: null, error: orderError }
    }

    // إنشاء محادثة بين المستخدم والحرفي
    const { data: orderData, error: getOrderError } = await supabase
      .from("orders")
      .select("user_id")
      .eq("id", orderId)
      .single()

    if (getOrderError) {
      return { data: null, error: getOrderError }
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert([
        {
          user_id: orderData.user_id,
          technician_id: technicianId,
          order_id: orderId,
        },
      ])
      .select()

    return { data, error }
  } catch (error) {
    console.error("Error accepting offer:", error)
    return { data: null, error }
  }
}

// دالة لإنشاء تقييم
export async function createRating(rating: Omit<Rating, "id" | "created_at">) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("ratings").insert([rating]).select()

    // تحديث حالة الطلب إلى "مكتمل"
    if (!error) {
      await supabase.from("orders").update({ status: "completed" }).eq("id", rating.order_id)
    }

    return { data, error }
  } catch (error) {
    console.error("Error creating rating:", error)
    return { data: null, error }
  }
}

// دالة للحصول على المحادثات
export async function getUserConversations(userId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        technician:technician_id (
          id,
          name,
          avatar_url
        ),
        user:user_id (
          id,
          name,
          avatar_url
        ),
        order:order_id (
          id,
          title
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // للحصول على آخر رسالة لكل محادثة
    if (data && data.length > 0) {
      for (const conversation of data) {
        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: false })
          .limit(1)

        conversation.last_message = messages || []
      }
    }

    return { data, error }
  } catch (error) {
    console.error("Error fetching user conversations:", error)
    return { data: null, error }
  }
}

// دالة للحصول على محادثات الحرفي
export async function getTechnicianConversations(technicianId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        technician:technician_id (
          id,
          name,
          avatar_url
        ),
        user:user_id (
          id,
          name,
          avatar_url
        ),
        order:order_id (
          id,
          title
        )
      `)
      .eq("technician_id", technicianId)
      .order("created_at", { ascending: false })

    // للحصول على آخر رسالة لكل محادثة
    if (data && data.length > 0) {
      for (const conversation of data) {
        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: false })
          .limit(1)

        conversation.last_message = messages || []
      }
    }

    return { data, error }
  } catch (error) {
    console.error("Error fetching technician conversations:", error)
    return { data: null, error }
  }
}

// دالة للحصول على رسائل محادثة
export async function getConversationMessages(conversationId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    return { data, error }
  } catch (error) {
    console.error("Error fetching conversation messages:", error)
    return { data: null, error }
  }
}

// دالة لإرسال رسالة
export async function sendMessage(message: Omit<Message, "id" | "created_at" | "read">) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          ...message,
          read: false,
        },
      ])
      .select()

    return { data, error }
  } catch (error) {
    console.error("Error sending message:", error)
    return { data: null, error }
  }
}

// دالة لتحديث حالة الحرفي (متصل/غير متصل)
export async function updateTechnicianStatus(technicianId: string, isActive: boolean) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: isActive })
      .eq("id", technicianId)
      .eq("role", "technician")
      .select()

    return { data, error }
  } catch (error) {
    console.error("Error updating technician status:", error)
    return { data: null, error }
  }
}

// دالة لإنشاء إشعار
export async function createNotification(notification: Omit<Notification, "id" | "created_at" | "read">) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          ...notification,
          read: false,
        },
      ])
      .select()

    return { data, error }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { data: null, error }
  }
}

// دالة للحصول على إشعارات المستخدم
export async function getUserNotifications(userId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return { data: null, error }
  }
}

// دالة لتحديث حالة الإشعار (مقروء)
export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .select()

    return { data, error }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { data: null, error }
  }
}

// دالة للحصول على إحصائيات للوحة الإدارة
export async function getAdminStats() {
  try {
    const supabase = getSupabase()
    // عدد المستخدمين
    const { count: usersCount } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "user")

    // عدد الحرفيين
    const { count: techniciansCount } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "technician")

    // عدد الطلبات النشطة
    const { count: activeOrdersCount } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "reviewing", "accepted"])

    // عدد الطلبات المكتملة
    const { count: completedOrdersCount } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed")

    return {
      usersCount: usersCount || 0,
      techniciansCount: techniciansCount || 0,
      activeOrdersCount: activeOrdersCount || 0,
      completedOrdersCount: completedOrdersCount || 0,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      usersCount: 0,
      techniciansCount: 0,
      activeOrdersCount: 0,
      completedOrdersCount: 0,
    }
  }
}

// دالة للحصول على جميع المستخدمين (للوحة الإدارة)
export async function getAllUsers() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching all users:", error)
    return { data: null, error }
  }
}

// دالة للحصول على جميع الطلبات (للوحة الإدارة)
export async function getAllOrders() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        user:user_id (
          id,
          name
        ),
        technician:technician_id (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return { data: null, error }
  }
}

// دالة لحذف مستخدم تجريبي (للتطوير فقط)
export async function deleteTestUser(email: string) {
  try {
    const supabase = getSupabase()

    // البحث عن المستخدم باستخدام البريد الإلكتروني
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (userError) {
      console.error("Error finding user by email:", userError)
      return { success: false, error: userError }
    }

    if (!userData) {
      return { success: false, error: { message: "لم يتم العثور على مستخدم بهذا البريد الإلكتروني" } }
    }

    // حذف المستخدم من جدول المستخدمين
    const { error: deleteError } = await supabase.from("users").delete().eq("email", email)

    if (deleteError) {
      console.error("Error deleting user:", deleteError)
      return { success: false, error: deleteError }
    }

    // محاولة حذف المستخدم من نظام المصادقة إذا كان لديه auth_id
    if (userData.auth_id) {
      const serverSupabase = getServerSupabase()
      await serverSupabase.auth.admin.deleteUser(userData.auth_id)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting test user:", error)
    return { success: false, error }
  }
}
