import { useState, useEffect } from "react";
import { FileText, CalendarDays, Settings, Edit2, Save, X, Plus, Trash2, Upload } from "lucide-react";
import exampleImage from 'figma:asset/cc9c768cf6e85d86de0e594fa6d2e022dadbb3a2.png';
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";

interface TrabalhoDetailsProps {
  trabalho: {
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
    sequenciaTrabalho?: {
      imagemUrl: string;
      exampleShusa: string;
    };
    materiais?: Array<{
      id: number;
      descricao: string;
      quantidade: string;
      unidade: string;
    }>;
    metas?: Array<{
      id: number;
      dia: string;
      atividadeRealizada: string;
      meta: string;
      efetivoOficiais: string;
      efetivoAjudantes: string;
      unidadeProducao: string;
      quantidadeProduzida: string;
      fornecedores: string[];
      materiaisNecessarios: string;
      descricaoAtividade: string;
      criterioAceitacao: string;
    }>;
  } | null;
  isEditing: boolean;
  onEditingChange: (value: boolean) => void;
}

// Mock data para a versão ativa
const mockVersaoAtiva = {
  responsavel: "Evan Plante",
  dataRevisao: "2026-01-18",
  statusRevisao: "nova",
  imagemSequencia: exampleImage,
  suprimentos: [
    "Pré-montagem gretha",
    "Fusão: Tarjalz 9:90 em 7",
    "Kit Lácar: Cola Fita Rosca - ø2",
    "Kit Lasar: Cola Chave Boca de Boca Grito"
  ],
  metas: [
    {
      id: 1,
      dia: 1,
      servico: "Instalação Hidráulica",
      qtdServico: "15.50",
      unidade: "m²",
      materialUtilizado: "Kit Cozinha: Cola Acal fita Veda Rosca Tresa. Chave de Boca",
      meta: "10%",
      efetivo: "1",
      descricaoEscopo: "Execucar das inspeções 1 da optoraniogus 1,2 inspeções",
      criteriosAceitacao: "Ter constinuação e arcape, qua etablicar toipuzar darente e inspeções"
    },
    {
      id: 2,
      dia: 2,
      servico: "Instalação Hidráulica",
      qtdServico: "20.75",
      unidade: "m²",
      materialUtilizado: "Kit Cozinha: Cold Acal fita Veda Rosca Tresa: Chave de Boca",
      meta: "30%",
      efetivo: "1",
      descricaoEscopo: "Execucar dar inspeções 1 e cor hús inocas 1,2",
      criteriosAceitacao: "Ter constinuação e arcape, ou e stabilicar toipuzar darente e inspeções"
    },
    {
      id: 3,
      dia: 3,
      servico: "Instalação Hidráulica",
      qtdServico: "18.00",
      unidade: "m²",
      materialUtilizado: "Kit Cozinha: Cola Acal fita Veda Rosca Tresa. Chave de Boca",
      meta: "50%",
      efetivo: "1",
      descricaoEscopo: "Execucar das inspeções intermediárias e verificações",
      criteriosAceitacao: "Verificar conformidade e qualidade das instalações realizadas"
    },
    {
      id: 4,
      dia: 4,
      servico: "Instalação Hidráulica",
      qtdServico: "22.30",
      unidade: "m²",
      materialUtilizado: "Kit Cozinha: Cold Acal fita Veda Rosca Tresa: Chave de Boca",
      meta: "80%",
      efetivo: "1",
      descricaoEscopo: "Finalização das instalações principais e ajustes",
      criteriosAceitacao: "Garantir que todas as conexões estejam firmes e testadas"
    },
    {
      id: 5,
      dia: 5,
      servico: "Limpeza Final",
      qtdServico: "100.00",
      unidade: "m²",
      materialUtilizado: "Vassouras: Pá. carinho de mão",
      meta: "100%",
      efetivo: "1",
      descricaoEscopo: "Limpeza de arcoco.",
      criteriosAceitacao: "Limpeza isitars, rsenhar trolhar a nerodinção de mata"
    }
  ]
};

