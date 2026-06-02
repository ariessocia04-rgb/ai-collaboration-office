import { Building2 } from "lucide-react";

export function IRentLogo({ size = "default" }: { size?: "default" | "large" }) {
  const isLarge = size === "large";
  return (
    <div className={`flex items-center gap-2 ${isLarge ? "gap-3" : ""}`}>
      <div
        className={`flex items-center justify-center rounded-lg bg-brand text-primary-foreground ${
          isLarge ? "h-10 w-10" : "h-8 w-8"
        }`}
      >
        <Building2 className={isLarge ? "h-5 w-5" : "h-4 w-4"} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-foreground ${isLarge ? "text-2xl" : "text-xl"}`}>
          IRent
        </span>
        {isLarge && (
          <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
            Command Center
          </span>
        )}
      </div>
    </div>
  );
}
