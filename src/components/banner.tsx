import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const bannerVariants = cva(
  "border text-centeer p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emrald-700 border-emrald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const bannerIcons = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export default function Banner({ label, variant }: BannerProps) {
  const Icon = bannerIcons[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-2 size-4" />
      <span>{label}</span>
    </div>
  );
}
