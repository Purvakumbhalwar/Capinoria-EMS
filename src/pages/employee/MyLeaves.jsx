import React, { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import { Badge } from "../../components/ui/Badge"
import { Loader2, Plus } from "lucide-react"
import { apiFetch } from "../../lib/api"

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'emerald'
    case 'Pending': return 'amber'
    case 'Rejected': return 'rose'
    default: return 'slate'
  }
}

export function MyLeaves() {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    const saved = localStorage.getItem('capinoria_user');
    if (!saved) return;
    const parsed = JSON.parse(saved);
    setUser(parsed);

    apiFetch(`/api/leaves/employee/${parsed._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeaves(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      const res = await apiFetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newLeave, 
          employee: user._id,
          status: 'Pending'
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to apply for leave');
      }
      
      setLeaves([data, ...leaves]);
      setNewLeave({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
    } catch(err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <AppLayout title="My Leaves">
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Leave Management</h2>
          <p className="text-sm text-slate-500 mt-1">Apply for time off and check your request history.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Apply for Leave</CardTitle>
                <CardDescription>Submit a new leave request to HR.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Leave Type</label>
                    <select required value={newLeave.type} onChange={e => setNewLeave({...newLeave, type: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-all">
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Earned Leave">Earned Leave</option>
                      <option value="Maternity/Paternity">Maternity/Paternity</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Start Date</label>
                       <input type="date" required value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">End Date</label>
                       <input type="date" required value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-all" />
                     </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Reason</label>
                    <textarea required value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} className="w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-all resize-none" placeholder="Briefly explain the reason for your leave..."></textarea>
                  </div>
                  <button type="submit" disabled={isApplying} className="w-full flex items-center justify-center h-10 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                    {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Submit Application
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Request History</CardTitle>
                <CardDescription>Track the status of your past leave requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Requested On</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                           <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : leaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                          You haven't requested any leaves yet.
                        </TableCell>
                      </TableRow>
                    ) : leaves.map((leave) => (
                      <TableRow key={leave._id}>
                        <TableCell className="font-semibold text-slate-900">{leave.type}</TableCell>
                        <TableCell className="text-slate-600 font-medium">
                           {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                           {new Date(leave.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm max-w-[200px] truncate" title={leave.reason}>
                           {leave.reason}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusColor(leave.status)}>
                            {leave.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
