import React, { useState, useEffect } from "react"
import { Users, FileText, CheckCircle2, AlertCircle, TrendingUp, CalendarDays, MoreHorizontal, Check, X } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { AppLayout } from "../components/layout/AppLayout"

export function Dashboard() {
  const [topEmployees, setTopEmployees] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Fetch Top Employees
    fetch('http://localhost:5000/api/leads/performance/top-employees')
      .then(res => res.json())
      .then(data => setTopEmployees(data))
      .catch(console.error);

    // Fetch Top Clients
    fetch('http://localhost:5000/api/leads/performance/top-clients')
      .then(res => res.json())
      .then(data => setTopClients(data))
      .catch(console.error);

    // Fetch Leaves
    fetch('http://localhost:5000/api/leaves')
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(console.error);
  }, []);

  const handleLeaveStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedLeave = await res.json();
      setLeaves(leaves.map(l => l._id === id ? updatedLeave : l));
    } catch(err) {
      console.error(err);
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const approvedLeavesCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedLeavesCount = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <AppLayout title="Wealth Management Analytics">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Top Performing Employees Chart */}
          <Card className="min-h-[400px] flex flex-col lg:col-span-4 shadow-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Top Performing Employees</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 pb-6">
              <div className="h-[300px] w-full mt-4 pr-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topEmployees} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                    <YAxis dataKey="employeeDetails.name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} width={100} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(val) => `₹${val.toLocaleString()}`} />
                    <Bar dataKey="totalRevenue" radius={[0, 4, 4, 0]}>
                      {topEmployees.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#6366f1"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Biggest Clients Leaderboard */}
          <Card className="min-h-[400px] max-h-[400px] flex flex-col lg:col-span-3 shadow-sm border-slate-200/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Biggest Clients</CardTitle>
              <TrendingUp className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent className="flex-1 mb-2 mt-4 space-y-4 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200">
              {topClients.map((client, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 font-bold text-sm shadow-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{client._id}</h4>
                      <p className="text-xs text-slate-500">{client.activeDeals} Active Deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-1">
                      ₹{client.totalVolume.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Leave Overview */}
        <div className="grid gap-4 md:grid-cols-3 pt-2">
          <Card className="shadow-sm border-slate-200/60 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-600 mb-1">Approved Leaves</p>
                <h3 className="text-3xl font-bold text-emerald-700">{approvedLeavesCount}</h3>
              </div>
              <CheckCircle2 className="h-10 w-10 text-emerald-400 opacity-80" />
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200/60 bg-rose-50/50 hover:bg-rose-50 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-600 mb-1">Rejected Leaves</p>
                <h3 className="text-3xl font-bold text-rose-700">{rejectedLeavesCount}</h3>
              </div>
              <AlertCircle className="h-10 w-10 text-rose-400 opacity-80" />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/60 bg-amber-50/50 hover:bg-amber-50 transition-colors">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 mb-1">Pending Leaves</p>
                <h3 className="text-3xl font-bold text-amber-700">{pendingLeaves.length}</h3>
              </div>
              <CalendarDays className="h-10 w-10 text-amber-400 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Pending Leave Applications */}
        <div className="grid gap-6 md:grid-cols-1">
          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Leave Applications ({pendingLeaves.length})</CardTitle>
              <CalendarDays className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {pendingLeaves.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">No pending leave applications.</div>
                ) : (
                  pendingLeaves.map(leave => (
                    <div key={leave._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={leave.employee?.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{leave.employee?.name}</h4>
                          <p className="text-xs text-slate-500">Reason: <span className="font-medium">{leave.reason}</span></p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            From {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleLeaveStatus(leave._id, 'Approved')}
                          className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button 
                          onClick={() => handleLeaveStatus(leave._id, 'Rejected')}
                          className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Decisions (Processed Leaves) */}
        <div className="grid gap-6 md:grid-cols-1">
          <Card className="shadow-sm border-slate-200/60 bg-slate-50/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Leave Decisions</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {leaves.filter(l => l.status !== 'Pending').length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">No recent leave decisions.</div>
                ) : (
                  leaves.filter(l => l.status !== 'Pending').map(leave => (
                    <div key={leave._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={leave.employee?.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm opacity-90" />
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="text-sm font-semibold text-slate-800">{leave.employee?.name}</h4>
                             <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                               {leave.status}
                             </span>
                          </div>
                          <p className="text-xs text-slate-500">Reason: <span className="font-medium">{leave.reason}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${leave.status === 'Approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {leave.status === 'Approved' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                           <span className="hidden sm:inline">Processed</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </AppLayout>
  )
}
