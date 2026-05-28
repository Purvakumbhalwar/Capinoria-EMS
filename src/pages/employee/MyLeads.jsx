import React, { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import { Badge } from "../../components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar"
import { Loader2 } from "lucide-react"

const getStatusColor = (status) => {
  switch (status) {
    case "Hot Lead": return "rose"
    case "Follow Up": return "amber"
    case "Closed": return "emerald"
    case "Cold": return "slate"
    default: return "default"
  }
}

export function MyLeads() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('capinoria_user');
    if (!saved) return;
    const user = JSON.parse(saved);

    fetch(`http://localhost:5000/api/leads/employee/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedLead = await res.json();
        setTasks(prev => prev.map(t => t._id === taskId ? updatedLead : t));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
    setUpdatingId(null);
  };

  return (
    <AppLayout title="My Leads">
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">My Leads</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your assigned leads and track your pipeline.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Currently Assigned Leads</CardTitle>
            <CardDescription>
              You have {tasks.length} active leads assigned to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Update Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                       <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No leads assigned yet.
                    </TableCell>
                  </TableRow>
                ) : tasks.map((task) => (
                  <TableRow key={task._id} className="group">
                    <TableCell className="font-medium text-slate-600">
                      {task._id.substring(0, 7)}
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
                      <div className="flex items-center gap-2">
                        <select 
                          value={task.status}
                          disabled={updatingId === task._id}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="h-8 rounded-md border border-slate-200 text-xs px-2 focus:border-emerald-500 focus:outline-none transition-all disabled:opacity-50"
                        >
                          <option value="Cold">Cold</option>
                          <option value="Follow Up">Follow Up</option>
                          <option value="Hot Lead">Hot Lead</option>
                          <option value="Closed">Closed</option>
                        </select>
                        {updatingId === task._id && <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {task.date ? new Date(task.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">₹{task.amount}</TableCell>
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
