import React, { useState, useEffect } from "react"
import { MoreHorizontal, Plus, Loader2 } from "lucide-react"
import { AppLayout } from "../components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table"
import { Badge } from "../components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"


const getStatusColor = (status) => {
  switch (status) {
    case "Hot Lead": return "rose"
    case "Follow Up": return "amber"
    case "Closed": return "emerald"
    case "Cold": return "slate"
    default: return "default"
  }
}

export function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ client: '', contact: '', amount: '', status: 'Cold', employee: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/leads').then(res => res.json()),
      fetch('http://localhost:5000/api/employees').then(res => res.json())
    ])
    .then(([leadsData, employeesData]) => {
      if (Array.isArray(leadsData)) setTasks(leadsData);
      if (Array.isArray(employeesData)) setEmployees(employeesData);
    })
    .catch(err => console.error('Failed to fetch data:', err))
    .finally(() => setLoading(false));
  }, []);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const activeEmployees = employees.filter(emp => emp.status !== 'Blocked');
      const defaultEmployee = activeEmployees.length > 0 ? activeEmployees[0]._id : null;

      const res = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           ...newLead, 
           date: new Date(),
           employee: newLead.employee || defaultEmployee
        })
      });
      const data = await res.json();
      setTasks([data, ...tasks]);
      setIsModalOpen(false);
      setNewLead({ client: '', contact: '', amount: '', status: 'Cold', employee: '' });
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <AppLayout title="Marketing Task Tracker">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Call Logging & Leads</h2>
            <p className="text-sm text-slate-500 mt-1">Manage marketing outreach and track conversion status.</p>
          </div>
          <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
          >
            <Plus size={16} />
            New Lead
          </button>
        </div>

        {isModalOpen && (
          <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-emerald-800">Register New Lead</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleCreateLead} className="grid sm:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
                 <div className="xl:col-span-1">
                   <label className="text-xs font-semibold text-slate-700">Client Company</label>
                   <input required value={newLead.client} onChange={e => setNewLead({...newLead, client: e.target.value})} className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white transition-all" placeholder="e.g. Acme Corp" />
                 </div>
                 <div className="xl:col-span-1">
                   <label className="text-xs font-semibold text-slate-700">Contact Person</label>
                   <input required value={newLead.contact} onChange={e => setNewLead({...newLead, contact: e.target.value})} className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white transition-all" placeholder="e.g. John Doe" />
                 </div>
                 <div className="xl:col-span-1">
                   <label className="text-xs font-semibold text-slate-700">Est. Value (₹)</label>
                   <input required type="number" value={newLead.amount} onChange={e => setNewLead({...newLead, amount: e.target.value})} className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white transition-all" placeholder="500000" />
                 </div>
                 <div className="xl:col-span-1">
                   <label className="text-xs font-semibold text-slate-700">Initial Status</label>
                   <select value={newLead.status} onChange={e => setNewLead({...newLead, status: e.target.value})} className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white transition-all">
                     <option value="Hot Lead">Hot Lead</option>
                     <option value="Follow Up">Follow Up</option>
                     <option value="Cold">Cold</option>
                   </select>
                 </div>
                 <div className="xl:col-span-1">
                   <label className="text-xs font-semibold text-slate-700">Assign To</label>
                   <select required value={newLead.employee} onChange={e => setNewLead({...newLead, employee: e.target.value})} className="mt-1.5 w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white transition-all">
                     <option value="" disabled>Select Employee</option>
                     {employees.filter(emp => emp.status !== 'Blocked').map(emp => (
                       <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
                     ))}
                   </select>
                 </div>
                 <div className="xl:col-span-1 flex gap-2">
                   <button type="submit" className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg flex-1 transition-colors">Save</button>
                   <button type="button" onClick={() => setIsModalOpen(false)} className="h-10 px-4 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                 </div>
               </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              A total of 42 active leads this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Handler</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                       <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : tasks.map((task) => (
                  <TableRow key={task._id || task.id} className="group">
                    <TableCell className="font-medium text-slate-600">
                      {task._id ? task._id.substring(0, 7) : task.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{task.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarFallback className="text-[10px]">
                             {task.contact.split(' ').map(n => n[0]).join('')}
                           </AvatarFallback>
                        </Avatar>
                        <span className="text-slate-600">{task.contact}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.employee ? (
                         <div className="flex items-center gap-2">
                           <Avatar className="h-6 w-6">
                             <AvatarImage src={task.employee.avatar} />
                             <AvatarFallback className="text-[10px]">
                               {task.employee.name ? task.employee.name.split(' ').map(n => n[0]).join('') : '?'}
                             </AvatarFallback>
                           </Avatar>
                           <span className="text-sm font-medium text-slate-700">{task.employee.name}</span>
                         </div>
                      ) : (
                         <span className="text-slate-400 italic text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {task.date ? new Date(task.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">{task.amount}</TableCell>
                    <TableCell>
                      <button className="rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
