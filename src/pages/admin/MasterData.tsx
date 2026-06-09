import { useState, useEffect } from "react";
import { Student } from "../../types";
import { getStoredStudents, saveStudents } from "../../lib/store";
import { Users, FileDown } from "lucide-react";

export function MasterData() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getStoredStudents().then(setStudents);
  }, []);

  const handleAddMockData = async () => {
    const mock: Student[] = [
      { id: "1", nomorPeserta: "P-001", nama: "Anisa Fitri", kelas: "8A" },
      { id: "2", nomorPeserta: "P-002", nama: "Budi Santoso", kelas: "8A" },
      { id: "3", nomorPeserta: "P-003", nama: "Citra Kirana", kelas: "8A" },
      { id: "4", nomorPeserta: "P-004", nama: "Deni Sumargo", kelas: "8B" },
      { id: "5", nomorPeserta: "P-005", nama: "Eka Wardani", kelas: "8B" },
    ];
    try {
      await saveStudents(mock);
      const updated = await getStoredStudents();
      setStudents(updated);
    } catch (e) {
      alert("Gagal menyimpan data contoh ke database");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Master Data Siswa</h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola data peserta ujian dan kelas.</p>
        </div>
        <button
          onClick={handleAddMockData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Load Data Contoh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p>Belum ada data siswa.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No. Peserta</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700">{s.nomorPeserta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{s.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{s.kelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
