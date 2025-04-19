interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="5" y="5" width="90" height="90" rx="25" fill="#0066FF" />
        <path
          d="M65 35C65 40.5228 60.5228 45 55 45C49.4772 45 45 40.5228 45 35C45 29.4772 49.4772 25 55 25C60.5228 25 65 29.4772 65 35Z"
          fill="#0066FF"
        />
        <path
          d="M38 30L45 37M45 37L38 44M45 37H25"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 75C55 69.4772 59.4772 65 65 65C70.5228 65 75 69.4772 75 75C75 80.5228 70.5228 85 65 85C59.4772 85 55 80.5228 55 75Z"
          fill="#0066FF"
        />
        <path
          d="M62 70L55 63M55 63L62 56M55 63H75"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">الموقف - الشعار الرسمي</span>
    </div>
  )
}
