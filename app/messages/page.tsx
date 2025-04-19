"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { getUserConversations, getTechnicianConversations } from "@/lib/supabase"
import { BottomNav } from "@/components/bottom-nav"
import { WrenchLogo } from "@/components/wrench-logo"

interface Conversation {
  id: string
  created_at: string
  user_id: string
  technician_id: string
  last_message: any[] // Define the type for last_message if possible
  user?: {
    avatar_url: string | null
    name: string | null
  }
  technician?: {
    avatar_url: string | null
    name: string | null
  }
}

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadConversations() {
      if (!user) return

      setIsLoading(true)
      try {
        let data
        if (user.role === "user") {
          const result = await getUserConversations(user.id)
          data = result.data
        } else if (user.role === "technician") {
          const result = await getTechnicianConversations(user.id)
          data = result.data
        }

        setConversations(data || [])
      } catch (error) {
        console.error("Error loading conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [user])

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
          <h1 className="text-2xl font-bold">الرسائل</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 bg-white">لا توجد محادثات. ابدأ محادثة جديدة!</div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={
                        user.role === "user"
                          ? conversation.technician?.avatar_url || "/placeholder.svg?height=50&width=50"
                          : conversation.user?.avatar_url || "/placeholder.svg?height=50&width=50"
                      }
                      alt={
                        user.role === "user"
                          ? conversation.technician?.name || "الحرفي"
                          : conversation.user?.name || "المستخدم"
                      }
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    {conversation.last_message &&
                      conversation.last_message.length > 0 &&
                      !conversation.last_message[0].read &&
                      conversation.last_message[0].sender_id !== user.id && (
                        <span className="absolute -top-1 -right-1 bg-[#0066FF] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          1
                        </span>
                      )}
                  </div>
                  <div>
                    <h3 className="font-bold">
                      {user.role === "user"
                        ? conversation.technician?.name || "الحرفي"
                        : conversation.user?.name || "المستخدم"}
                    </h3>
                    <p className="text-gray-600 text-sm truncate max-w-[200px]">
                      {conversation.last_message && conversation.last_message.length > 0
                        ? conversation.last_message[0].content
                        : "لا توجد رسائل"}
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 text-xs">
                  {conversation.last_message && conversation.last_message.length > 0
                    ? new Date(conversation.last_message[0].created_at).toLocaleDateString("ar-MA")
                    : ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="messages" />
    </div>
  )
}
