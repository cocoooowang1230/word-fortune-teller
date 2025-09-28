import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";
import React from "react";

interface GameButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "mystical" | "neon" | "ghost-neon" | "danger";
  glowing?: boolean;
}

export const GameButton = ({ 
  className, 
  variant = "mystical", 
  glowing = false,
  children, 
  ...props 
}: GameButtonProps) => {
  return (
    <Button
      className={cn(
        "transition-all duration-300 font-medium",
        variant === "mystical" && 
          "bg-mystical hover:bg-mystical/80 text-foreground border border-mystical/20 shadow-glow",
        variant === "neon" && 
          "bg-neon-yellow text-background hover:bg-neon-yellow/80 font-bold shadow-neon",
        variant === "ghost-neon" && 
          "bg-transparent border-2 border-mystical text-mystical hover:bg-mystical/10 hover:shadow-glow",
        variant === "danger" && 
          "bg-destructive hover:bg-destructive/80 text-destructive-foreground",
        glowing && "animate-pulse-glow",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};