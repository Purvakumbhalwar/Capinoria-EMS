import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { UserPlus, Briefcase, Plus } from "lucide-react";
import { apiFetch } from "../lib/api"

export function HRManagement() {
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Mutual Fund');
  const [assetValue, setAssetValue] = useState('');

  const [empData, setEmpData] = useState({
    name: '', employeeId: '', role: '', department: '', email: '', phone: '', location: ''
  });

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empData)
      });
      alert('Employee Onboarded successfully!');
      setEmpData({ name: '', employeeId: '', role: '', department: '', email: '', phone: '', location: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to onboard employee');
    }
  };

  const handleAssetSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: assetName, type: assetType, currentValue: Number(assetValue) })
      });
      alert('Asset Added successfully!');
      setAssetName(''); setAssetValue('');
    } catch (err) {
      console.error(err);
      alert('Failed to add asset');
    }
  };

  return (
    <AppLayout title="HR & Asset Management">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-500" />
              Add Wealth Asset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Asset Name</label>
                <input required value={assetName} onChange={e=>setAssetName(e.target.value)} type="text" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g., Ultra Tech Growth Fund" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Asset Type</label>
                  <select value={assetType} onChange={e=>setAssetType(e.target.value)} className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-indigo-500 outline-none bg-white">
                    <option>Mutual Fund</option>
                    <option>Listed Share</option>
                    <option>Unlisted Share</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Valuation (₹)</label>
                  <input required value={assetValue} onChange={e=>setAssetValue(e.target.value)} type="number" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-indigo-500 outline-none" placeholder="1000000" />
                </div>
              </div>
              <button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" /> Register Asset
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-500" />
              Onboard Employee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmployeeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input required value={empData.name} onChange={e=>setEmpData({...empData, name: e.target.value})} type="text" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="e.g. Purva Kumbhalwar" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Employee ID</label>
                  <input required value={empData.employeeId} onChange={e=>setEmpData({...empData, employeeId: e.target.value})} type="text" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="e.g. CAP-042" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Role</label>
                  <input required value={empData.role} onChange={e=>setEmpData({...empData, role: e.target.value})} type="text" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="e.g. Wealth Manager" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Department</label>
                  <input required value={empData.department} onChange={e=>setEmpData({...empData, department: e.target.value})} type="text" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="e.g. Finance" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input required value={empData.email} onChange={e=>setEmpData({...empData, email: e.target.value})} type="email" className="w-full mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="email@capinoria.in" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Location & Phone</label>
                  <div className="flex gap-2">
                    <input required value={empData.location} onChange={e=>setEmpData({...empData, location: e.target.value})} type="text" className="w-1/2 mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="Mumbai" />
                    <input required value={empData.phone} onChange={e=>setEmpData({...empData, phone: e.target.value})} type="text" className="w-1/2 mt-1.5 h-11 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="+91..." />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2">
                <UserPlus className="w-4 h-4" /> Onboard Employee
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
