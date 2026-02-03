import { Badge } from "@/app/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface TrabalhoItemProps {
  codigo: string;
  titulo: string;
  status: "ativo" | "rascunho" | "obsoleto";
  isSelected: boolean;
  onClick: () => void;
}

export function TrabalhoItem({ codigo, titulo, status, isSelected, onClick }: TrabalhoItemProps) {
  const statusColors = {
    ativo: "text-green-600",
    rascunho: "text-yellow-600",
    obsoleto: "text-gray-400"
  };

  return (
    <div 
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-500">{codigo}</span>
            <span className="text-sm font-medium text-gray-700">•</span>
            <span className="text-sm font-medium text-gray-900">{titulo}</span>
            <Badge 
              variant="outline" 
              className={`${statusColors[status]} border-current`}
            >
              {status === "ativo" ? "Ativo" : status === "rascunho" ? "Rascunho" : "Obsoleto"}
            </Badge>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}