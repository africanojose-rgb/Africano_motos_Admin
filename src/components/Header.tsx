import React from 'react';
import { Wrench, Bell, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount: number;
}

export default function Header({ activeTab, setActiveTab, alertCount }: HeaderProps) {
  const navItems = [
    { id: 'panel', label: 'Panel' },
    { id: 'trabajos', label: 'Trabajos' },
    { id: 'finanzas', label: 'Finanzas' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'alertas', label: 'Alertas' },
  ];

  return (
    <header className="bg-surface-container border-b border-outline-variant/30 sticky top-0 z-50 h-16 flex justify-between items-center px-4 md:px-8 shadow-md">
      {/* Brand */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('panel')}>
        <Wrench className="text-primary-container h-6 w-6 stroke-[2.5]" />
        <h1 className="font-display font-extrabold text-xl md:text-2xl tracking-tighter text-primary-container">
          AFRICANO MOTO <span className="text-xs text-on-surface bg-surface-highest/50 px-1.5 py-0.5 rounded ml-1 font-mono uppercase tracking-normal">Pro</span>
        </h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-1 lg:gap-3 items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`font-mono text-xs uppercase px-3 py-1.5 rounded transition-all relative ${
                isActive
                  ? 'text-primary-container font-bold border-b-2 border-primary-container rounded-none'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/40'
              }`}
            >
              {item.label}
              {item.id === 'alertas' && alertCount > 0 && (
                <span className="ml-1.5 bg-primary-container text-white text-[10px] px-1 rounded-full">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile / Secondary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('alertas')}
          className="relative p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-high transition-colors"
          title="Alertas"
        >
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-container rounded-full border border-surface-dim animate-pulse" />
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-3">
          <div className="w-9 h-9 rounded-full bg-surface-high border border-outline/30 overflow-hidden flex items-center justify-center">
            <img
              alt="Mecánico de Africano Moto"
              className="object-cover w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVaTwnSvEDIhTlUN6UooYRv5HCeKJvf6zyWFCzyQyHKEqKmb29NhmhZGy493PGbl5g2HNLlCSgJZjfjQJW8C1qRj_lce2R5g20wM-e2jxeqg8ExYzkFNQuKuYhvfPD_tBFL1_EZ45rF2dC1x5nQyPxCHc4F2_4iWo8BGsnVyVMDHJrLO3n8TS30B6EX4mz-b7luuGkxmyj3EhD8rfBkvbNrRPTvmx-pH2ny7Tk-Q8UvKSGmxQouIKn-jdjzG9R9ezYYOLOGOxPWqA"
            />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-on-surface leading-none">Mecánico Africano</p>
            <p className="text-[10px] text-on-surface-variant/70 font-mono mt-0.5">ADMIN #01</p>
          </div>
        </div>
      </div>
    </header>
  );
}
