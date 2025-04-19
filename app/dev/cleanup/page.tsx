"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteTestUser } from "@/lib/supabase"

export default function CleanupPage() {
  const [email, setEmail] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني")
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteTestUser(email)
      if (result.success) {
        setMessage(`تم حذف المستخدم بنجاح: ${email}`)
        setEmail("")
      } else {
        setError(result.error?.message || "فشل حذف المستخدم")
      }
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء حذف المستخدم")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">تنظيف المستخدمين التجريبيين</h1>
        <p className="mb-4 text-red-500">تحذير: هذه الصفحة للتطوير فقط. استخدمها لحذف المستخدمين التجريبيين.</p>

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <Button type="submit" className="w-full" disabled={isDeleting}>
            {isDeleting ? "جاري الحذف..." : "حذف المستخدم"}
          </Button>
        </form>
      </div>
    </div>
  )
}
