"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WorkMoneyLogo } from "./work-money-logo"
import { useAuth } from "./auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  // حالة تسجيل الدخول
  const [loginIdentifier, setLoginIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // حالة إنشاء حساب
  const [registerName, setRegisterName] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [registerRole, setRegisterRole] = useState<"user" | "technician">("user")
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [emailExists, setEmailExists] = useState(false)
  const [phoneExists, setPhoneExists] = useState(false)

  // التحقق من صحة رقم الهاتف المغربي
  const validatePhone = (value: string) => {
    if (!value) {
      return "رقم الهاتف مطلوب"
    }
    // نمط للتحقق من أرقام الهواتف المغربية
    const phonePattern = /^(06|07|05|0[6-7])[0-9]{8}$/
    if (!phonePattern.test(value)) {
      return "يرجى إدخال رقم هاتف مغربي صحيح"
    }
    return ""
  }

  // التحقق من صحة كلمة المرور
  const validatePassword = (value: string) => {
    if (!value) {
      return "كلمة المرور مطلوبة"
    }
    if (value.length < 6) {
      return "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"
    }
    return ""
  }

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (value: string) => {
    if (!value) {
      return "البريد الإلكتروني مطلوب"
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) {
      return "يرجى إدخال بريد إلكتروني صحيح"
    }
    return ""
  }

  // التحقق من تطابق كلمتي المرور
  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      return "تأكيد كلمة المرور مطلوب"
    }
    if (password !== confirmPassword) {
      return "كلمتا المرور غير متطابقتين"
    }
    return ""
  }

  // معالجة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // التحقق من صحة البيانات
    const isEmail = loginIdentifier.includes("@")

    if (!loginIdentifier) {
      setLoginError("يرجى إدخال البريد الإلكتروني أو رقم الهاتف")
      return
    }

    if (isEmail) {
      const emailError = validateEmail(loginIdentifier)
      if (emailError) {
        setLoginError(emailError)
        return
      }
    } else {
      const phoneError = validatePhone(loginIdentifier)
      if (phoneError) {
        setLoginError(phoneError)
        return
      }
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setLoginError(passwordError)
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting login with:", loginIdentifier)
      const result = await login(loginIdentifier, password)
      console.log("Login result:", result)

      if (result.success) {
        // تحويل المستخدم مباشرة إلى الصفحة الرئيسية
        router.push("/dashboard")
      } else {
        setLoginError(result.error || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setLoginError(error.message || "حدث خطأ أثناء تسجيل الدخول. تحقق من اتصالك بالإنترنت.")
    } finally {
      setIsLoading(false)
    }
  }

  // معالجة إنشاء حساب
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setEmailExists(false)
    setPhoneExists(false)

    // التحقق من صحة البيانات
    const nameError = !registerName ? "الاسم مطلوب" : ""
    const phoneError = validatePhone(registerPhone)
    const emailError = validateEmail(registerEmail)
    const passwordError = validatePassword(registerPassword)
    const confirmPasswordError = validateConfirmPassword(registerPassword, registerConfirmPassword)

    if (nameError || phoneError || emailError || passwordError || confirmPasswordError) {
      setRegisterError(nameError || phoneError || emailError || passwordError || confirmPasswordError)
      return
    }

    setIsRegistering(true)

    try {
      console.log("Registering with:", {
        name: registerName,
        phone: registerPhone,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
      })

      const result = await register(registerName, registerPhone, registerEmail, registerPassword, registerRole)
      console.log("Registration result:", result)

      if (result.success) {
        // تحويل المستخدم مباشرة إلى الصفحة الرئيسية بعد التسجيل
        router.push("/dashboard")
      } else {
        // التحقق مما إذا كان الخطأ متعلقًا بوجود البريد الإلكتروني
        if (result.error && result.error.includes("البريد الإلكتروني مستخدم بالفعل")) {
          setEmailExists(true)
        }
        // التحقق مما إذا كان الخطأ متعلقًا بوجود رقم الهاتف
        else if (result.error && result.error.includes("رقم الهاتف مستخدم بالفعل")) {
          setPhoneExists(true)
        }
        setRegisterError(result.error || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setRegisterError(error.message || "حدث خطأ أثناء إنشاء الحساب. تحقق من اتصالك بالإنترنت.")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-4" dir="rtl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <WorkMoneyLogo size="md" animate={true} />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl font-bold text-[#0066FF] mb-8 font-cairo"
      >
        منصة BRICOOL للصيانة والإصلاح
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full"
      >
        <Tabs
          defaultValue="login"
          className="w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="w-full">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  id="login-identifier"
                  type="text"
                  placeholder="البريد الإلكتروني أو رقم الهاتف"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="text-right border-gray-300 h-14 text-lg"
                />
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  placeholder="كلمة المرور"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right border-gray-300 h-14 text-lg"
                />
              </div>

              {loginError && <p className="text-sm text-red-500">{loginError}</p>}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-medium bg-[#0066FF] hover:bg-[#0055DD]"
                disabled={isLoading}
              >
                {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="#" className="text-[#0066FF] hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="register" className="w-full">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="text-right border-gray-300 h-14 text-lg"
                />
              </div>

              <div className="relative">
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="رقم الهاتف"
                  required
                  value={registerPhone}
                  onChange={(e) => {
                    setRegisterPhone(e.target.value)
                    if (phoneExists) {
                      setPhoneExists(false)
                    }
                  }}
                  className={`text-right border-gray-300 h-14 text-lg ${phoneExists ? "border-red-500 pr-10" : ""}`}
                />
                {phoneExists && (
                  <button
                    type="button"
                    onClick={() => setRegisterPhone("")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
                    title="استخدام رقم هاتف آخر"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  id="register-email"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  required
                  value={registerEmail}
                  onChange={(e) => {
                    setRegisterEmail(e.target.value)
                    if (emailExists) {
                      setEmailExists(false)
                    }
                  }}
                  className={`text-right border-gray-300 h-14 text-lg ${emailExists ? "border-red-500 pr-10" : ""}`}
                />
                {emailExists && (
                  <button
                    type="button"
                    onClick={() => setRegisterEmail("")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
                    title="استخدام بريد إلكتروني آخر"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="كلمة المرور"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="text-right border-gray-300 h-14 text-lg"
                />
              </div>

              <div>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  required
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="text-right border-gray-300 h-14 text-lg"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={registerRole === "user" ? "default" : "outline"}
                  className={`flex-1 h-12 ${
                    registerRole === "user" ? "bg-[#0066FF] hover:bg-[#0055DD]" : "border-[#0066FF] text-[#0066FF]"
                  }`}
                  onClick={() => setRegisterRole("user")}
                >
                  مستخدم
                </Button>
                <Button
                  type="button"
                  variant={registerRole === "technician" ? "default" : "outline"}
                  className={`flex-1 h-12 ${
                    registerRole === "technician"
                      ? "bg-[#0066FF] hover:bg-[#0055DD]"
                      : "border-[#0066FF] text-[#0066FF]"
                  }`}
                  onClick={() => setRegisterRole("technician")}
                >
                  حرفي
                </Button>
              </div>

              {emailExists && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر أو{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-red-500 underline"
                      onClick={() => {
                        setActiveTab("login")
                        setLoginIdentifier(registerEmail)
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {phoneExists && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم هاتف آخر أو{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-red-500 underline"
                      onClick={() => {
                        setActiveTab("login")
                        setLoginIdentifier(registerPhone)
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {registerError && !emailExists && !phoneExists && <p className="text-sm text-red-500">{registerError}</p>}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-medium bg-[#0066FF] hover:bg-[#0055DD]"
                disabled={isRegistering || emailExists || phoneExists}
              >
                {isRegistering ? "جاري التسجيل..." : "إنشاء حساب"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
