import React, { useState } from "react";
import { getUsers } from "../lib/store";
import { Layers, User, ShieldCheck } from "lucide-react";

export function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"guru" | "admin">("guru");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const users = await getUsers();
      
      const foundUser = users.find(u => u.username === username && u.password === password && u.role === loginType);
      
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError(`${loginType === 'admin' ? 'Username' : 'NIP'} atau Password salah.`);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem saat login.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
           <Layers className="w-12 h-12" />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          RekapNilaiPro
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sistem Otomatisasi Perekapan Nilai Ujian
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => { setLoginType("guru"); setError(""); setUsername(""); setPassword(""); }}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${loginType === "guru" ? "bg-white shadow-sm text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              <User className="w-4 h-4" />
              Guru
            </button>
            <button
              onClick={() => { setLoginType("admin"); setError(""); setUsername(""); setPassword(""); }}
              className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${loginType === "admin" ? "bg-white shadow-sm text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {loginType === "admin" ? "Username" : "NIP"}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`Masukkan ${loginType === "admin" ? "Username" : "NIP"}`}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Masuk sebagai {loginType === "admin" ? "Admin" : "Guru"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
