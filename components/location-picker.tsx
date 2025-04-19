"use client"

import { useState, useEffect } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; latitude: number; longitude: number }) => void
  defaultAddress?: string
}

export function LocationPicker({ onLocationSelect, defaultAddress = "" }: LocationPickerProps) {
  const [address, setAddress] = useState(defaultAddress)
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  // Verificar si estamos en el navegador
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // قائمة المدن المغربية الرئيسية
  const moroccanCities = [
    "الدار البيضاء",
    "الرباط",
    "فاس",
    "مراكش",
    "طنجة",
    "مكناس",
    "أكادير",
    "وجدة",
    "تطوان",
    "القنيطرة",
    "آسفي",
    "الجديدة",
    "خريبكة",
    "بني ملال",
  ]

  const getCurrentLocation = () => {
    if (!isBrowser) return

    if (!navigator.geolocation) {
      toast({
        title: "غير مدعوم",
        description: "تحديد الموقع الجغرافي غير مدعوم في متصفحك",
        variant: "destructive",
      })
      return
    }

    setIsGettingCurrentLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // محاولة الحصول على العنوان من الإحداثيات
          if (isBrowser) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`,
              )

              const data = await response.json()

              if (data.display_name) {
                setAddress(data.display_name)
                onLocationSelect({
                  address: data.display_name,
                  latitude,
                  longitude,
                })
              } else {
                // إذا فشل الحصول على العنوان، استخدم الإحداثيات فقط
                const addressText = `الموقع: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                setAddress(addressText)
                onLocationSelect({
                  address: addressText,
                  latitude,
                  longitude,
                })
              }
            } catch (error) {
              console.error("Error getting address from coordinates:", error)
              // Fallback to coordinates only
              const addressText = `الموقع: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              setAddress(addressText)
              onLocationSelect({
                address: addressText,
                latitude,
                longitude,
              })
            }
          }
        } catch (error) {
          console.error("Error getting address from coordinates:", error)
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء الحصول على العنوان من الإحداثيات",
            variant: "destructive",
          })
        } finally {
          setIsGettingCurrentLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsGettingCurrentLocation(false)

        let errorMessage = "حدث خطأ أثناء تحديد موقعك"

        if (error && error.code) {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "تم رفض الإذن لتحديد الموقع"
              break
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "معلومات الموقع غير متاحة"
              break
            case 3: // TIMEOUT
              errorMessage = "انتهت مهلة طلب تحديد الموقع"
              break
          }
        }

        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive",
        })
      },
    )
  }

  const confirmLocation = () => {
    if (!address.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال العنوان",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // محاكاة البحث عن الإحداثيات من العنوان
    setTimeout(() => {
      // في التطبيق الحقيقي، يجب استخدام خدمة geocoding
      const randomLat = 31 + Math.random() * 4
      const randomLng = -8 - Math.random() * 2

      onLocationSelect({
        address,
        latitude: randomLat,
        longitude: randomLng,
      })

      setIsLoading(false)

      toast({
        title: "تم تحديد الموقع",
        description: "تم تحديد موقعك بنجاح",
      })
    }, 1000)
  }

  // No renderizar nada durante SSR
  if (!isBrowser) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <div className="flex gap-2">
            <Input id="address" placeholder="أدخل عنوانك..." className="flex-1 text-right" />
            <Button type="button" variant="outline">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          <Button type="button" className="w-full">
            تأكيد الموقع
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">العنوان</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="أدخل عنوانك..."
            className="flex-1 text-right"
          />
          <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={isGettingCurrentLocation}>
            {isGettingCurrentLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </div>

        <Button type="button" className="w-full" disabled={isLoading || !address.trim()} onClick={confirmLocation}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري التحديد...
            </>
          ) : (
            "تأكيد الموقع"
          )}
        </Button>
      </div>

      <div className="mt-2">
        <Label className="mb-2 block">اختر مدينة</Label>
        <div className="flex flex-wrap gap-2">
          {moroccanCities.map((city) => (
            <Button
              key={city}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddress(city)}
              className="text-xs"
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
