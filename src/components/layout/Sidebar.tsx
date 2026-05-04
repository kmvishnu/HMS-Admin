import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/hotels', label: 'Hotels', icon: Building2 },
  { path: '/owners', label: 'Owners', icon: Users },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-[var(--color-border)] glass flex flex-col hidden md:flex h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold text-gradient">Admin UI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive 
                  ? 'bg-[var(--gradient-card-hover)] text-[var(--color-primary)] shadow-[var(--shadow-soft)]' 
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
