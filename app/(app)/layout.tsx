import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, LayoutDashboard, Users, Receipt, Settings as SettingsIcon } from 'lucide-react'; // Renamed Settings to SettingsIcon to avoid conflict if needed, or just remove if not used in sidebar anymore. 
// Actually I removed Settings from sidebar imports mostly.
import { SettingsDropdown } from '@/components/settings-dropdown';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar - Desktop */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:flex flex-col z-50">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 font-bold text-xl">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/micro-ui-logo.png"
                            alt="Micro-UI Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-[#a824e8] tracking-tight">
                        Micro-UI
                    </span>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius)] bg-sidebar-accent text-sidebar-accent-foreground font-medium text-sm transition-colors">
                            <LayoutDashboard className="size-4" />
                            Início
                        </Link>
                        <Link href="/leads" className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius)] text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium">
                            <Users className="size-4" />
                            Pedidos
                        </Link>
                        <Link href="/expenses" className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius)] text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium">
                            <Receipt className="size-4" />
                            Despesas
                        </Link>
                    </div>

                </nav>

                <div className="p-4 border-t border-sidebar-border">
                    <div className="flex items-center gap-3 px-2">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "size-8 ring-1 ring-sidebar-border"
                                }
                            }}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-sidebar-foreground">Sua Conta</span>
                            <span className="text-xs text-muted-foreground">Gerenciar</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8 relative">
                {/* Top Right Settings Icon */}
                <div className="absolute top-4 right-8 z-10">
                    <SettingsDropdown />
                </div>
                {children}
            </main>
        </div>
    );
}
