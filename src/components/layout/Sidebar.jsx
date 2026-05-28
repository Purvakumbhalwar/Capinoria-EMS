import React from "react"
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  PhoneCall,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  User,
  ShieldCheck,
  Briefcase
} from "lucide-react"
import { cn } from "../../lib/utils"

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, role = "admin" }) {
  const getNavItems = () => {
    if (role === "Employee") {
      return [
        { name: "My Dashboard", icon: LayoutDashboard, href: "#employee-dashboard" },
        { name: "Staff Directory", icon: Users, href: "#directory" },
        { name: "My Leads", icon: PhoneCall, href: "#employee-leads" },
        { name: "My Leaves", icon: ShieldCheck, href: "#employee-leaves" },
        { name: "My Profile", icon: User, href: "#profile" },
      ]
    }

    const items = [
      { name: "Wealth Dashboard", icon: LayoutDashboard, href: "#dashboard" },
      { name: "Staff Directory", icon: Users, href: "#directory" },
      { name: "Sales Pipeline", icon: PhoneCall, href: "#tracker" },
      { name: "My Profile", icon: User, href: "#profile" },
      { name: "HR Management", icon: ShieldCheck, href: "#hrmanagement" },
      { name: "Assets Management", icon: Briefcase, href: "#hr-assets" }
    ]
    return items
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white/90 backdrop-blur-xl transition-all duration-300 lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={isCollapsed && !isMobileOpen ? "/PNG-02.png" : "/PNG-01.png"} 
              alt="Capinoria Logo" 
              className={cn("transition-all duration-300", isCollapsed && !isMobileOpen ? "h-8 w-8 object-contain" : "h-7 object-contain")}
            />
          </div>
          
          {/* Desktop Collapse Toggle */}
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:block rounded-lg p-1.5 text-slate-400 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          {isCollapsed && !isMobileOpen && (
            <div className="mb-4 hidden lg:flex justify-center">
               <button 
                onClick={() => setIsCollapsed(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          
          <nav className="space-y-1">
            {getNavItems().map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600",
                  item.href === window.location.hash && "bg-emerald-50 text-emerald-600"
                )}
              >
                <item.icon size={20} className={cn("shrink-0", (isCollapsed && !isMobileOpen) ? "mx-auto" : "mr-3")} />
                {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-100 p-4">
          <a
            href="#logout"
            className={cn(
              "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600",
              (isCollapsed && !isMobileOpen) && "justify-center"
            )}
          >
            <LogOut size={20} className={cn("shrink-0", (isCollapsed && !isMobileOpen) ? "mx-auto" : "mr-3")} />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </a>
        </div>
      </aside>
    </>
  )
}
