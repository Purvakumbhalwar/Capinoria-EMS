import React, { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { cn } from "../../lib/utils"

export function AppLayout({ children, title, role }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userRole, setUserRole] = useState(role || "Manager")

  React.useEffect(() => {
    if (!role) {
      try {
        const saved = localStorage.getItem('capinoria_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed._id === 'dummy-emp-id' || parsed._id === 'dummy-hr-id') {
            localStorage.removeItem('capinoria_user');
            window.location.hash = '#login';
            window.location.reload();
            return;
          }
          setUserRole(parsed.roleLevel === 'Employee' ? 'Employee' : 'Manager');
        }
      } catch (err) {}
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        role={userRole} 
      />
      
      <div 
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <Header title={title} onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-10">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
