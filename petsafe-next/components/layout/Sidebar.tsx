// components/layout/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  clinicName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ clinicName }) => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-center mb-4">
          <i className="fas fa-paw text-4xl text-indigo-400"></i>
        </div>
        <h2 className="text-xl font-bold text-center">PetSafe QR</h2>
        <p className="text-sm text-gray-400 text-center mt-1">{clinicName}</p>
      </div>
      
      <nav className="mt-4">
        <Link href="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>
          <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
        </Link>
        
        <Link href="/pets" className={`sidebar-link ${isActive('/pets')}`}>
          <i className="fas fa-paw mr-2"></i> Animais
        </Link>
        
        <Link href="/appointments" className={`sidebar-link ${isActive('/appointments')}`}>
          <i className="fas fa-calendar-alt mr-2"></i> Agendamentos
        </Link>
        
        <Link href="/lost-pets" className={`sidebar-link ${isActive('/lost-pets')}`}>
          <i className="fas fa-search mr-2"></i> Animais Perdidos
        </Link>
        
        <Link href="/reports" className={`sidebar-link ${isActive('/reports')}`}>
          <i className="fas fa-chart-bar mr-2"></i> Relatórios
        </Link>
        
        <Link href="/profile" className={`sidebar-link ${isActive('/profile')}`}>
          <i className="fas fa-user mr-2"></i> Perfil
        </Link>
        
        <Link href="/settings" className={`sidebar-link ${isActive('/settings')}`}>
          <i className="fas fa-cog mr-2"></i> Configurações
        </Link>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="sidebar-link w-full text-left"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Sair
        </button>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-500">
        <p>PetSafe QR &copy; 2025</p>
        <p>Versão 1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
