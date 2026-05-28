import React, { useState, useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Briefcase, Edit2, Save, X, Search } from "lucide-react";
import { apiFetch } from "../lib/api"

export function HRAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', type: '', currentValue: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAssets = async () => {
    try {
      const res = await apiFetch('/api/assets');
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEditClick = (asset) => {
    setEditingId(asset._id);
    setEditForm({
      name: asset.name,
      type: asset.type,
      currentValue: asset.currentValue,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', type: '', currentValue: '' });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await apiFetch(`/api/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          type: editForm.type,
          currentValue: Number(editForm.currentValue)
        })
      });
      if (res.ok) {
        setEditingId(null);
        fetchAssets();
      } else {
        alert('Failed to update asset');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating asset');
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="Assets Registry">
      <Card className="border-slate-200/60 shadow-sm max-w-5xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" />
            Asset Details
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading assets...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Current Value (₹)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                        No assets found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map(asset => (
                      <tr key={asset._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          {editingId === asset._id ? (
                            <input 
                              type="text" 
                              value={editForm.name} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="w-full h-8 px-2 rounded border border-indigo-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                          ) : (
                            <span className="font-medium text-slate-700">{asset.name}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === asset._id ? (
                            <select 
                              value={editForm.type} 
                              onChange={e => setEditForm({...editForm, type: e.target.value})}
                              className="w-full h-8 px-2 rounded border border-indigo-300 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                            >
                              <option>Mutual Fund</option>
                              <option>Listed Share</option>
                              <option>Unlisted Share</option>
                            </select>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              {asset.type}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === asset._id ? (
                            <input 
                              type="number" 
                              value={editForm.currentValue} 
                              onChange={e => setEditForm({...editForm, currentValue: e.target.value})}
                              className="w-full h-8 px-2 rounded border border-indigo-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                          ) : (
                            <span className="text-slate-600">₹{asset.currentValue?.toLocaleString('en-IN') || 0}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {editingId === asset._id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleSaveEdit(asset._id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleEditClick(asset)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit Asset"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
