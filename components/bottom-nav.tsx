"use client"

import Link from "next/link"
import { Home, ListChecks, MessageSquare, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="border-t py-2 bg-white">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center ${isActive("/dashboard") ? "text-[#0066FF]" : "text-gray-500"}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">الرئيسية</span>
        </Link>
        <Link
          href="/orders"
          className={`flex flex-col items-center ${isActive("/orders") ? "text-[#0066FF]" : "text-gray-500"}`}
        >
          <ListChecks size={24} />
          <span className="text-xs mt-1">طلباتي</span>
        </Link>
        <Link
          href="/messages"
          className={`flex flex-col items-center ${isActive("/messages") ? "text-[#0066FF]" : "text-gray-500"}`}
        >
          <MessageSquare size={24} />
          <span className="text-xs mt-1">الرسائل</span>
        </Link>
        <Link
          href="/settings"
          className={`flex flex-col items-center ${isActive("/settings") ? "text-[#0066FF]" : "text-gray-500"}`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">الإعدادات</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomNav
