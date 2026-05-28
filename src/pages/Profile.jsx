import React, { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Building, Shield, LogOut, Camera, Key, BellRing, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { AppLayout } from "../components/layout/AppLayout"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import { apiFetch } from "../lib/api"

export function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const saved = localStorage.getItem('capinoria_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setFormData(parsed);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiFetch(`/api/auth/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setFormData(updatedUser);
        localStorage.setItem('capinoria_user', JSON.stringify(updatedUser));
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    }
    setIsSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (!user) return (
    <AppLayout title="My Profile">
      <div className="flex justify-center items-center h-64 text-slate-500">
        Please log in to view profile.
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title="My Profile">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Left Column: Profile Snapshot */}
        <div className="md:col-span-1 lg:col-span-1 space-y-6">
          <Card className="relative overflow-hidden group border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback className="text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{user.firstName} {user.lastName}</h2>
              <p className="text-sm font-medium text-emerald-600 mb-4">{user.department} {user.roleLevel}</p>
              
              <div className="w-full space-y-3 mt-2 text-left">
                <div className="flex text-sm text-slate-600">
                  <Mail className="mr-3 h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="break-all">{user.email}</span>
                </div>
                <div className="flex text-sm text-slate-600">
                  <Phone className="mr-3 h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="break-words">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex text-sm text-slate-600">
                  <MapPin className="mr-3 h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <span className="break-words">Mumbai Office</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
               <button 
                 className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 text-sm text-rose-600 transition-colors"
                 onClick={() => {
                   if (window.confirm("Are you sure you want to sign out?")) {
                     localStorage.removeItem('capinoria_user');
                     window.location.hash = '#login';
                   }
                 }}
               >
                 <span className="flex items-center"><LogOut className="mr-3 h-4 w-4 text-rose-400"/> Sign Out</span>
               </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData?.firstName || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Department</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="department"
                      value={formData?.department || ''}
                      onChange={handleChange}
                      className="w-full pl-9 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Role Level</label>
                   <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="roleLevel"
                      value={formData?.roleLevel || ''}
                      onChange={handleChange}
                      className="w-full pl-9 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Employee ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="employeeId"
                      value={formData?.employeeId || ''}
                      onChange={handleChange}
                      className="w-full pl-9 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Profile Photo URL</label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="url"
                      name="avatar"
                      value={formData?.avatar || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/your-photo.jpg"
                      className="w-full pl-9 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {message.text}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </AppLayout>
  )
}
