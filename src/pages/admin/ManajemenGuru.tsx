import React, { useState, useEffect } from "react";
import { User, UserRole } from "../../types";
import { getUsers, saveUser } from "../../lib/store";
import { UserPlus, Users, Trash2 } from "lucide-react";

export function ManajemenGuru() {
  const [gurus, setGurus] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<string[]>([]);
  const [mapel, setMapel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const KELAS_OPTIONS = ["7", "8", "9"];

  useEffect(() => {
    loadGurus();
  }, []);

  const loadGurus = async () => {
    try {
      const allUsers = await getUsers();
      setGurus(allUsers.filter((u) => u.role === "guru"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleKelas = (kelas: string) => {
    if (selectedKelas.includes(kelas)) {
      setSelectedKelas(selectedKelas.filter((k) => k !== kelas));
    } else {
      setSelectedKelas([...selectedKelas, kelas]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip || !password || !name) {
      alert("NIP, Password, dan Nama harus diisi.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: nip, // using NIP as login username
      password,
      name,
      role: "guru",
      kelas: selectedKelas,
      mapel: mapel.split(",").map((m) => m.trim()).filter((m) => m !== ""),
    };

    try {
      setIsSaving(true);
      console.log("Submitting user: ", newUser);
      await saveUser(newUser);
      console.log("Save complete, reloading gurus");
      await loadGurus();
      
      // Reset form
      setName("");
      setNip("");
      setPassword("");
      setSelectedKelas([]);
      setMapel("");
      setShowForm(false);
    } catch (e: any) {
      console.error("Form submit error", e);
      alert("Gagal menyimpan pengguna ke database: " + (e.message || JSON.stringify(e)));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Guru</h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola akun dan akses Guru Mata Pelajaran.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {showForm ? "Batal Tambah" : (
            <>
              <UserPlus className="w-4 h-4" /> Tambah Guru
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
             <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Form Tambah Guru</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Pd"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">NIP (User Login)</label>
                  <input
                    type="text"
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Masukkan NIP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={mapel}
                    onChange={(e) => setMapel(e.target.value)}
                    placeholder="Pisahkan dengan koma (Contoh: IPA, Fisika)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mengajar Kelas (Bisa lebih dari 1)</label>
                <div className="flex gap-4">
                  {KELAS_OPTIONS.map((kelas) => (
                    <label key={kelas} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedKelas.includes(kelas)}
                        onChange={() => handleToggleKelas(kelas)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Kelas {kelas}</span>
                    </label>
                  ))}
                </div>
             </div>

             <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Data Guru"}
                </button>
             </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {gurus.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p>Belum ada data guru terdaftar.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">NIP / Login</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mapel</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {gurus.map((guru) => (
                <tr key={guru.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700">{guru.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{guru.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {guru.kelas?.length ? guru.kelas.map(k => `Kelas ${k}`).join(", ") : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {guru.mapel?.length ? guru.mapel.join(", ") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
