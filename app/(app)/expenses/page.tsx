'use client';

import { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calendar } from 'lucide-react';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadExpenses();
    }, []);

    async function loadExpenses() {
        const data = await getExpenses();
        setExpenses(data);
    }

    async function handleSubmit(formData: FormData) {
        await createExpense(formData);
        setIsOpen(false);
        loadExpenses();
    }

    async function handleDelete(id: string) {
        if (confirm('Tem certeza que deseja excluir esta despesa?')) {
            await deleteExpense(id);
            loadExpenses();
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Despesas</h1>
                    <p className="text-sm text-muted-foreground mt-1">Controle seus gastos e saídas financeiras.</p>
                </div>
                <Button variant="default" className="gap-2 px-6" onClick={() => setIsOpen(true)}>
                    <Plus className="h-4 w-4" /> Nova Despesa
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Nova Despesa</DialogTitle>
                    </DialogHeader>
                    <form action={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                            <Input id="description" name="description" placeholder="Ex: Licença de Software" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="amount" className="text-sm font-medium">Valor (R$)</label>
                                <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="category" className="text-sm font-medium">Categoria</label>
                                <Input id="category" name="category" placeholder="Ex: Marketing" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="date" className="text-sm font-medium">Data</label>
                            <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">Salvar Despesa</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Table Card */}
            <Card className="border border-border shadow-sm rounded-[var(--radius)]">
                <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold pb-3 border-b border-border">Registro de Despesas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted">
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Descrição</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Categoria</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Data</TableHead>
                                <TableHead className="font-semibold text-center px-3 py-2 border-r border-border">Valor</TableHead>
                                <TableHead className="w-[48px] px-3 py-2" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Nenhuma despesa registrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expenses.map((expense) => (
                                    <TableRow key={expense.id} className="hover:bg-muted/40 align-middle">
                                        <TableCell className="px-3 py-2 font-medium text-center border-r border-border align-middle">{expense.description}</TableCell>
                                        <TableCell className="px-3 py-2 text-center border-r border-border align-middle">
                                            <Badge variant="secondary" className="mx-auto">{expense.category}</Badge>
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-center text-sm text-muted-foreground border-r border-border align-middle">
                                            <div className="inline-flex items-center justify-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(expense.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 py-2 text-center font-semibold text-destructive border-r border-border align-middle">
                                            − {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 text-center align-middle">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive mx-auto">
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
