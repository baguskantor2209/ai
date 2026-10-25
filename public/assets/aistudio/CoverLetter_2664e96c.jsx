import React from 'react';

export default function CoverLetter({ letterData }) {
  // Lampiran bawaan jika pengguna belum memberikan daftar berkasnya
  const defaultLampiran = [
    "Daftar Riwayat Hidup (CV)",
    "Fotocopy Ijazah dan Transkrip Nilai",
    "Fotocopy Kartu Tanda Penduduk (KTP)",
    "Pas Foto Terbaru 4x6",
    "Fotocopy Surat Keterangan Catatan Kepolisian (SKCK)"
  ];

  const lampiranList = letterData.lampiran && letterData.lampiran.length > 0 
    ? letterData.lampiran 
    : defaultLampiran;

  return (
    <div className="w-full min-h-full bg-white text-black p-12 font-serif text-sm leading-relaxed">
      {/* Tempat, Tanggal Surat */}
      <div className="text-right font-bold mb-6">
        {letterData.tanggalSurat || "Kota, 01 Januari 2026"}
      </div>

      <div className="mb-6">
        <p>Perihal : Lamaran Pekerjaan</p>
      </div>

      {/* Tujuan Perusahaan */}
      <div className="mb-6">
        <p>Kepada Yth.</p>
        <p className="font-bold">HRD {letterData.namaPerusahaan || "PT Nama Perusahaan"}</p>
        <p>{letterData.alamatPerusahaan || "Jl. Alamat Perusahaan No. 123"}</p>
      </div>

      <div className="mb-4">
        <p>Dengan hormat,</p>
      </div>

      {/* Paragraf Pembuka */}
      <div className="mb-4 text-justify">
        <p>
          Berdasarkan informasi yang saya peroleh bahwa{' '}
          <span className="font-bold">{letterData.namaPerusahaan || "PT Nama Perusahaan"}</span> sedang membuka lowongan pekerjaan sebagai{' '}
          <span className="font-bold">{letterData.posisiDilamar || "Posisi Pekerjaan"}</span>. Maka dengan surat ini saya mengajukan permohonan untuk dapat mengisi lowongan pekerjaan tersebut.
        </p>
      </div>

      <div className="mb-2">
        <p>Berikut ini data diri saya :</p>
      </div>

      {/* Data Diri */}
      <div className="ml-6 mb-6 space-y-1 font-sans text-xs">
        <div className="flex"><span className="w-36 shrink-0">Nama</span><span>: {letterData.nama || "Nama Lengkap"}</span></div>
        <div className="flex"><span className="w-36 shrink-0">Tempat, Tanggal Lahir</span><span>: {letterData.ttl || "Kota, 01 Januari 2000"}</span></div>
        <div className="flex"><span className="w-36 shrink-0">Jenis Kelamin</span><span>: {letterData.jenisKelamin || "Laki-laki / Perempuan"}</span></div>
        <div className="flex"><span className="w-36 shrink-0">Alamat</span><span>: {letterData.alamat || "Alamat Lengkap"}</span></div>
        <div className="flex"><span className="w-36 shrink-0">Nomor Telp/ Hp</span><span>: {letterData.phone || "08123456789"}</span></div>
        <div className="flex"><span className="w-36 shrink-0">Email</span><span>: {letterData.email || "email@anda.com"}</span></div>
        <div className="flex"><span className="w-36 shrink-0">Pendidikan Terakhir</span><span>: {letterData.pendidikanTerakhir || "S1 / SMA"}</span></div>
      </div>

      {/* Daftar Lampiran Berkas Pendukung Dinamis */}
      <div className="mb-6">
        <p className="mb-2">Sebagai bahan pertimbangan Bapak/Ibu, saya juga melampirkan :</p>
        <ul className="list-disc ml-8 space-y-1 text-xs font-sans">
          {lampiranList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Penutup */}
      <div className="mb-10 text-justify">
        <p>
          Demikian surat lamaran kerja ini saya buat, saya sangat berharap dapat bergabung dengan perusahaan yang Anda pimpin. Saya sampaikan terima kasih, atas perhatian dan kesempatan yang diberikan Bapak/Ibu.
        </p>
      </div>

      {/* Tanda Tangan */}
      <div className="flex flex-col items-end">
        <div className="text-center">
          <p>Hormat saya,</p>
          <div className="h-16"></div>
          <p className="font-bold underline">{letterData.nama || "Nama Anda"}</p>
        </div>
      </div>
    </div>
  );
}