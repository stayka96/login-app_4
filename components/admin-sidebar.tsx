"use client"

import Link from "next/link"
import { Users, FileText, BarChart2, Settings, LogOut } from "lucide-react"
import { WrenchLogo } from "@/components/wrench-logo"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-[#0066FF] text-white p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8">
        <WrenchLogo size="sm" className="w-10 h-10" />
        <h1 className="text-xl font-bold">لوحة الإدارة</h1>
      </div>

      <nav className="space-y-1">
        <Link href="/admin">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${
              activeSection === "dashboard" ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            الإحصائيات
          </Button>
        </Link>
        <Link href="/admin/users">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${
              activeSection === "users" ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveSection("users")}
          >
            <Users className="mr-2 h-5 w-5" />
            المستخدمين
          </Button>
        </Link>
        <Link href="/admin/requests">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${
              activeSection === "requests" ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveSection("requests")}
          >
            <FileText className="mr-2 h-5 w-5" />
            الطلبات
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white ${
              activeSection === "settings" ? "bg-blue-700" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            الإعدادات
          </Button>
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-blue-700 absolute bottom-4 w-[calc(100%-2rem)]">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-700">
          <LogOut className="mr-2 h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  )
}
