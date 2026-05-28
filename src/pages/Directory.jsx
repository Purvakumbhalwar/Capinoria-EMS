import React, { useState, useEffect } from "react"
import { Search, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { AppLayout } from "../components/layout/AppLayout"
import { Card, CardContent } from "../components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { Badge } from "../components/ui/Badge"
import { apiFetch } from "../lib/api"

export function Directory() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('capinoria_user') || 'null');
  const isManager = loggedInUser && (loggedInUser.roleLevel === 'Manager' || loggedInUser.roleLevel === 'Administrator');

  const handleToggleBlock = async (id) => {
    try {
      const res = await apiFetch(`/api/employees/${id}/block`, {
        method: 'PUT'
      });
      if (res.ok) {
        const updatedEmp = await res.json();
        setEmployees(employees.map(emp => (emp._id === id || emp.id === id) ? updatedEmp : emp));
      }
    } catch (err) {
      console.error('Failed to toggle block status:', err);
    }
  };

  const departments = ['All Departments', ...new Set(employees.map(e => e.department).filter(Boolean))];
  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDepartment === 'All Departments' || emp.department === selectedDepartment;
    if (!matchesDept) return false;
    
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (emp.name && emp.name.toLowerCase().includes(query)) ||
      (emp.role && emp.role.toLowerCase().includes(query)) ||
      (emp.department && emp.department.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    apiFetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      })
      .catch(err => console.error('Failed to fetch employees:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout title="Employee Directory">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, or department..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center col-span-full py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-12">No employees found in this department.</div>
            ) : filteredEmployees.map((employee) => (
              <Card key={employee._id || employee.id} className="group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 ring-4 ring-slate-50">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-slate-900">{employee.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium mb-1">{employee.role}</p>
                    <Badge variant={employee.status === 'Active' ? 'emerald' : 'amber'} className="mt-2 mb-4">
                      {employee.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500">
                      <Mail className="mr-3 h-4 w-4 text-slate-400" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Phone className="mr-3 h-4 w-4 text-slate-400" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="mr-3 h-4 w-4 text-slate-400" />
                      {employee.location}
                    </div>
                  </div>
                  
                  {isManager && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={() => handleToggleBlock(employee._id || employee.id)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                          employee.status === 'Blocked' 
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {employee.status === 'Blocked' ? 'Unblock Account' : 'Block Account'}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
