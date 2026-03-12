import type { ComponentType } from 'react';
import {
  Building2,
  FileText,
  LayoutDashboard,
  UserPlus,
  Users,
} from 'lucide-react';

type NavItem = {
  title: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { title: 'Clients', to: '/clients', icon: Users },
  { title: 'Leads', to: '/leads', icon: UserPlus },
  { title: 'Properties', to: '/properties', icon: Building2 },
  { title: 'Applications', to: '/applications', icon: FileText },
];
