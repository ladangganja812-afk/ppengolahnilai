import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { parseExcelTemplate } from "../../lib/excel";
import { ProcessedDocument, ProcessedRecord } from "../../types";
import { saveDocument } from "../../lib/store";

export function ProcessGrades({ user }: { user: any }) {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [scoresFile, setScoresFile] = useState<File | null>(null);
  const [mapel, setMapel] = useState("");
  const [kelas, setKelas] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedDocument | null>(null);
  const [error, setError] = useState("");

  const handleProcess = async () => {
    if (!templateFile || !scoresFile || !mapel || !kelas) {
      setError("Mohon lengkapi semua form dan unggah dokumen.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const templateData = await parseExcelTemplate(templateFile);
      const scoresData = await parseExcelTemplate(scoresFile);

      // Normalizing the keys to lowercase with no spaces/special chars for matching
      const normalizeKey = (k: string) => k.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

      const findKey = (row: any, isScoreField: boolean, ...possibleKeys: string[]) => {
        const keys = Object.keys(row);
        
        // 1. Exact match first
        for (const pk of possibleKeys) {
          const match = keys.find(k => normalizeKey(k) === normalizeKey(pk));
          if (match) return match;
        }

        // 2. If looking for a score field, use startsWith to prevent false positives from question texts like "Berapa nilai..."
        if (isScoreField) {
           const scoreKeywords = ["skor", "score", "nilai", "total", "hasil", "points", "poin"];
           for (const keyword of scoreKeywords) {
             const match = keys.find(k => normalizeKey(k).startsWith(keyword));
             if (match) return match;
           }
           return null; // Avoid generic includes for score to avoid question headers
        }

        // 3. Fallback to includes for non-score fields like name or student ID
        for (const pk of possibleKeys) {
          const match = keys.find(k => normalizeKey(k).includes(normalizeKey(pk)));
          if (match) return match;
        }
        return null;
      };

      const processedRecords: ProcessedRecord[] = templateData.map(tRow => {
        const noPesertaKey = findKey(tRow, false, "nomorpeserta", "nopeserta", "nomorujian", "nis", "nisn", "username", "nomor");
        const namaKey = findKey(tRow, false, "nama", "namasiswa", "namalengkap");
        const kelasKey = findKey(tRow, false, "kelas", "rombel", "ruangan", "kelompok");
        
        const noPeserta = noPesertaKey ? String(tRow[noPesertaKey]).trim() : "";
        const nama = namaKey ? tRow[namaKey] : "Unknown";
        const ekstrakKelas = kelasKey ? String(tRow[kelasKey]).trim() : kelas;

        // Find score
        const scoreRow = scoresData.find(sRow => {
          const sNoKey = findKey(sRow, false, "nomorpeserta", "nopeserta", "nomorujian", "nis", "nisn", "username", "nomor");
          return sNoKey && String(sRow[sNoKey]).trim() === noPeserta;
        });

        let extractedScore = null;
        if (scoreRow) {
           const sScoreKey = findKey(scoreRow, true, "skor", "score", "nilai", "totalskor", "totalscore", "points", "poin");
           if (sScoreKey) {
             let rawScore = String(scoreRow[sScoreKey]).trim();
             // Parse Google Forms format like "100 / 100" -> "100"
             if (rawScore.includes("/")) {
                rawScore = rawScore.split("/")[0].trim();
             }
             extractedScore = rawScore;
           }
        }

        return {
          nomorPeserta: noPeserta,
          nama: String(nama),
          kelas: ekstrakKelas,
          nilai: extractedScore,
          status: extractedScore !== null ? "Lengkap" : (noPeserta ? "Tidak Mengikuti Ujian" : "Data Tidak Ditemukan")
        } as ProcessedRecord;
      });

      const missing = processedRecords.filter(r => r.status === "Tidak Mengikuti Ujian").length;

      const newDoc: ProcessedDocument = {
        id: Date.now().toString(),
        mapelId: mapel.toLowerCase(),
        mapelName: mapel,
        kelas,
        uploadedAt: new Date().toISOString(),
        processedByAdminId: user.id,
        totalStudents: processedRecords.length,
        missingScores: missing,
        data: processedRecords
      };

      setResult(newDoc);
    } catch (err) {
      console.error(err);
      setError("Gagal memproses file. Pastikan format Excel (.xlsx) sesuai.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (result) {
      try {
        await saveDocument(result);
        setResult(null);
        setTemplateFile(null);
        setScoresFile(null);
        setMapel("");
        setKelas("");
        alert("Dokumen berhasil dipublikasikan ke Guru.");
      } catch (err) {
        alert("Gagal menyimpan dokumen ke database.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pemrosesan Nilai</h2>
        <p className="text-slate-500 mt-1 text-sm">Gabungkan data absensi dengan hasil ujian mentah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            Upload Dokumen
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
            <input 
              type="text" 
              placeholder="Contoh: Matematika" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
            <input 
              type="text" 
              placeholder="Contoh: 8A" 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Template Absen (Excel)</label>
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hasil Ujian Mentah (Excel)</label>
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => setScoresFile(e.target.files?.[0] || null)}
            />
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isProcessing ? "Memproses..." : "Proses Nilai"}
          </button>
        </div>

        {/* Results Panel */}
        {result ? (
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm space-y-4 ring-1 ring-indigo-50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Hasil Pemrosesan
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                <p className="text-3xl font-bold text-slate-800">{result.totalStudents}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Total Siswa</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                <p className="text-3xl font-bold text-red-600">{result.missingScores}</p>
                <p className="text-xs font-medium text-red-500 uppercase tracking-wider mt-1">Tidak Ujian</p>
              </div>
            </div>

            <div className="hidden md:block max-h-48 overflow-y-auto border border-slate-100 rounded-lg text-sm">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nama</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {result.data.slice(0, 10).map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 whitespace-nowrap text-slate-700">{r.nama}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {r.nilai !== null ? (
                           <span className="font-mono text-emerald-600">{r.nilai}</span>
                        ) : (
                           <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Alpha</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handlePublish}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Simpan & Publikasikan ke Guru
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center text-slate-500 min-h-[300px]">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-sm">Hasil pemrosesan akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
