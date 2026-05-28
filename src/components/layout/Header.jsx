import React, { useState, useEffect } from "react"
import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"

export function Header({ title = "Dashboard", onMenuClick }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('capinoria_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/50 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-slate-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">

        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors hidden sm:block">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500"></span>
        </button>
        
        <div className="flex items-center gap-3 sm:border-l border-slate-200 sm:pl-6">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-slate-900">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
            <p className="text-xs text-slate-500">{user ? user.roleLevel : 'Welcome'}</p>
          </div>
          <a href="#profile" className="cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback>{user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}</AvatarFallback>
            </Avatar>
          </a>
        </div>
      </div>
    </header>
  )
}
