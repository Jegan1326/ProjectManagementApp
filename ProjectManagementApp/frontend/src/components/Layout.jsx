import { Mail, HelpCircle, LogOut, Sun, Bell, Globe, RefreshCcw } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ children, currentView, onNavigate, user, onLogout }) => {
    return (
        <div className="flex h-screen bg-background text-white overflow-hidden">
            <Sidebar currentView={currentView} onNavigate={onNavigate} user={user} />
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('Overview')}>Dashboards</span>
                        <span>/</span>
                        <span className="text-white">{currentView}</span>
                    </div>
                    <div className="flex items-center gap-6 text-muted">
                        <div className="flex items-center gap-4 border-r border-border pr-6">
                            <button className="hover:text-primary transition-colors"><Sun size={18} /></button>
                            <button className="hover:text-primary transition-colors"><RefreshCcw size={18} /></button>
                            <button className="hover:text-primary transition-colors relative">
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                            </button>
                            <button className="hover:text-primary transition-colors"><Globe size={18} /></button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                                <p className="text-[10px] text-muted mt-1 uppercase font-black tracking-tighter">{user?.role}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-red-500/50 hover:text-red-500 transition-all group"
                                title="Logout"
                            >
                                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
            <aside className="w-72 border-l border-border bg-sidebar hidden xl:block p-6 overflow-y-auto">
                <div className="space-y-8">
                    <div>
                        <h3 className="font-semibold mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {[
                                { label: '56 New users registered.', time: 'Just now', icon: '👤' },
                                { label: '132 Orders placed.', time: '59 Minutes ago', icon: '📦' },
                                { label: 'Funds have been withdrawn.', time: '12 Hours ago', icon: '💰' },
                                { label: '5 Unread messages.', time: 'Today, 11:59 PM', icon: '✉️' },
                            ].map((n, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border">{n.icon}</div>
                                    <div>
                                        <p className="text-white/90">{n.label}</p>
                                        <p className="text-[10px] text-muted">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Activities</h3>
                        <div className="space-y-4 border-l border-border ml-2 pl-4">
                            {[
                                { label: 'Changed the style.', time: 'Just now' },
                                { label: '177 New products added.', time: '47 Minutes ago' },
                                { label: '11 Products have been archived.', time: '3 Days ago' },
                            ].map((a, i) => (
                                <div key={i} className="relative py-1">
                                    <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-primary shadow-neon"></div>
                                    <p className="text-sm text-white/90">{a.label}</p>
                                    <p className="text-[10px] text-muted">{a.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 flex justify-between items-center">
                            Contacts of your managers
                            <span className="text-muted">...</span>
                        </h3>
                        <div className="space-y-1">
                            {['Daniel Craig', 'Kate Morrison', 'Nataniel Donovan', 'Elisabeth Wayne'].map((contact, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 p-2 rounded-xl transition-all ${contact === 'Nataniel Donovan' ? 'bg-primary text-black shadow-neon' : 'hover:bg-card text-muted hover:text-white'}`}
                                >
                                    <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                                    <span className="text-xs font-medium flex-1">{contact}</span>
                                    {contact === 'Nataniel Donovan' && (
                                        <div className="flex gap-2 text-black">
                                            <Mail size={12} />
                                            <HelpCircle size={12} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Layout;
