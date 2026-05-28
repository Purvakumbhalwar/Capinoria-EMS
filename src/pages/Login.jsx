import React, { useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { UserPlus, LogIn, ArrowRight, Shield, User } from "lucide-react"

export function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleLevel, setRoleLevel] = useState('Employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const bodyData = isSignup 
        ? { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password: password.trim(), roleLevel }
        : { email: email.trim(), password: password.trim() };
        
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (isSignup ? 'Registration failed' : 'Login failed'));
      
      const userData = isSignup ? data.user : data;
      localStorage.setItem('capinoria_user', JSON.stringify(userData));
      
      window.location.hash = "#dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md px-6 z-10">
        <div className="mb-10 text-center flex flex-col items-center">
          <img 
            src="/PNG-01.png" 
            alt="Capinoria Logo" 
            className="h-10 object-contain mx-auto"
          />
        </div>

        <Card className="shadow-xl shadow-slate-200/50 border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
                {isSignup ? 'Create an account' : 'Welcome back'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isSignup ? 'Enter your details to register.' : 'Sign in to access your dashboard.'}
              </p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">{error}</div>}
              
              {isSignup && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700" htmlFor="firstName">First Name</label>
                      <input 
                        id="firstName"
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John" 
                        required={isSignup}
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700" htmlFor="lastName">Last Name</label>
                      <input 
                        id="lastName"
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe" 
                        required={isSignup}
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="roleLevel">Account Type</label>
                    <select 
                      id="roleLevel"
                      value={roleLevel}
                      onChange={(e) => setRoleLevel(e.target.value)}
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                    >
                      <option value="Employee">Sales Employee</option>
                      <option value="Manager">HR / Manager</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Work Email</label>
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@capinoria.in" 
                  required
                  className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                  {!isSignup && (
                    <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-emerald-600 font-medium text-white shadow-sm hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 flex items-center justify-center gap-2 transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                   <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                ) : isSignup ? (
                  <>
                    <UserPlus className="w-4.5 h-4.5" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5 group"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {!isSignup && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 text-center mb-3 uppercase tracking-wider">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      setEmail('hr@capinoria.in');
                      setPassword('hr123');
                    }}
                    className="flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    HR Login
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      setEmail('employee@capinoria.in');
                      setPassword('emp123');
                    }}
                    className="flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-600" />
                    Employee
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Secured by Capinoria Enterprise
        </p>
      </div>
    </div>
  )
}
