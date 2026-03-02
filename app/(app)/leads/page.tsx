'use client';

import { useEffect, useState } from 'react';
import { getLeads, createLead, deleteLead } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Phone, Mail, Building } from 'lucide-react';

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadLeads();
    }, []);

    async function loadLeads() {
        const data = await getLeads();
        setLeads(data);
    }

    async function handleSubmit(formData: FormData) {
        await createLead(formData);
        setIsOpen(false);
        loadLeads();
    }

    async function handleDelete(id: string) {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            await deleteLead(id);
            loadLeads();
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Pedidos &amp; Vendas</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gerencie seus contatos e negociações.</p>
                </div>
                <Button variant="default" className="gap-2 px-6" onClick={() => setIsOpen(true)}>
                    <Plus className="h-4 w-4" /> Novo Pedido
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Novo Pedido</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome</label>
                            <Input id="name" name="name" placeholder="Ex: João da Silva" required />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="company" className="text-sm font-medium">Empresa</label>
                            <Input id="company" name="company" placeholder="Ex: Acme Corp" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input id="email" name="email" type="email" placeholder="joao@acme.com" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                                <Input id="phone" name="phone" placeholder="(11) 99999-9999" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="value" className="text-sm font-medium">Valor Estimado (R$)</label>
                                <Input id="value" name="estimatedValue" type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="status" className="text-sm font-medium">Status</label>
                                <Input id="status" name="status" placeholder="Ex: Novo" defaultValue="Novo" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">Salvar</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Table Card */}
            <Card className="border border-border shadow-sm rounded-[var(--radius)]">
                <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold pb-3 border-b border-border">Lista de Pedidos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted">
                                <TableHead className="w-[180px] font-semibold text-center px-3 py-2 border-r border-border">Nome</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Empresa</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Contato</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Status</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Valor</TableHead>
                                <TableHead className="w-[48px] px-3 py-2" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Nenhum pedido encontrado. Crie o primeiro!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <TableRow key={lead.id} className="hover:bg-muted/40 align-middle">
                                        <TableCell className="px-3 py-2 font-medium text-center border-r border-border align-middle">{lead.name}</TableCell>
                                        <TableCell className="px-3 py-2 text-center border-r border-border align-middle">
                                            {lead.company ? (
                                                <div className="inline-flex items-center justify-center gap-1.5 text-muted-foreground">
                                                    <Building className="h-3 w-3" />
                                                    <span className="text-sm">{lead.company}</span>
                                                </div>
                                            ) : <span className="text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-center border-r border-border align-middle">
                                            <div className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground">
                                                {lead.email && (
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {lead.email}
                                                    </div>
                                                )}
                                                {lead.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {lead.phone}
                                                    </div>
                                                )}
                                                {!lead.email && !lead.phone && <span>—</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-center border-r border-border align-middle">
                                            <Badge variant="secondary" className="mx-auto">{lead.status}</Badge>
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-center font-semibold text-foreground border-r border-border align-middle">
                                            {lead.estimatedValue
                                                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.estimatedValue)
                                                : <span className="text-muted-foreground font-normal">—</span>}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 text-center align-middle">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive mx-auto">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
