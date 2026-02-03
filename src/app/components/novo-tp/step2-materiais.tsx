import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface Material {
  id: number;
  descricao: string;
  quantidade: string;
  unidade: string;
}

interface ListaMaterial {
  codigo: string;
  nome: string;
  materiais: Material[];
}

interface Step2ListaMateriaisProps {
  pacoteMacrofluxo: string;
  onMateriaisData?: (data: Material[]) => void;
}

export function Step2ListaMateriais({ pacoteMacrofluxo, onMateriaisData }: Step2ListaMateriaisProps) {
  const [listasSalvas] = useState<ListaMaterial[]>([
    {
      codigo: "LM-001",
      nome: "Lista Padrão Concretagem",
      materiais: [
        { id: 1, descricao: "Concreto FCK 25", quantidade: "10", unidade: "m³" },
        { id: 2, descricao: "Aditivo plastificante", quantidade: "5", unidade: "L" },
      ]
    }
  ]);
  
  const [listaAtual, setListaAtual] = useState("");
  const [materiaisAtual, setMateriaisAtual] = useState<Material[]>([]);
  const [showNovaLista, setShowNovaLista] = useState(false);
  const [showEAP, setShowEAP] = useState(false);
  const [editandoMaterialId, setEditandoMaterialId] = useState<number | null>(null);
  
  const [novaLista, setNovaLista] = useState({
    codigo: "",
    nome: "",
    materiais: [] as Material[]
  });

  const [novoMaterial, setNovoMaterial] = useState({
    descricao: "",
    quantidade: "",
    unidade: ""
  });

  const [materialEditado, setMaterialEditado] = useState<Material | null>(null);

  // Notifica mudanças nos materiais
  useEffect(() => {
    if (onMateriaisData) {
      onMateriaisData(materiaisAtual);
    }
  }, [materiaisAtual, onMateriaisData]);

  // Quando seleciona uma lista, carrega seus materiais
  const handleSelecionarLista = (codigo: string) => {
    setListaAtual(codigo);
    const lista = listasSalvas.find(l => l.codigo === codigo);
    if (lista) {
      setMateriaisAtual([...lista.materiais]);
    }
  };

  // Adicionar material à lista atual
  const adicionarMaterialAtual = () => {
    if (novoMaterial.descricao && novoMaterial.quantidade && novoMaterial.unidade) {
      setMateriaisAtual([
        ...materiaisAtual,
        {
          id: Date.now(),
          ...novoMaterial
        }
      ]);
      setNovoMaterial({ descricao: "", quantidade: "", unidade: "" });
    }
  };

  // Remover material da lista atual
  const removerMaterialAtual = (id: number) => {
    setMateriaisAtual(materiaisAtual.filter(m => m.id !== id));
  };

  // Iniciar edição de material
  const iniciarEdicao = (material: Material) => {
    setEditandoMaterialId(material.id);
    setMaterialEditado({ ...material });
  };

  // Salvar edição de material
  const salvarEdicao = () => {
    if (materialEditado && editandoMaterialId) {
      setMateriaisAtual(materiaisAtual.map(m => 
        m.id === editandoMaterialId ? materialEditado : m
      ));
      setEditandoMaterialId(null);
      setMaterialEditado(null);
    }
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoMaterialId(null);
    setMaterialEditado(null);
  };

  // Adicionar material da nova lista
  const adicionarMaterial = () => {
    if (novoMaterial.descricao && novoMaterial.quantidade && novoMaterial.unidade) {
      setNovaLista({
        ...novaLista,
        materiais: [
          ...novaLista.materiais,
          {
            id: Date.now(),
            ...novoMaterial
          }
        ]
      });
      setNovoMaterial({ descricao: "", quantidade: "", unidade: "" });
    }
  };

  const removerMaterial = (id: number) => {
    setNovaLista({
      ...novaLista,
      materiais: novaLista.materiais.filter(m => m.id !== id)
    });
  };

  const salvarNovaLista = () => {
    // Aqui salvaria a nova lista
    setShowNovaLista(false);
    setNovaLista({ codigo: "", nome: "", materiais: [] });
  };

  // Mock de itens da EAP
  const itensEAP = [
    { codigo: "EAP-101", descricao: "Concreto estrutural", quantidade: "15", unidade: "m³" },
    { codigo: "EAP-102", descricao: "Forma metálica", quantidade: "200", unidade: "m²" },
    { codigo: "EAP-103", descricao: "Armação de aço", quantidade: "1500", unidade: "kg" },
  ];

  // Adicionar item da EAP diretamente à lista atual
  const utilizarItemEAP = (item: typeof itensEAP[0]) => {
    setMateriaisAtual([
      ...materiaisAtual,
      {
        id: Date.now(),
        descricao: item.descricao,
        quantidade: item.quantidade,
        unidade: item.unidade
      }
    ]);
    setShowEAP(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Selecionar Lista de Materiais</Label>
        <div className="flex gap-2">
          <Select value={listaAtual} onValueChange={handleSelecionarLista}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma lista existente" />
            </SelectTrigger>
            <SelectContent>
              {listasSalvas.map((lista) => (
                <SelectItem key={lista.codigo} value={lista.codigo}>
                  {lista.codigo} - {lista.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowNovaLista(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Lista
          </Button>
        </div>
      </div>

      {listaAtual && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium mb-3">Materiais da Lista Selecionada</h3>
          
          {/* Formulário para adicionar novo material */}
          <div className="grid grid-cols-12 gap-2 mb-4 pb-4 border-b">
            <div className="col-span-5">
              <Input
                placeholder="Descrição"
                value={novoMaterial.descricao}
                onChange={(e) => setNovoMaterial({ ...novoMaterial, descricao: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Qtd"
                value={novoMaterial.quantidade}
                onChange={(e) => setNovoMaterial({ ...novoMaterial, quantidade: e.target.value })}
              />
            </div>
            <div className="col-span-3">
              <Select 
                value={novoMaterial.unidade} 
                onValueChange={(value) => setNovoMaterial({ ...novoMaterial, unidade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m³">m³</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="un">un</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Button onClick={adicionarMaterialAtual} className="w-full">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materiaisAtual.map((material) => (
                <TableRow key={material.id}>
                  {editandoMaterialId === material.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={materialEditado?.descricao || ""}
                          onChange={(e) => setMaterialEditado({ ...materialEditado!, descricao: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={materialEditado?.quantidade || ""}
                          onChange={(e) => setMaterialEditado({ ...materialEditado!, quantidade: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={materialEditado?.unidade || ""}
                          onValueChange={(value) => setMaterialEditado({ ...materialEditado!, unidade: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="m³">m³</SelectItem>
                            <SelectItem value="m²">m²</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="un">un</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={salvarEdicao}>
                            Salvar
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelarEdicao}>
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{material.descricao}</TableCell>
                      <TableCell>{material.quantidade}</TableCell>
                      <TableCell>{material.unidade}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => iniciarEdicao(material)}
                          >
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerMaterialAtual(material.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div>
        <Button
          variant="outline"
          onClick={() => setShowEAP(true)}
          className="w-full"
          disabled={!listaAtual}
        >
          <Eye className="w-4 h-4 mr-2" />
          Consultar EAP
        </Button>
      </div>

      {/* Dialog Nova Lista */}
      <Dialog open={showNovaLista} onOpenChange={setShowNovaLista}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Lista de Materiais</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código</Label>
                <Input
                  placeholder="Ex: LM-002"
                  value={novaLista.codigo}
                  onChange={(e) => setNovaLista({ ...novaLista, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nome da Lista</Label>
                <Input
                  placeholder="Ex: Lista de Alvenaria"
                  value={novaLista.nome}
                  onChange={(e) => setNovaLista({ ...novaLista, nome: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Adicionar Materiais</h3>
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-6">
                  <Input
                    placeholder="Descrição"
                    value={novoMaterial.descricao}
                    onChange={(e) => setNovoMaterial({ ...novoMaterial, descricao: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Qtd"
                    value={novoMaterial.quantidade}
                    onChange={(e) => setNovoMaterial({ ...novoMaterial, quantidade: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Select 
                    value={novoMaterial.unidade} 
                    onValueChange={(value) => setNovoMaterial({ ...novoMaterial, unidade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m³">m³</SelectItem>
                      <SelectItem value="m²">m²</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="un">un</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button onClick={adicionarMaterial} className="w-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {novaLista.materiais.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {novaLista.materiais.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.descricao}</TableCell>
                        <TableCell>{material.quantidade}</TableCell>
                        <TableCell>{material.unidade}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerMaterial(material.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNovaLista(false)}>
                Cancelar
              </Button>
              <Button
                onClick={salvarNovaLista}
                disabled={!novaLista.codigo || !novaLista.nome || novaLista.materiais.length === 0}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Salvar Lista
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Consultar EAP */}
      <Dialog open={showEAP} onOpenChange={setShowEAP}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Itens da EAP - {pacoteMacrofluxo}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Itens cadastrados na Estrutura Analítica do Projeto (EAP) vinculados a este pacote:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensEAP.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell className="font-medium">{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => utilizarItemEAP(item)}
                        className="hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 text-green-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}