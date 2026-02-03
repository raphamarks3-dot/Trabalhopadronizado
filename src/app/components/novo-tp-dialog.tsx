import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Step1SequenciaTrabalho } from "@/app/components/novo-tp/step1-sequencia";
import { Step2ListaMateriais } from "@/app/components/novo-tp/step2-materiais";
import { Step3MetasProducao } from "@/app/components/novo-tp/step3-metas";

interface NovoTpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTpCreated: (novoTp: {
    codigo: string;
    titulo: string;
    status: "rascunho" | "ativo" | "obsoleto";
    sequenciaTrabalho?: any;
    materiais?: any[];
    metas?: any[];
  }) => void;
}

export function NovoTpDialog({ open, onOpenChange, onTpCreated }: NovoTpDialogProps) {
  const [currentStep, setCurrentStep] = useState<"inicial" | 1 | 2 | 3>("inicial");
  const [codigo, setCodigo] = useState("");
  const [pacoteMacrofluxo, setPacoteMacrofluxo] = useState("");
  const [sequenciaData, setSequenciaData] = useState<any>(null);
  const [materiaisData, setMateriaisData] = useState<any[]>([]);
  const [metasData, setMetasData] = useState<any[]>([]);

  const handleIniciar = () => {
    if (codigo && pacoteMacrofluxo) {
      setCurrentStep(1);
    }
  };

  const handleProximo = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handleVoltar = () => {
    if (currentStep === 1) setCurrentStep("inicial");
    else if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
  };

  const handleFinalizar = () => {
    // Aqui você salvaria o TP
    const tituloPacote = pacoteMacrofluxo
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' de ');
    
    onTpCreated({
      codigo,
      titulo: tituloPacote,
      status: "rascunho",
      sequenciaTrabalho: sequenciaData,
      materiais: materiaisData,
      metas: metasData,
    });
    
    onOpenChange(false);
    setCurrentStep("inicial");
    setCodigo("");
    setPacoteMacrofluxo("");
    setSequenciaData(null);
    setMateriaisData([]);
    setMetasData([]);
  };

  const resetDialog = () => {
    setCurrentStep("inicial");
    setCodigo("");
    setPacoteMacrofluxo("");
    setSequenciaData(null);
    setMateriaisData([]);
    setMetasData([]);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetDialog();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "inicial" && "Novo Trabalho Padronizado"}
            {currentStep === 1 && "Passo 1 - Sequência de Trabalho"}
            {currentStep === 2 && "Passo 2 - Lista de Materiais"}
            {currentStep === 3 && "Passo 3 - Metas de Produção"}
          </DialogTitle>
        </DialogHeader>

        {/* Etapa Inicial */}
        {currentStep === "inicial" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do TP</Label>
              <Input
                id="codigo"
                placeholder="Ex: TP-883"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pacote">Pacote do Macrofluxo</Label>
              <Select value={pacoteMacrofluxo} onValueChange={setPacoteMacrofluxo}>
                <SelectTrigger id="pacote">
                  <SelectValue placeholder="Selecione o pacote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estrutura-lajes">Estrutura - Lajes</SelectItem>
                  <SelectItem value="estrutura-pilares">Estrutura - Pilares</SelectItem>
                  <SelectItem value="alvenaria">Alvenaria</SelectItem>
                  <SelectItem value="revestimento">Revestimento</SelectItem>
                  <SelectItem value="instalacoes">Instalações</SelectItem>
                  <SelectItem value="acabamento">Acabamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleIniciar}
                disabled={!codigo || !pacoteMacrofluxo}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Iniciar
              </Button>
            </div>
          </div>
        )}

        {/* Passo 1 - Sequência de Trabalho */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Step1SequenciaTrabalho onSequenciaData={setSequenciaData} />
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleVoltar}>
                Voltar
              </Button>
              <Button onClick={handleProximo} className="bg-orange-500 hover:bg-orange-600">
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* Passo 2 - Lista de Materiais */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Step2ListaMateriais pacoteMacrofluxo={pacoteMacrofluxo} onMateriaisData={setMateriaisData} />
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleVoltar}>
                Voltar
              </Button>
              <Button onClick={handleProximo} className="bg-orange-500 hover:bg-orange-600">
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* Passo 3 - Metas de Produção */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Step3MetasProducao onMetasData={setMetasData} />
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleVoltar}>
                Voltar
              </Button>
              <Button onClick={handleFinalizar} className="bg-orange-500 hover:bg-orange-600">
                Finalizar
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {currentStep !== "inicial" && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep === 1 ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}>
              1
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep === 2 ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}>
              2
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep === 3 ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}>
              3
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}