import { useState, useEffect } from "react";
import { Upload, Info } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import exampleImage from "figma:asset/233682d70ff8ce36b2445982bd652648414a5b2f.png";

interface Step1SequenciaTrabalhoProps {
  onSequenciaData?: (data: { imagemUrl: string | null }) => void;
}

export function Step1SequenciaTrabalho({ onSequenciaData }: Step1SequenciaTrabalhoProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    if (onSequenciaData) {
      onSequenciaData({ imagemUrl: selectedImage });
    }
  }, [selectedImage, onSequenciaData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {selectedImage ? (
          <div className="space-y-4">
            <img 
              src={selectedImage} 
              alt="Sequência de trabalho" 
              className="max-h-96 mx-auto rounded-lg"
            />
            <Button
              variant="outline"
              onClick={() => {
                setSelectedImage(null);
                const input = document.getElementById("image-upload") as HTMLInputElement;
                if (input) input.value = "";
              }}
            >
              Alterar Imagem
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-lg font-medium mb-1">Selecione a imagem</div>
                <div className="text-sm text-gray-500">
                  Arraste e solte ou clique para fazer upload
                </div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="mt-4"
            >
              Escolher Arquivo
            </Button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-gray-700 mb-2">
              A recomendação do Shusa é que você indique em planta, com números, qual a sequência 
              de trabalho ideal, conforme o que você já sabe que será utilizado em campo.{" "}
              <button
                onClick={() => setShowExample(true)}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Clique aqui para ver um exemplo
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Dialog com exemplo */}
      <Dialog open={showExample} onOpenChange={setShowExample}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Exemplo de Sequência de Trabalho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={exampleImage} 
              alt="Exemplo de sequência de trabalho" 
              className="w-full rounded-lg"
            />
            <p className="text-sm text-gray-600">
              Observe como a sequência está numerada de 1 a 7, indicando a ordem ideal de execução do trabalho.
              Use números em círculos vermelhos e setas verdes para mostrar o fluxo do trabalho.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}