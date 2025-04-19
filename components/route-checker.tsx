"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

// قائمة بجميع المسارات المتوقعة في التطبيق
const expectedRoutes = [
  "/",
  "/intro",
  "/login",
  "/register",
  "/dashboard",
  "/orders",
  "/messages",
  "/settings",
  "/add-problem",
  "/offers",
  "/profile",
  "/admin",
  "/admin/users",
  "/admin/requests",
  "/admin/settings",
]

export function RouteChecker() {
  const pathname = usePathname()
  const [checkedRoutes, setCheckedRoutes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // تسجيل المسار الحالي كمتاح
    setCheckedRoutes((prev) => ({ ...prev, [pathname]: true }))

    // التحقق من المسار الحالي
    if (
      !expectedRoutes.includes(pathname) &&
      !pathname.startsWith("/orders/") &&
      !pathname.startsWith("/messages/") &&
      !pathname.startsWith("/admin/")
    ) {
      console.warn(`Unexpected route: ${pathname}`)
    }
  }, [pathname])

  return null // مكون غير مرئي
}
