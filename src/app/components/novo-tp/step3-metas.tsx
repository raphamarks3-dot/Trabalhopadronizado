import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Badge } from "@/app/components/ui/badge";

interface MetaProducao {
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
}

const diasSemana = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

const fornecedoresDisponiveis = [
  { id: "1", nome: "Construtora ABC Ltda" },
  { id: "2", nome: "Materiais São José" },
  { id: "3", nome: "Fornecedor Central" },
  { id: "4", nome: "MegaObras Suprimentos" },
  { id: "5", nome: "Distribuidora Constrular" },
  { id: "6", nome: "Casa dos Materiais" },
];

interface Step3MetasProducaoProps {
  onMetasData?: (data: MetaProducao[]) => void;
}

export function Step3MetasProducao({ onMetasData }: Step3MetasProducaoProps) {
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>(["segunda", "terca", "quarta", "quinta", "sexta"]);
  const [metas, setMetas] = useState<MetaProducao[]>([]);
  const [editandoMeta, setEditandoMeta] = useState<MetaProducao | null>(null);
  const [novaMeta, setNovaMeta] = useState({
    dia: "",
    atividadeRealizada: "",
    meta: "",
    efetivoOficiais: "",
    efetivoAjudantes: "",
    unidadeProducao: "",
    quantidadeProduzida: "",
    fornecedores: [] as string[],
    materiaisNecessarios: "",
    descricaoAtividade: "",
    criterioAceitacao: "",
  });

  // Notifica mudanças nas metas
  useEffect(() => {
    if (onMetasData) {
      onMetasData(metas);
    }
  }, [metas, onMetasData]);

  const toggleDia = (dia: string) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
      // Remove metas desse dia
      setMetas(metas.filter(m => m.dia !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  };

  // Função para verificar se o dia selecionado já tem meta e carregar os dados
  const handleDiaChange = (dia: string) => {
    const metaExistente = metas.find(m => m.dia === dia);
    if (metaExistente) {
      // Se já existe meta para este dia, carrega os dados para edição
      setEditandoMeta(metaExistente);
      setNovaMeta({
        dia: metaExistente.dia,
        atividadeRealizada: metaExistente.atividadeRealizada,
        meta: metaExistente.meta,
        efetivoOficiais: metaExistente.efetivoOficiais,
        efetivoAjudantes: metaExistente.efetivoAjudantes,
        unidadeProducao: metaExistente.unidadeProducao,
        quantidadeProduzida: metaExistente.quantidadeProduzida,
        fornecedores: metaExistente.fornecedores,
        materiaisNecessarios: metaExistente.materiaisNecessarios,
        descricaoAtividade: metaExistente.descricaoAtividade,
        criterioAceitacao: metaExistente.criterioAceitacao,
      });
    } else {
      // Se não existe, limpa o formulário
      setEditandoMeta(null);
      setNovaMeta({
        dia: dia,
        atividadeRealizada: "",
        meta: "",
        efetivoOficiais: "",
        efetivoAjudantes: "",
        unidadeProducao: "",
        quantidadeProduzida: "",
        fornecedores: [] as string[],
        materiaisNecessarios: "",
        descricaoAtividade: "",
        criterioAceitacao: "",
      });
    }
  };

  const adicionarMeta = () => {
    if (novaMeta.dia && novaMeta.atividadeRealizada && novaMeta.meta) {
      if (editandoMeta) {
        setMetas(metas.map(m => m.id === editandoMeta.id ? { ...novaMeta, id: editandoMeta.id } : m));
        setEditandoMeta(null);
      } else {
        setMetas([...metas, { ...novaMeta, id: Date.now() }]);
      }
      setNovaMeta({
        dia: "",
        atividadeRealizada: "",
        meta: "",
        efetivoOficiais: "",
        efetivoAjudantes: "",
        unidadeProducao: "",
        quantidadeProduzida: "",
        fornecedores: [] as string[],
        materiaisNecessarios: "",
        descricaoAtividade: "",
        criterioAceitacao: "",
      });
    }
  };

  const editarMeta = (meta: MetaProducao) => {
    setEditandoMeta(meta);
    setNovaMeta({
      dia: meta.dia,
      atividadeRealizada: meta.atividadeRealizada,
      meta: meta.meta,
      efetivoOficiais: meta.efetivoOficiais,
      efetivoAjudantes: meta.efetivoAjudantes,
      unidadeProducao: meta.unidadeProducao,
      quantidadeProduzida: meta.quantidadeProduzida,
      fornecedores: meta.fornecedores,
      materiaisNecessarios: meta.materiaisNecessarios,
      descricaoAtividade: meta.descricaoAtividade,
      criterioAceitacao: meta.criterioAceitacao,
    });
  };

  const removerMeta = (id: number) => {
    setMetas(metas.filter(m => m.id !== id));
  };

  const getDiaLabel = (diaValue: string) => {
    return diasSemana.find(d => d.value === diaValue)?.label || diaValue;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Dias de Produção</Label>
        <div className="flex flex-wrap gap-4">
          {diasSemana.map((dia) => (
            <div key={dia.value} className="flex items-center space-x-2">
              <Checkbox
                id={dia.value}
                checked={diasSelecionados.includes(dia.value)}
                onCheckedChange={() => toggleDia(dia.value)}
              />
              <label
                htmlFor={dia.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {dia.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {diasSelecionados.length > 0 && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Adicionar Meta de Produção</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dia</Label>
              <Select value={novaMeta.dia} onValueChange={(value) => handleDiaChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {diasSelecionados.map((dia) => (
                    <SelectItem key={dia} value={dia}>
                      {getDiaLabel(dia)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Atividade Realizada</Label>
              <Input
                placeholder="Ex: Concretagem 1º pavimento"
                value={novaMeta.atividadeRealizada}
                onChange={(e) => setNovaMeta({ ...novaMeta, atividadeRealizada: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Meta (%)</Label>
              <Input
                type="number"
                placeholder="Ex: 25"
                min="0"
                max="100"
                value={novaMeta.meta}
                onChange={(e) => setNovaMeta({ ...novaMeta, meta: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Efetivo Oficiais</Label>
              <Input
                type="number"
                placeholder="Ex: 4"
                min="0"
                value={novaMeta.efetivoOficiais}
                onChange={(e) => setNovaMeta({ ...novaMeta, efetivoOficiais: e.target.value.replace(/[^0-9]/g, '') })}
              />
            </div>

            <div className="space-y-2">
              <Label>Efetivo Ajudantes</Label>
              <Input
                type="number"
                placeholder="Ex: 2"
                min="0"
                value={novaMeta.efetivoAjudantes}
                onChange={(e) => setNovaMeta({ ...novaMeta, efetivoAjudantes: e.target.value.replace(/[^0-9]/g, '') })}
              />
            </div>

            <div className="space-y-2">
              <Label>Unidade de Produção</Label>
              <Select 
                value={novaMeta.unidadeProducao} 
                onValueChange={(value) => setNovaMeta({ ...novaMeta, unidadeProducao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
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
            </div>

            <div className="space-y-2">
              <Label>Quantidade Produzida</Label>
              <Input
                type="number"
                placeholder="Ex: 100"
                min="0"
                step="0.01"
                value={novaMeta.quantidadeProduzida}
                onChange={(e) => setNovaMeta({ ...novaMeta, quantidadeProduzida: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Fornecedores</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal h-auto min-h-[40px]"
                  >
                    <div className="flex flex-wrap gap-2 w-full">
                      {novaMeta.fornecedores.length > 0 ? (
                        novaMeta.fornecedores.map((fornecedorId) => {
                          const fornecedor = fornecedoresDisponiveis.find(f => f.id === fornecedorId);
                          return fornecedor ? (
                            <Badge 
                              key={fornecedorId} 
                              variant="secondary"
                              className="bg-teal-100 text-teal-800 hover:bg-teal-200"
                            >
                              {fornecedor.nome}
                              <button
                                type="button"
                                className="ml-1 hover:bg-teal-300 rounded-full p-0.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNovaMeta({ 
                                    ...novaMeta, 
                                    fornecedores: novaMeta.fornecedores.filter(id => id !== fornecedorId) 
                                  });
                                }}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ) : null;
                        })
                      ) : (
                        <span className="text-gray-500">Selecione os fornecedores</span>
                      )}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Selecione os Fornecedores</h4>
                    <div className="space-y-2">
                      {fornecedoresDisponiveis.map((fornecedor) => (
                        <div key={fornecedor.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`fornecedor-${fornecedor.id}`}
                            checked={novaMeta.fornecedores.includes(fornecedor.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNovaMeta({ 
                                  ...novaMeta, 
                                  fornecedores: [...novaMeta.fornecedores, fornecedor.id] 
                                });
                              } else {
                                setNovaMeta({ 
                                  ...novaMeta, 
                                  fornecedores: novaMeta.fornecedores.filter(id => id !== fornecedor.id) 
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`fornecedor-${fornecedor.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {fornecedor.nome}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Materiais Necessários</Label>
              <Input
                placeholder="Ex: Concreto, vibrador, colher de pedreiro"
                value={novaMeta.materiaisNecessarios}
                onChange={(e) => setNovaMeta({ ...novaMeta, materiaisNecessarios: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Descrição da Atividade</Label>
              <Textarea
                placeholder="Descreva detalhadamente a atividade a ser executada"
                value={novaMeta.descricaoAtividade}
                onChange={(e) => setNovaMeta({ ...novaMeta, descricaoAtividade: e.target.value })}
                rows={3}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Critério de Aceitação</Label>
              <Textarea
                placeholder="Defina os critérios para considerar a atividade concluída"
                value={novaMeta.criterioAceitacao}
                onChange={(e) => setNovaMeta({ ...novaMeta, criterioAceitacao: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <Button
            onClick={adicionarMeta}
            disabled={!novaMeta.dia || !novaMeta.atividadeRealizada || !novaMeta.meta}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {editandoMeta ? "Atualizar Meta" : "Adicionar Meta"}
          </Button>
        </div>
      )}

      {metas.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Efetivo</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metas.map((meta) => (
                <TableRow key={meta.id}>
                  <TableCell className="font-medium">{getDiaLabel(meta.dia)}</TableCell>
                  <TableCell>{meta.atividadeRealizada}</TableCell>
                  <TableCell>{meta.meta}%</TableCell>
                  <TableCell>{meta.efetivoOficiais} oficiais + {meta.efetivoAjudantes} ajudantes</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editarMeta(meta)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerMeta(meta.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}