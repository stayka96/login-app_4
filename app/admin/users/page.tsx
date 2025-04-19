"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, FileText, BarChart2, Settings, LogOut, Search, Filter, MoreVertical, UserPlus } from "lucide-react"
import { WrenchLogo } from "@/components/wrench-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function UsersPage() {
  const [activeSection, setActiveSection] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      id: 1,
      name: "محمد أحمد",
      email: "mohammed@example.com",
      phone: "0612345678",
      type: "مستخدم",
      status: "نشط",
      joinDate: "15/06/2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "أحمد علي",
      email: "ahmed@example.com",
      phone: "0623456789",
      type: "فني",
      status: "نشط",
      joinDate: "10/05/2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "سارة محمد",
      email: "sara@example.com",
      phone: "0634567890",
      type: "مستخدم",
      status: "غير نشط",
      joinDate: "20/04/2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "خالد عمر",
      email: "khaled@example.com",
      phone: "0645678901",
      type: "فني",
      status: "نشط",
      joinDate: "05/03/2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "فاطمة أحمد",
      email: "fatima@example.com",
      phone: "0656789012",
      type: "مستخدم",
      status: "نشط",
      joinDate: "12/02/2023",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredUsers = users.filter(
    (user) => user.name.includes(searchQuery) || user.email.includes(searchQuery) || user.phone.includes(searchQuery),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800"
      case "غير نشط":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "مستخدم":
        return "bg-blue-100 text-blue-800"
      case "فني":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="bg-[#0066FF] text-white p-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <WrenchLogo size="sm" className="w-8 h-8" />
            <h1 className="text-lg font-bold">لوحة الإدارة</h1>
          </div>
          <Button variant="ghost" className="text-white p-1">
            <Settings size={24} />
          </Button>
        </header>

        {/* Users Content */}
        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">إدارة المستخدمين</h2>
            <Button className="bg-[#0066FF] hover:bg-[#0055DD]">
              <UserPlus className="mr-2 h-5 w-5" />
              إضافة مستخدم جديد
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="بحث عن مستخدم..."
                className="pl-3 pr-10 text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={20} />
              تصفية
            </Button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الانضمام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(user.type)}`}
                        >
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                            <DropdownMenuItem>تعديل</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">حظر</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
