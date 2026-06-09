import { useState, useEffect } from "react";
import { ProcessedDocument } from "../../types";
import { getStoredDocuments, deleteDocument } from "../../lib/store";
import { exportToExcel } from "../../lib/excel";
import { Search, Download, FileText, Calendar, History } from "lucide-react";

export function RiwayatKonversi() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [filterMapel, setFilterMapel] = useState("");
  const [filterKelas, setFilterKelas] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await getStoredDocuments();
    setDocuments(docs);
  };

  const handleDownload = (doc: ProcessedDocument) => {
    const exportData = doc.data.map(d => ({
      "Nomor Peserta": d.nomorPeserta,
      "Nama Siswa": d.nama,
      "Kelas": d.kelas,
      "Nilai": d.nilai,
      "Status": d.status
    }));
    exportToExcel(exportData, `Rekap_Nilai_${doc.mapelName}_${doc.kelas}`);
  };

  // Allow deleting document from history
  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      await loadDocuments();
    } catch (e) {
      alert("Gagal menghapus dokumen dari database");
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchMapel = doc.mapelName.toLowerCase().includes(filterMapel.toLowerCase());
    const matchKelas = doc.kelas.toLowerCase().includes(filterKelas.toLowerCase());
    return matchMapel && matchKelas;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Konversi Nilai</h2>
          <p className="text-slate-500 mt-1 text-sm">Lihat atau hapus dokumen rekap nilai yang telah diproses.</p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <History className="w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Mata Pelajaran..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filterMapel}
            onChange={e => setFilterMapel(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64 relative">
          <input
            type="text"
            placeholder="Filter Kelas (misal: 8A)"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
             <History className="w-12 h-12 mx-auto text-slate-300 mb-4" />
             <p>Belum ada riwayat konversi nilai.</p>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {doc.kelas}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{doc.mapelName}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(doc.uploadedAt).toLocaleString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">{doc.totalStudents}</span> Siswa · <span className="text-red-500 font-medium">{doc.missingScores}</span> Absen
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex gap-2">
                 <button
                   onClick={() => handleDownload(doc)}
                   className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                 >
                   <Download className="w-4 h-4" />
                   Unduh
                 </button>
                 {confirmDeleteId === doc.id ? (
                   <button
                     onClick={() => {
                        handleDelete(doc.id);
                        setConfirmDeleteId(null);
                     }}
                     className="px-4 py-2 bg-red-600 border border-red-700 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                   >
                     Yakin?
                   </button>
                 ) : (
                   <button
                     onClick={() => setConfirmDeleteId(doc.id)}
                     className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                     title="Hapus"
                   >
                     Hapus
                   </button>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
