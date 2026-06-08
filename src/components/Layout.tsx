import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { LogOut, User, FileText, Database, Layers, Users } from "lucide-react";

export function Layout({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            RekapNilai<span className="text-indigo-400">Pro</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Sistem Pengolah Nilai Ujian</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Database className="w-5 h-5" />
                Pemrosesan Nilai
              </button>
              <button
                onClick={() => navigate("/riwayat")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <FileText className="w-5 h-5" />
                Riwayat Konversi
              </button>
              <button
                onClick={() => navigate("/master")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <FileText className="w-5 h-5" />
                Master Data Siswa
              </button>
              <button
                onClick={() => navigate("/guru")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Users className="w-5 h-5" />
                Manajemen Guru
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <FileText className="w-5 h-5" />
              Download Laporan
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-medium text-slate-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
