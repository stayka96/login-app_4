"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  initialImages?: string[]
}

export function ImageUploader({ onImagesChange, maxImages = 5, initialImages = [] }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: "تجاوز الحد الأقصى",
        description: `يمكنك تحميل ${maxImages} صور كحد أقصى`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const newImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // التحقق من نوع الملف
        if (!file.type.startsWith("image/")) {
          toast({
            title: "نوع ملف غير صالح",
            description: "يرجى تحميل ملفات صور فقط",
            variant: "destructive",
          })
          continue
        }

        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "حجم الملف كبير جدًا",
            description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
            variant: "destructive",
          })
          continue
        }

        // في التطبيق الحقيقي، قم بتحميل الصورة إلى الخادم
        // هنا نقوم بمحاكاة ذلك باستخدام URL.createObjectURL
        const imageUrl = URL.createObjectURL(file)
        newImages.push(imageUrl)
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange(updatedImages)

      // إعادة تعيين حقل الإدخال
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الصور. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.capture = "environment"
      fileInputRef.current.click()
    }
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.removeAttribute("capture")
      fileInputRef.current.click()
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative h-32 rounded-lg overflow-hidden border">
              <Image src={image || "/placeholder.svg"} alt={`صورة ${index + 1}`} fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 left-1 h-6 w-6 rounded-full"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isUploading ? (
        <div className="flex items-center justify-center h-32 border border-dashed rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mr-2">جاري التحميل...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-32 flex flex-col items-center justify-center border-dashed"
            onClick={handleCameraCapture}
            disabled={images.length >= maxImages}
          >
            <Camera size={24} className="mb-2" />
            <span>التقاط صورة</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-32 flex flex-col items-center justify-center border-dashed"
            onClick={handleFileUpload}
            disabled={images.length >= maxImages}
          >
            <Upload size={24} className="mb-2" />
            <span>رفع صورة</span>
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        {images.length} / {maxImages} صور
      </p>
    </div>
  )
}
