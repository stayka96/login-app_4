"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "./auth-provider"

// Definir un tipo para las notificaciones
interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "message" | "offer" | "status" | "system"
  read: boolean
  created_at: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "created_at" | "read" | "user_id">) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mock functions for notifications
  const refreshNotifications = async () => {
    if (!user) return Promise.resolve()
    // Mock implementation
    return Promise.resolve()
  }

  const addNotification = async (notification: Omit<Notification, "id" | "created_at" | "read" | "user_id">) => {
    if (!user) return Promise.resolve()
    // Mock implementation
    return Promise.resolve()
  }

  const markAsRead = async (id: string) => {
    // Mock implementation
    return Promise.resolve()
  }

  const markAllAsRead = async () => {
    // Mock implementation
    return Promise.resolve()
  }

  // No renderizar nada durante SSR
  if (!isBrowser) {
    return <>{children}</>
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      <div className="relative">
        {children}
        {user && isBrowser && (
          <>
            {showNotifications && (
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowNotifications(false)} />
            )}
            <div className="fixed top-4 left-4 z-50 md:top-6 md:left-6">
              <Button
                variant="outline"
                size="icon"
                className="relative bg-white"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <Card className="absolute top-12 left-0 w-80 max-h-96 overflow-auto shadow-lg z-50 p-2">
                  <div className="flex justify-between items-center p-2 border-b">
                    <h3 className="font-bold">الإشعارات</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        قراءة الكل
                      </Button>
                    </div>
                  </div>

                  <div className="divide-y">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 ${notification.read ? "" : "bg-blue-50"}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </NotificationContext.Provider>
  )
}
