import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  iconColor: string;
}

export function StatCard({ icon: Icon, label, value, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span>{label}</span>
      </div>
      <div className="text-3xl font-medium">{value}</div>
    </div>
  );
}