import React from 'react';
import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    ShoppingCart,
    BarChart3,
    Users,
    Mail,
    Star,
    Settings,
    HelpCircle,
    Search,
    Command,
    Clock,
    Trash2,
    AlertCircle,
    FileText,
    Folder
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Sidebar = ({ currentView, onNavigate, user }) => {
    // Get initials for avatar
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

    const allMenuItems = [
        { id: 'Overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { id: 'Projects', icon: <Folder size={20} />, label: 'Projects' },
        { id: 'Reports', icon: <BarChart3 size={20} />, label: 'Reports' },
        { id: 'Tasks', icon: <ShoppingCart size={20} />, label: 'Tasks' },
        { id: 'Milestones', icon: <BarChart3 size={20} />, label: 'Milestones' },
        { id: 'Discussions', icon: <MessageSquare size={20} />, label: 'Team Chat' },
        { id: 'Timesheets', icon: <Clock size={20} />, label: 'Timesheets' },
        { id: 'Issues', icon: <AlertCircle size={20} />, label: 'Issues' },
        { id: 'Documents', icon: <FileText size={20} />, label: 'Documents' },
        { id: 'Customers', icon: <Users size={20} />, label: 'Customers' },
    ];

    const menuItems = React.useMemo(() => {
        if (!user) return [];
        switch (user.role) {
            case 'Client':
                return allMenuItems.filter(item => ['Overview', 'Documents', 'Discussions'].includes(item.id));
            case 'Team Member':
                // Team Members focus on execution: Tasks, Timesheets, Chat, Docs. No Reports/Customers.
                return allMenuItems.filter(item => ['Overview', 'Projects', 'Tasks', 'Timesheets', 'Discussions', 'Documents', 'Issues'].includes(item.id));
            case 'Project Manager':
                // Managers see everything except maybe Customers (unless needed)
                return allMenuItems.filter(item => item.id !== 'Customers');
            default: // Admins
                return allMenuItems;
        }
    }, [user]);

    const settingItems = React.useMemo(() => {
        if (!user) return [];
        // Start with base items
        const base = [
            { id: 'Messages', icon: <Mail size={20} />, label: 'Messages' },
            { id: 'Trash', icon: <Trash2 size={20} />, label: 'Trash Bin' },
            { id: 'Help', icon: <HelpCircle size={20} />, label: 'Help Centre' },
        ];

        // Only Admins get 'Settings'
        if (['Super Admin', 'Project Admin'].includes(user.role)) {
            base.splice(2, 0, { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' });
        }

        return base;
    }, [user]);

    return (
        <div className="w-64 bg-sidebar h-screen border-r border-border p-6 flex flex-col gap-8">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-black shadow-neon">
                    <span className="font-black text-sm">{initials}</span>
                </div>
                <div className="min-w-0">
                    <h2 className="font-bold text-sm truncate">{user?.name}</h2>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-tight truncate">{user?.role}</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-card/50 border border-border rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-muted border border-border px-1.5 py-0.5 rounded-md">
                    <Command size={10} />
                    <span>K</span>
                </div>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto">
                <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4 px-2">Dashboards</p>
                    <div className="flex flex-col gap-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors w-full rounded-xl ${currentView === item.id ? 'sidebar-item-active' : 'text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4 px-2">Settings</p>
                    <div className="flex flex-col gap-1">
                        {settingItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors w-full rounded-xl ${currentView === item.id ? 'sidebar-item-active' : 'text-muted hover:text-white hover:bg-white/5'}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between px-2 pb-4">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full border-2 border-sidebar bg-primary/20"></div>
                        <div className="w-5 h-5 rounded-full border-2 border-sidebar bg-primary/40"></div>
                        <div className="w-5 h-5 rounded-full border-2 border-sidebar bg-primary/60"></div>
                    </div>
                    <span className="text-xs font-bold tracking-tight">DWISON</span>
                </div>
                <NotificationDropdown />
            </div>
        </div>
    );
};

export default Sidebar;
