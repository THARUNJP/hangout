import { Loader } from "lucide-react";

type SiteLoaderProps = {
  color?: string;
  text?: string;
};

export const SiteLoader = ({
  color = "#2563eb", // Tailwind blue-600
  text = "Loading...",
}: SiteLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      <Loader
        size={64}
        className="animate-spin"
        color={color}
        strokeWidth={2}
      />
      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  );
};
