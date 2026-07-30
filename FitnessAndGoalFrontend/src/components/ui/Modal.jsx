import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div
        className={`
          relative w-full ${sizeStyles[size]}
          bg-white dark:bg-slate-800 rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          animate-in fade-in zoom-in
        `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            {title && (
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="!p-2 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
