interface WrenchLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function WrenchLogo({ size = "md", className = "" }: WrenchLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="5" y="5" width="90" height="90" rx="25" fill="#0066FF" />
        <path
          d="M30 40C30 35.5817 33.5817 32 38 32C42.4183 32 46 35.5817 46 40C46 41.4883 45.5759 42.8835 44.8284 44.0623L65 64.2339L60.2339 69L40.0623 48.8284C38.8835 49.5759 37.4883 50 36 50C31.5817 50 28 46.4183 28 42C28 37.5817 31.5817 34 36 34"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="70" cy="70" r="4" fill="white" />
      </svg>
      <span className="sr-only">الموقف - الشعار الرسمي</span>
    </div>
  )
}
