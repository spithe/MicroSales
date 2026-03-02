'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { ShoppingBag, Clock, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
];

const funnelData = [
    { name: 'Novos', value: 45 },
    { name: 'Contato', value: 30 },
    { name: 'Proposta', value: 20 },
    { name: 'Fechado', value: 12 },
];

const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const stats = [
    {
        title: 'Quanto você vendeu hoje',
        value: 'R$ 1.240',
        change: '+8.2%',
        positive: true,
        icon: ShoppingBag,
        tooltip: 'Total de vendas realizadas no dia de hoje. Atualizado automaticamente com cada novo pedido registrado.',
    },
    {
        title: 'Pedidos aguardando atendimento',
        value: '8',
        change: '+3 novos',
        positive: true,
        icon: Clock,
        tooltip: 'Pedidos que ainda não foram concluídos ou entregues. Quanto menor, melhor o seu atendimento.',
    },
    {
        title: 'Quanto você ganhou no mês',
        value: 'R$ 12.450',
        change: '+20.1%',
        positive: true,
        icon: TrendingUp,
        tooltip: 'Valor total recebido no mês atual. Representa a soma de todas as vendas concretizadas no período.',
    },
    {
        title: 'Quanto você gastou no mês',
        value: 'R$ 4.820',
        change: '-5.4%',
        positive: false,
        icon: TrendingDown,
        tooltip: 'Total de despesas registradas no mês. Inclui todos os gastos lançados na aba de Despesas.',
    },
];

function InfoTooltip({ text }: { text: string }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative inline-flex">
            <button
                className="h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
                onClick={() => setVisible(!visible)}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                type="button"
                aria-label="Mais informações"
            >
                <Info className="h-3 w-3" />
            </button>
            {visible && (
                <div className="absolute z-50 left-7 top-0 w-56 bg-white dark:bg-slate-900 text-foreground text-xs rounded-[var(--radius)] border border-border shadow-md p-3 leading-relaxed">
                    {text}
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Início</h1>
                <p className="text-sm text-muted-foreground mt-1">Resumo das suas vendas.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Card className="bg-card border border-border shadow-sm rounded-[var(--radius)]">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground leading-tight">
                                        {stat.title}
                                    </CardTitle>
                                    <InfoTooltip text={stat.tooltip} />
                                </div>
                                <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className={`text-xs mt-1 font-medium ${stat.positive ? 'text-primary' : 'text-destructive'}`}>
                                    {stat.change} em relação ao mês passado
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {/* Revenue Chart */}
                <Card className="col-span-4 bg-card border border-border shadow-sm rounded-[var(--radius)]">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">Evolução das suas vendas</CardTitle>
                        <p className="text-sm text-muted-foreground">Últimos 7 meses</p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', fontSize: 12 }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Funnel Chart — pie left, legend right */}
                <Card className="col-span-3 bg-card border border-border shadow-sm rounded-[var(--radius)]">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">Etapas dos seus pedidos</CardTitle>
                        <p className="text-sm text-muted-foreground">Como seus pedidos estão distribuídos</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex w-full items-center gap-6 py-2">
                            {/* Left: Pie centered in its half */}
                            <div className="w-1/2 flex justify-center items-center">
                                <div style={{ width: 160, height: 160 }}>
                                    <ResponsiveContainer width={160} height={160}>
                                        <PieChart width={160} height={160}>
                                            <Pie data={funnelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                                                {funnelData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', fontSize: 12 }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            {/* Right: Legend centered in its half */}
                            <div className="w-1/2 flex flex-col justify-center gap-4 h-full text-sm">
                                {funnelData.map((item, index) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[index] }} />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.value} pedidos</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
