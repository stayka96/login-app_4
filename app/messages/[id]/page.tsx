"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, ArrowRight, Phone, ImageIcon, Paperclip, Smile, Mic, MoreVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getConversationMessages, sendMessage, createNotification } from "@/lib/supabase"
import { motion } from "framer-motion"
import { ProLogo } from "@/components/pro-logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
  image_url?: string
}

// بيانات تجريبية للمحادثات
const DEMO_MESSAGES: Message[] = [
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "tech-1",
    content: "مرحباً، كيف يمكنني مساعدتك في مشكلة التسريب؟",
    created_at: new Date(Date.now() - 3600000).toISOString(), // قبل ساعة
    read: true,
  },
  {
    id: "msg-2",
    conversation_id: "conv-1",
    sender_id: "user-1", // سيتم استبداله بمعرف المستخدم الحالي
    content: "شكراً لتواصلك. التسريب في المطبخ تحت الحوض ويبدو أنه من الأنبوب الرئيسي.",
    created_at: new Date(Date.now() - 3500000).toISOString(),
    read: true,
  },
  {
    id: "msg-3",
    conversation_id: "conv-1",
    sender_id: "tech-1",
    content: "فهمت. هل يمكنك إرسال صورة للمشكلة؟",
    created_at: new Date(Date.now() - 3400000).toISOString(),
    read: true,
  },
  {
    id: "msg-4",
    conversation_id: "conv-1",
    sender_id: "user-1", // سيتم استبداله بمعرف المستخدم الحالي
    content: "بالتأكيد، سأرسل لك صورة قريباً.",
    created_at: new Date(Date.now() - 3300000).toISOString(),
    read: true,
    image_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "msg-5",
    conversation_id: "conv-1",
    sender_id: "tech-1",
    content: "شكراً للصورة. يبدو أن المشكلة بسيطة. يمكنني زيارتك غداً في الصباح لإصلاحها. هل الساعة 10 صباحاً مناسبة؟",
    created_at: new Date(Date.now() - 3200000).toISOString(),
    read: true,
  },
]

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // تحديد ما إذا كنا في وضع العرض التجريبي
  const isDemoMode = !params.id.includes("-") || params.id.startsWith("tech-") || params.id.startsWith("user-")

  useEffect(() => {
    async function loadMessages() {
      if (!user || !params.id) return

      setIsLoading(true)
      try {
        console.log("Loading messages for conversation:", params.id, "Demo mode:", isDemoMode)

        if (isDemoMode) {
          // استخدام بيانات تجريبية
          console.log("Using demo data for messages")
          // استبدال معرف المستخدم في الرسائل التجريبية
          const demoMessages = DEMO_MESSAGES.map((msg) => ({
            ...msg,
            sender_id: msg.sender_id === "user-1" ? user.id : msg.sender_id,
          }))
          setMessages(demoMessages)

          // تعيين معلومات المستخدم الآخر
          setOtherUser({
            id: params.id,
            name: "أحمد الحرفي",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: true,
            lastSeen: "الآن",
            profession: "فني سباكة",
            rating: 4.8,
          })
        } else {
          // استخدام البيانات الحقيقية من Supabase
          console.log("Fetching real messages from Supabase")
          const { data, error } = await getConversationMessages(params.id)
          if (error) {
            console.error("Error fetching messages:", error)
            throw error
          }
          setMessages(data || [])

          // تحميل معلومات المستخدم الآخر من الخادم
          // في التطبيق الحقيقي، يجب استرجاع معلومات المستخدم الآخر من الخادم
          setOtherUser({
            id: params.id,
            name: user.role === "user" ? "أحمد الحرفي" : "محمد المستخدم",
            avatar: "/placeholder.svg?height=40&width=40",
            isOnline: true,
            lastSeen: "الآن",
            profession: user.role === "user" ? "فني سباكة" : null,
            rating: user.role === "user" ? 4.8 : null,
          })
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل الرسائل",
          variant: "destructive",
        })

        // في حالة الخطأ، استخدم البيانات التجريبية
        const demoMessages = DEMO_MESSAGES.map((msg) => ({
          ...msg,
          sender_id: msg.sender_id === "user-1" ? user.id : msg.sender_id,
        }))
        setMessages(demoMessages)

        setOtherUser({
          id: params.id,
          name: "أحمد الحرفي",
          avatar: "/placeholder.svg?height=40&width=40",
          isOnline: true,
          lastSeen: "الآن",
          profession: "فني سباكة",
          rating: 4.8,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [user, params.id, toast, isDemoMode])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !user || !params.id || isSending) return

    setIsSending(true)

    try {
      console.log("Sending message:", message, "Demo mode:", isDemoMode)

      if (isDemoMode) {
        // إضافة رسالة تجريبية
        console.log("Adding demo message")
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversation_id: params.id,
          sender_id: user.id,
          content: message,
          created_at: new Date().toISOString(),
          read: false,
        }

        setMessages((prev) => [...prev, newMessage])

        // محاكاة رد تلقائي بعد ثانيتين
        setTimeout(() => {
          const autoReply: Message = {
            id: `msg-${Date.now() + 1}`,
            conversation_id: params.id,
            sender_id: params.id,
            content: "شكراً لرسالتك! سأرد عليك في أقرب وقت ممكن.",
            created_at: new Date().toISOString(),
            read: false,
          }
          setMessages((prev) => [...prev, autoReply])
        }, 2000)
      } else {
        // إرسال الرسالة الحقيقية إلى Supabase
        const { data, error } = await sendMessage({
          conversation_id: params.id,
          sender_id: user.id,
          content: message,
        })

        if (error) throw error

        // إضافة الرسالة إلى القائمة
        setMessages((prev) => [...prev, data[0]])

        // إرسال إشعار للمستخدم الآخر
        if (otherUser) {
          await createNotification({
            user_id: otherUser.id,
            title: "رسالة جديدة",
            message: `لديك رسالة جديدة من ${user.name}`,
            type: "message",
          })
        }
      }

      // مسح حقل الرسالة
      setMessage("")
    } catch (error: any) {
      console.error("Error sending message:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-MA")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <Button variant="ghost" className="text-white p-1" onClick={() => router.back()}>
          <ArrowRight size={24} />
        </Button>
        {otherUser && (
          <div className="flex items-center gap-2 flex-1 mx-2">
            <Avatar className="h-10 w-10 border-2 border-white/50">
              <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name?.charAt(0) || "م"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-base leading-tight">{otherUser.name}</h1>
              <div className="flex items-center text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${otherUser.isOnline ? "bg-green-400" : "bg-gray-400"} mr-1`}
                ></span>
                <p>{otherUser.isOnline ? "متصل الآن" : otherUser.lastSeen}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-white">
            <Phone size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>عرض الملف الشخصي</DropdownMenuItem>
              <DropdownMenuItem>البحث في المحادثة</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">حذف المحادثة</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-auto p-4 bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mr-2 text-gray-600">جاري تحميل المحادثة...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ProLogo size="sm" className="mb-4" />
            <h3 className="font-bold text-lg text-gray-700">لا توجد رسائل</h3>
            <p className="text-gray-500 max-w-xs">ابدأ المحادثة مع {otherUser?.name} الآن!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => {
              const isCurrentUser = msg.sender_id === user.id
              const showDate = index === 0 || formatDate(messages[index - 1].created_at) !== formatDate(msg.created_at)

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                  )}

                  <motion.div
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.image_url && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                          <Image
                            src={msg.image_url || "/placeholder.svg"}
                            alt="Attached image"
                            width={300}
                            height={200}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className="break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 text-right ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(msg.created_at)}
                        {isCurrentUser && <span className="mr-1">{msg.read ? "✓✓" : "✓"}</span>}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Message Input */}
      <footer className="bg-white border-t p-3 sticky bottom-0 z-10 shadow-md">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button type="button" variant="ghost" size="icon" className="text-gray-500">
              <Smile size={20} />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="text-gray-500">
              <Paperclip size={20} />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="text-gray-500">
              <ImageIcon size={20} />
            </Button>
          </div>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="text-right rounded-full bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-blue-400"
              disabled={isSending}
            />
            {!message.trim() && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <Mic size={20} />
              </Button>
            )}
          </div>
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full"
            disabled={!message.trim() || isSending}
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} className="rotate-180" />}
          </Button>
        </form>
      </footer>
    </div>
  )
}