// Lista de serviços disponíveis no sistema
const servicosDisponiveis = [
  "Instalação Hidráulica",
  "Instalação Elétrica",
  "Alvenaria",
  "Reboco e Emboço",
  "Pintura",
  "Gesso",
  "Instalação de Pisos",
  "Instalação de Revestimentos",
  "Carpintaria",
  "Serralheria",
  "Impermeabilização",
  "Limpeza Final",
  "Acabamento",
  "Fundação",
  "Estrutura"
];

export function TrabalhoDetails({ trabalho, isEditing, onEditingChange }: TrabalhoDetailsProps) {
  const [statusRevisao, setStatusRevisao] = useState(mockVersaoAtiva.statusRevisao);
  const [dataRevisao, setDataRevisao] = useState(mockVersaoAtiva.dataRevisao);
  const [responsavel, setResponsavel] = useState(mockVersaoAtiva.responsavel);
  const [imagemSequencia, setImagemSequencia] = useState(mockVersaoAtiva.imagemSequencia);
  const [suprimentos, setSuprimentos] = useState(mockVersaoAtiva.suprimentos);
  const [metas, setMetas] = useState(mockVersaoAtiva.metas);
  const [novoSuprimento, setNovoSuprimento] = useState("");

  // Atualiza os dados quando o trabalho muda
  useEffect(() => {
    if (trabalho) {
      // Usa os dados do trabalho se disponíveis, caso contrário usa mock
      if (trabalho.sequenciaTrabalho?.imagemUrl) {
        setImagemSequencia(trabalho.sequenciaTrabalho.imagemUrl);
      } else {
        setImagemSequencia(mockVersaoAtiva.imagemSequencia);
      }

      if (trabalho.materiais && trabalho.materiais.length > 0) {
        const materiaisFormatados = trabalho.materiais.map(m => 
          `${m.descricao}: ${m.quantidade} ${m.unidade}`
        );
        setSuprimentos(materiaisFormatados);
      } else {
        setSuprimentos(mockVersaoAtiva.suprimentos);
      }

      if (trabalho.metas && trabalho.metas.length > 0) {
        const metasFormatadas = trabalho.metas.map(m => ({
          id: m.id,
          dia: m.dia,
          materialUtilizado: m.materiaisNecessarios || "",
          meta: `${m.meta}%`,
          efetivo: `${m.efetivoOficiais} oficiais, ${m.efetivoAjudantes} ajudantes`,
          descricaoEscopo: m.descricaoAtividade || "",
          criteriosAceitacao: m.criterioAceitacao || ""
        }));
        setMetas(metasFormatadas);
      } else {
        setMetas(mockVersaoAtiva.metas);
      }

      // Dados de revisão usam valores padrão ou do trabalho
      setResponsavel(trabalho.criadoPor || mockVersaoAtiva.responsavel);
      setDataRevisao(mockVersaoAtiva.dataRevisao);
      setStatusRevisao(mockVersaoAtiva.statusRevisao);
    }
  }, [trabalho]);

  const handleSave = () => {
    // Aqui você salvaria os dados no backend
    console.log("Salvando alterações...", {
      responsavel,
      dataRevisao,
      statusRevisao,
      imagemSequencia,
      suprimentos,
      metas
    });
    onEditingChange(false);
  };

  const handleCancel = () => {
    // Restaurar valores originais
    setResponsavel(mockVersaoAtiva.responsavel);
    setDataRevisao(mockVersaoAtiva.dataRevisao);
    setStatusRevisao(mockVersaoAtiva.statusRevisao);
    setImagemSequencia(mockVersaoAtiva.imagemSequencia);
    setSuprimentos(mockVersaoAtiva.suprimentos);
    setMetas(mockVersaoAtiva.metas);
    onEditingChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagemSequencia(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSuprimento = () => {
    if (novoSuprimento.trim()) {
      setSuprimentos([...suprimentos, novoSuprimento.trim()]);
      setNovoSuprimento("");
    }
  };

  const removeSuprimento = (index: number) => {
    setSuprimentos(suprimentos.filter((_, i) => i !== index));
  };

  const updateMeta = (id: number, field: string, value: string) => {
    setMetas(metas.map(meta => 
      meta.id === id ? { ...meta, [field]: value } : meta
    ));
  };

  const addMeta = () => {
    const newId = Math.max(...metas.map(m => m.id), 0) + 1;
    const nextDia = Math.max(...metas.map(m => Number(m.dia)), 0) + 1;
    setMetas([...metas, {
      id: newId,
      dia: nextDia,
      servico: "",
      qtdServico: "",
      unidade: "m²",
      materialUtilizado: "",
      meta: "",
      efetivo: "",
      descricaoEscopo: "",
      criteriosAceitacao: ""
    }]);
  };

  const removeMeta = (id: number) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

  // Função que retorna os serviços disponíveis para um determinado dia de produção
  // Exclui serviços já selecionados naquele dia, exceto o serviço da meta atual
  const getServicosDisponiveisPorDia = (diaProducao: number, metaAtualId: number) => {
    // Filtra as metas do mesmo dia, excluindo a meta atual
    const servicosUsadosNoDia = metas
      .filter(meta => Number(meta.dia) === diaProducao && meta.id !== metaAtualId)
      .map(meta => meta.servico)
      .filter(servico => servico !== ""); // Remove valores vazios

    // Retorna apenas os serviços que não foram usados naquele dia
    return servicosDisponiveis.filter(servico => !servicosUsadosNoDia.includes(servico));
  };

  if (!trabalho) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Selecione um trabalho para ver os detalhes
      </div>
    );
  }

  const statusColors = {
    ativo: "bg-green-100 text-green-700 border-green-300",
    rascunho: "bg-yellow-100 text-yellow-700 border-yellow-300",
    obsoleto: "bg-gray-100 text-gray-700 border-gray-300"
  };

  const statusText = {
    ativo: "Ativo",
    rascunho: "Rascunho",
    obsoleto: "Obsoleto"
  };

  const statusRevisaoColors = {
    nova: "bg-blue-100 text-blue-700 border-blue-300",
    atualizada: "bg-green-100 text-green-700 border-green-300",
    obsoleta: "bg-red-100 text-red-700 border-red-300"
  };

  const statusRevisaoText = {
    nova: "Nova",
    atualizada: "Atualizada",
    obsoleta: "Obsoleta"
  };

  // Função para formatar o dia de produção
  const formatDiaProducao = (dia: number) => {
    if (dia === 1) return "1º dia";
    if (dia === 2) return "2º dia";
    if (dia === 3) return "3º dia";
    return `${dia}º dia`;
  };

  // Gera opções de dias de produção (até 30 dias)
  const diasProducaoOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col">
      {/* Conteúdo principal - Versão Ativa */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-8 pb-24">
          {/* Cabeçalho com informações de revisão */}
          <div className="grid grid-cols-3 gap-6 items-end">
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Responsável: {responsavel}</Label>
              <Input
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Responsavel"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Revisão</Label>
              <Input
                type="date"
                value={dataRevisao}
                onChange={(e) => setDataRevisao(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Status</Label>
              <Select value={statusRevisao} onValueChange={setStatusRevisao}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="atualizada">Atualizada</SelectItem>
                  <SelectItem value="obsoleta">Obsoleta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Layout superior: Sequência de Trabalho + Lista de Materiais */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* 1. Sequência de Trabalho */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">1. Sequência de Trabalho</h3>
              <div className="border-2 border-gray-300 rounded p-4 bg-white relative aspect-square flex items-center justify-center overflow-hidden">
                <img 
                  src={imagemSequencia} 
                  alt="Sequência de trabalho" 
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="upload-image"
                    />
                    <label
                      htmlFor="upload-image"
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                    >
                      <Upload className="w-4 h-4 text-gray-600" />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* 2. Lista de Materiais */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">2. Lista de Materiais</h3>
              <div className="border-2 border-gray-300 rounded p-6 bg-white min-h-[200px]">
                <ul className="space-y-3">
                  {suprimentos.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-900 font-bold">•</span>
                      <span className="text-gray-900 flex-1">{item}</span>
                      {isEditing && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeSuprimento(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditing && (
                  <div className="flex items-center gap-2 mt-4">
                    <Input
                      value={novoSuprimento}
                      onChange={(e) => setNovoSuprimento(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSuprimento()}
                      placeholder="Novo suprimento"
                      className="border-gray-300"
                    />
                    <Button
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800"
                      onClick={addSuprimento}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Metas de produção - Tabela */}
          <div className="space-y-3 mt-8">
            <h3 className="font-semibold text-lg">3. Metas de produção</h3>
            <div className="border-2 border-gray-300 rounded overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-teal-900 hover:bg-teal-900">
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      DIA DE PRODUÇÃO
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      SERVIÇO
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      QTD. SERVIÇO
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      UNIDADE
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      MATERIAL UTILIZADO
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      META
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      Efetivo Global
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center border-r border-teal-700">
                      DESCRIÇÃO DO ESCOPO
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center">
                      <div className="italic">Emprogar/sectr</div>
                      CRITÉRIOS DE ACEITAÇÃO/META
                    </TableHead>
                    {isEditing && (
                      <TableHead className="text-white font-semibold text-center border-l border-teal-700">
                        AÇÕES
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metas.map((meta, index) => (
                    <TableRow 
                      key={meta.id} 
                      className={index % 2 === 0 ? "bg-white" : "bg-teal-50"}
                    >
                      <TableCell className="font-medium border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Select 
                            value={String(meta.dia)} 
                            onValueChange={(value) => updateMeta(meta.id, "dia", value)}
                          >
                            <SelectTrigger className="border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {diasProducaoOptions.map((dia) => (
                                <SelectItem key={dia} value={String(dia)}>
                                  {formatDiaProducao(dia)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          formatDiaProducao(Number(meta.dia))
                        )}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Select 
                            value={meta.servico} 
                            onValueChange={(value) => updateMeta(meta.id, "servico", value)}
                          >
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>
                            <SelectContent>
                              {getServicosDisponiveisPorDia(Number(meta.dia), meta.id).map((servico) => (
                                <SelectItem key={servico} value={servico}>
                                  {servico}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          meta.servico
                        )}
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={meta.qtdServico}
                            onChange={(e) => updateMeta(meta.id, "qtdServico", e.target.value)}
                            placeholder="Qtd."
                            className="border-gray-300"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          meta.qtdServico
                        )}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Select 
                            value={meta.unidade} 
                            onValueChange={(value) => updateMeta(meta.id, "unidade", value)}
                          >
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Unidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m²">m²</SelectItem>
                              <SelectItem value="m³">m³</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="Tn">Tn</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          meta.unidade
                        )}
                      </TableCell>
                      <TableCell className="font-medium border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Input
                            value={meta.materialUtilizado}
                            onChange={(e) => updateMeta(meta.id, "materialUtilizado", e.target.value)}
                            placeholder="Material utilizado"
                            className="border-gray-300"
                          />
                        ) : (
                          meta.materialUtilizado
                        )}
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Input
                            value={meta.meta}
                            onChange={(e) => updateMeta(meta.id, "meta", e.target.value)}
                            placeholder="Meta"
                            className="border-gray-300"
                          />
                        ) : (
                          meta.meta
                        )}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 p-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={meta.efetivo}
                            onChange={(e) => updateMeta(meta.id, "efetivo", e.target.value)}
                            placeholder="Efetivo"
                            className="border-gray-300"
                            min="0"
                            step="1"
                          />
                        ) : (
                          meta.efetivo
                        )}
                      </TableCell>
                      <TableCell className="border-r border-gray-200 p-4 italic">
                        {isEditing ? (
                          <Textarea
                            value={meta.descricaoEscopo}
                            onChange={(e) => updateMeta(meta.id, "descricaoEscopo", e.target.value)}
                            placeholder="Descrição do escopo"
                            className="border-gray-300 min-h-[60px]"
                          />
                        ) : (
                          meta.descricaoEscopo
                        )}
                      </TableCell>
                      <TableCell className="p-4 italic">
                        {isEditing ? (
                          <Textarea
                            value={meta.criteriosAceitacao}
                            onChange={(e) => updateMeta(meta.id, "criteriosAceitacao", e.target.value)}
                            placeholder="Critérios de aceitação"
                            className="border-gray-300 min-h-[60px]"
                          />
                        ) : (
                          meta.criteriosAceitacao
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell className="text-center border-l border-gray-200 p-4">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeMeta(meta.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {isEditing && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={10} className="text-center p-4">
                        <Button
                          size="sm"
                          className="bg-teal-700 hover:bg-teal-800"
                          onClick={addMeta}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Meta
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}