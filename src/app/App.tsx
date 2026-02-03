import { useState } from "react";
import { FileText, CheckCircle2, Edit3, Building2, Plus, Search, Archive, Info, Edit2 } from "lucide-react";
import { StatCard } from "@/app/components/stat-card";
import { TrabalhoItem } from "@/app/components/trabalho-item";
import { TrabalhoDetails } from "@/app/components/trabalho-details";
import { NovoTpDialog } from "@/app/components/novo-tp-dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/app/components/ui/dialog";
import { Card } from "@/app/components/ui/card";
import { CalendarDays } from "lucide-react";

interface Trabalho {
  id: number;
  codigo: string;
  titulo: string;
  status: "ativo" | "rascunho" | "obsoleto";
  descricao: string;
  area: string;
  tipo: string;
  criadoPor: string;
  dataCriacao: string;
  versoes: number;
  execucoes: number;
  sequenciaTrabalho?: any;
  materiais?: any[];
  metas?: any[];
}

const mockTrabalhos: Trabalho[] = [
  {
    id: 1,
    codigo: "TP-882",
    titulo: "Concretagem de Lajes",
    status: "ativo",
    descricao: "Trabalho padronizado para concretagem de lajes, incluindo preparação, lançamento, adensamento e cura do concreto.",
    area: "Estrutura",
    tipo: "Específico da Obra",
    criadoPor: "Raphael da Costa",
    dataCriacao: "17/01/2026",
    versoes: 1,
    execucoes: 0
  },
  {
    id: 2,
    codigo: "TP-881",
    titulo: "Execução de Alvenaria de Vedação",
    status: "ativo",
    descricao: "Trabalho padronizado para execução de alvenaria de vedação em blocos cerâmicos.",
    area: "Alvenaria",
    tipo: "Corporativo",
    criadoPor: "Maria Silva",
    dataCriacao: "15/01/2026",
    versoes: 2,
    execucoes: 5
  }
];

export default function App() {
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>(mockTrabalhos);
  const [selectedTrabalho, setSelectedTrabalho] = useState<Trabalho | null>(null);
  const [showNovoTpDialog, setShowNovoTpDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filteredTrabalhos = trabalhos.filter(trabalho => {
    const matchesSearch = trabalho.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trabalho.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || trabalho.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: trabalhos.length,
    ativos: trabalhos.filter(t => t.status === "ativo").length,
    rascunho: trabalhos.filter(t => t.status === "rascunho").length,
    corporativos: trabalhos.filter(t => t.tipo === "Corporativo").length,
  };

  const handleTpCreated = (novoTp: { 
    codigo: string; 
    titulo: string; 
    status: "rascunho" | "ativo" | "obsoleto";
    sequenciaTrabalho?: any;
    materiais?: any[];
    metas?: any[];
  }) => {
    const novoTrabalho: Trabalho = {
      id: trabalhos.length + 1,
      codigo: novoTp.codigo,
      titulo: novoTp.titulo,
      status: novoTp.status,
      descricao: `Trabalho padronizado ${novoTp.titulo}`,
      area: "Estrutura",
      tipo: "Específico da Obra",
      criadoPor: "Usuário Atual",
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      versoes: 1,
      execucoes: 0,
      sequenciaTrabalho: novoTp.sequenciaTrabalho,
      materiais: novoTp.materiais,
      metas: novoTp.metas,
    };
    
    setTrabalhos([novoTrabalho, ...trabalhos]);
    setSelectedTrabalho(novoTrabalho);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <h1 className="text-2xl font-semibold mb-2">Trabalho Padronizado</h1>
        <p className="text-gray-600 text-sm">
          Documentação, versionamento e controle de execução de processos padronizados (Lean Construction)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-4 gap-6">
          <StatCard 
            icon={FileText} 
            label="Total de TPs" 
            value={stats.total}
            iconColor="text-gray-500"
          />
          <StatCard 
            icon={CheckCircle2} 
            label="Ativos" 
            value={stats.ativos}
            iconColor="text-green-600"
          />
          <StatCard 
            icon={Edit3} 
            label="Em Rascunho" 
            value={stats.rascunho}
            iconColor="text-yellow-600"
          />
          <StatCard 
            icon={Building2} 
            label="Corporativos" 
            value={stats.corporativos}
            iconColor="text-blue-600"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-12 gap-6" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Left Panel - List */}
          <div className="col-span-4 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Trabalhos Padronizados</h2>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setShowNovoTpDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo TP
                </Button>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar por código ou título..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="obsoleto">Obsoleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredTrabalhos.map((trabalho) => (
                <TrabalhoItem
                  key={trabalho.id}
                  codigo={trabalho.codigo}
                  titulo={trabalho.titulo}
                  status={trabalho.status}
                  isSelected={selectedTrabalho?.id === trabalho.id}
                  onClick={() => setSelectedTrabalho(trabalho)}
                />
              ))}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="col-span-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">{selectedTrabalho?.codigo}</span>
                <span className="text-sm font-medium text-gray-700">•</span>
                <span className="text-sm font-medium text-gray-900">{selectedTrabalho?.titulo}</span>
                {selectedTrabalho?.status === "ativo" && (
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    Ativo
                  </span>
                )}
                {selectedTrabalho?.status === "rascunho" && (
                  <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                    Rascunho
                  </span>
                )}
                {selectedTrabalho?.status === "obsoleto" && (
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                    Obsoleto
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      title="Informações"
                      className="h-9 w-9"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Informações - {selectedTrabalho?.codigo}</DialogTitle>
                      <DialogDescription>
                        Detalhes completos sobre o trabalho padronizado.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Descrição</h3>
                        <p className="text-gray-700">{selectedTrabalho?.descricao}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Área de Aplicação</h3>
                          <p className="font-medium">{selectedTrabalho?.area}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Tipo</h3>
                          <p className="font-medium">{selectedTrabalho?.tipo}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Criado por</h3>
                          <p className="font-medium">{selectedTrabalho?.criadoPor}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Data de Criação</h3>
                          <p className="font-medium">{selectedTrabalho?.dataCriacao}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-2xl font-semibold">{selectedTrabalho?.versoes}</div>
                              <div className="text-sm text-gray-500">Versões</div>
                            </div>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <CalendarDays className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-2xl font-semibold">{selectedTrabalho?.execucoes}</div>
                              <div className="text-sm text-gray-500">Execuções</div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                  title="Editar"
                  className="h-9 w-9 bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-orange-500"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  title="Obsoletizar"
                  className="h-9 w-9"
                >
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <TrabalhoDetails trabalho={selectedTrabalho} isEditing={isEditing} onEditingChange={setIsEditing} />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center transition-colors"
        onClick={() => setShowNovoTpDialog(true)}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Dialog Novo TP */}
      <NovoTpDialog open={showNovoTpDialog} onOpenChange={setShowNovoTpDialog} onTpCreated={handleTpCreated} />
    </div>
  );
}