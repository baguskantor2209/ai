import React from 'react';
import { LetterData } from '../types';

interface CoverLetterProps {
  letterData: LetterData;
  language?: 'id' | 'en';
}

export default function CoverLetter({ letterData, language = 'id' }: CoverLetterProps) {
  const isEn = language === 'en';

  const defaultLampiranId = [
    'Daftar Riwayat Hidup (CV)',
    'Fotocopy Ijazah dan Transkrip Nilai Terakhir',
    'Fotocopy Kartu Tanda Penduduk (KTP)',
    'Pas Foto Terbaru 4x6',
    'Fotocopy Surat Keterangan Catatan Kepolisian (SKCK)',
    'Fotocopy Sertifikat Pelatihan / Keahlian Terkait',
  ];

  const defaultLampiranEn = [
    'Professional Curriculum Vitae (CV) / Resume',
    'Copies of Degree Certificate & Academic Transcripts',
    'Copy of Identity Card (KTP / Passport)',
    'Recent Color Photograph (4x6)',
    'Certificates of Relevant Professional Trainings & Achievements',
  ];

  const lampiranList =
    letterData.lampiran && letterData.lampiran.length > 0 && letterData.lampiran.some((l) => l.trim())
      ? letterData.lampiran.filter((l) => l.trim())
      : (isEn ? defaultLampiranEn : defaultLampiranId);

  // Helper for generating specific paragraph 2 in English
  const getEnglishParagraph = () => {
    if (letterData.paragrafKualifikasi && letterData.paragrafKualifikasi.trim()) {
      return letterData.paragrafKualifikasi;
    }
    const toolsPart = letterData.keahlianTools && letterData.keahlianTools.trim()
      ? `hands-on proficiency in ${letterData.keahlianTools}`
      : 'technical proficiency with industry-standard software tools and operational workflows';
    const achievementPart = letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim()
      ? `proven experience in ${letterData.pencapaianSpesifik}`
      : 'a proven track record of delivering measurable outcomes and meeting high performance standards';

    return `Throughout my academic and professional career, I have cultivated ${toolsPart}. Backed by ${achievementPart}, I possess the practical capability and dedicated work ethic required to create immediate impact for ${letterData.namaPerusahaan || 'your organization'}. I look forward to leveraging these skills to actively support the ongoing success and growth of the ${letterData.posisiDilamar || 'team'}.`;
  };

  // Helper for generating specific paragraph 2 in Indonesian
  const getIndonesianParagraph = () => {
    if (letterData.paragrafKualifikasi && letterData.paragrafKualifikasi.trim()) {
      return letterData.paragrafKualifikasi;
    }
    const toolsPart = letterData.keahlianTools && letterData.keahlianTools.trim()
      ? `penguasaan yang baik terhadap perangkat dan aplikasi ${letterData.keahlianTools}`
      : 'kemampuan mengoperasikan berbagai perangkat lunak serta aplikasi pendukung kerja';
    const achievementPart = letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim()
      ? `pengalaman nyata dalam ${letterData.pencapaianSpesifik}`
      : 'pengalaman kerja nyata dalam menyelesaikan tanggung jawab secara terukur, cermat, dan tepat waktu';

    return `Selama menempuh pendidikan dan pengalaman kerja sebelumnya, saya telah mengasah ${toolsPart}. Berbekal ${achievementPart}, saya terbiasa bekerja dengan standar profesional tinggi serta berorientasi pada hasil dan efisiensi. Saya meyakini kombinasi kompetensi teknis dan dedikasi ini dapat memberikan kontribusi nyata bagi pencapaian target ${letterData.namaPerusahaan || 'perusahaan'}.`;
  };

  if (isEn) {
    return (
      <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 font-serif text-sm leading-relaxed mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
        {/* Date and Location */}
        <div className="text-right font-medium mb-6">
          {letterData.tanggalSurat || 'October 22, 2026'}
        </div>

        <div className="mb-6 space-y-1">
          <p className="font-semibold">
            Subject: Job Application for{' '}
            <span className="font-bold underline">
              {letterData.posisiDilamar || 'Open Position'}
            </span>
          </p>
          <p className="text-xs text-gray-700">Enclosures: {lampiranList.length} Documents</p>
        </div>

        {/* Company Recipient */}
        <div className="mb-6">
          <p>To:</p>
          <p className="font-bold">Hiring Manager / Recruitment Team</p>
          <p className="font-bold text-slate-900">{letterData.namaPerusahaan || 'Target Company Name'}</p>
          <p>{letterData.alamatPerusahaan || 'Company Office Address'}</p>
        </div>

        <div className="mb-4">
          <p>Dear Hiring Manager,</p>
        </div>

        {/* Opening Paragraph */}
        <div className="mb-4 text-justify indent-8 leading-relaxed">
          <p>
            I am writing to express my strong interest in the{' '}
            <span className="font-bold">{letterData.posisiDilamar || 'Open Position'}</span> vacancy currently
            available at <span className="font-bold">{letterData.namaPerusahaan || 'your company'}</span>. With a solid
            professional background, dedicated work ethic, and passion for excellence, I am enthusiastic about the opportunity
            to contribute meaningfully to your team&apos;s goals and continuous growth.
          </p>
        </div>

        <div className="mb-2">
          <p>Here is a brief summary of my personal details:</p>
        </div>

        {/* Personal Details in English */}
        <div className="ml-6 mb-6 space-y-1.5 font-sans text-xs">
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Full Name</span>
            <span>: {letterData.nama || 'Full Name of Applicant'}</span>
          </div>
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Place, Date of Birth</span>
            <span>: {letterData.ttl || 'City, January 1, 2000'}</span>
          </div>
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Gender</span>
            <span>: {letterData.jenisKelamin === 'Perempuan' ? 'Female' : 'Male'}</span>
          </div>
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Residential Address</span>
            <span>: {letterData.alamat || 'Complete Residential Address'}</span>
          </div>
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Phone / WhatsApp</span>
            <span>: {letterData.phone || '+62 812-3456-7890'}</span>
          </div>
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Email Address</span>
            <span>: {letterData.email || 'applicant.email@domain.com'}</span>
          </div>
          <div className="flex">
            <span className="w-44 shrink-0 font-medium">Highest Education</span>
            <span>: {letterData.pendidikanTerakhir || "Bachelor's Degree (S1)"}</span>
          </div>
          {letterData.keahlianTools && letterData.keahlianTools.trim() && (
            <div className="flex">
              <span className="w-44 shrink-0 font-medium text-slate-800">Tools & Software</span>
              <span>: <strong className="font-semibold text-slate-900">{letterData.keahlianTools}</strong></span>
            </div>
          )}
          {letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim() && (
            <div className="flex">
              <span className="w-44 shrink-0 font-medium text-slate-800">Key Achievements</span>
              <span>: <strong className="font-semibold text-slate-900">{letterData.pencapaianSpesifik}</strong></span>
            </div>
          )}
        </div>

        {/* Body Paragraph: Specific Qualifications, Tools & Achievements */}
        <div className="mb-3 text-justify indent-8 leading-relaxed">
          <p>{getEnglishParagraph()}</p>
        </div>

        {/* Highlight Points: Core Competencies & Practical Achievements */}
        {((letterData.keahlianTools && letterData.keahlianTools.trim()) ||
          (letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim())) && (
          <div className="mb-4 ml-4 pl-3.5 border-l-2 border-slate-700 font-sans text-xs space-y-1 bg-slate-50/80 py-2 px-2.5 rounded-r print:bg-transparent print:p-0 print:border-slate-800">
            {letterData.keahlianTools && letterData.keahlianTools.trim() && (
              <p>
                <span className="font-bold text-slate-900">• Core Software & Tools:</span>{' '}
                <span className="text-slate-800">{letterData.keahlianTools}</span>
              </p>
            )}
            {letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim() && (
              <p>
                <span className="font-bold text-slate-900">• Demonstrated Impact & Achievements:</span>{' '}
                <span className="text-slate-800">{letterData.pencapaianSpesifik}</span>
              </p>
            )}
          </div>
        )}

        {/* Enclosures List in English */}
        <div className="mb-6">
          <p className="mb-2">As requested, I have enclosed the following supporting documents for your review:</p>
          <ol className="list-decimal ml-8 space-y-1 text-xs font-sans">
            {lampiranList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        {/* Closing Paragraph */}
        <div className="mb-8 text-justify indent-8 leading-relaxed">
          <p>
            Thank you very much for taking the time to consider my application. I would welcome the opportunity to discuss my
            qualifications and enthusiasm with you in an interview. I look forward to hearing from you at your earliest
            convenience.
          </p>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-end mr-6">
          <div className="text-center min-w-[200px]">
            <p>Sincerely,</p>
            <div className="h-20 flex items-center justify-center">
              {/* Space for physical/digital signature */}
            </div>
            <p className="font-bold underline uppercase">{letterData.nama || 'Applicant Name'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Bahasa Indonesia Version (Default)
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 font-serif text-sm leading-relaxed mx-auto print:shadow-none print:m-0 shadow-2xl relative box-border border border-gray-200">
      {/* Tempat, Tanggal Surat */}
      <div className="text-right font-medium mb-6">
        {letterData.tanggalSurat || 'Jakarta, 22 Oktober 2026'}
      </div>

      <div className="mb-6 space-y-1">
        <p>Hal : Lamaran Pekerjaan</p>
        <p>Lampiran : {lampiranList.length} Berkas</p>
      </div>

      {/* Tujuan Perusahaan */}
      <div className="mb-6">
        <p>Kepada Yth.</p>
        <p className="font-bold">HRD / Pimpinan Perusahaan</p>
        <p className="font-bold">{letterData.namaPerusahaan || 'PT Nama Perusahaan Tujuan'}</p>
        <p>{letterData.alamatPerusahaan || 'Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat'}</p>
      </div>

      <div className="mb-4">
        <p>Dengan hormat,</p>
      </div>

      {/* Paragraf Pembuka */}
      <div className="mb-4 text-justify indent-8">
        <p>
          Berdasarkan informasi lowongan pekerjaan yang saya peroleh bahwa{' '}
          <span className="font-bold">{letterData.namaPerusahaan || 'perusahaan yang Bapak/Ibu pimpin'}</span>{' '}
          saat ini sedang membuka kesempatan berkarir untuk posisi{' '}
          <span className="font-bold">{letterData.posisiDilamar || 'Posisi yang Dilamar'}</span>. Maka
          melalui surat ini saya bermaksud mengajukan diri untuk mengisi formasi posisi tersebut.
        </p>
      </div>

      <div className="mb-2">
        <p>Berikut ini adalah data singkat mengenai diri saya:</p>
      </div>

      {/* Data Diri */}
      <div className="ml-6 mb-6 space-y-1.5 font-sans text-xs">
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Nama Lengkap</span>
          <span>: {letterData.nama || 'Nama Lengkap Pelamar'}</span>
        </div>
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Tempat, Tanggal Lahir</span>
          <span>: {letterData.ttl || 'Jakarta, 15 Juli 2000'}</span>
        </div>
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Jenis Kelamin</span>
          <span>: {letterData.jenisKelamin || 'Laki-laki'}</span>
        </div>
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Alamat Lengkap</span>
          <span>: {letterData.alamat || 'Jl. Contoh Alamat No. 123, Kelurahan, Kecamatan, Kota'}</span>
        </div>
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Nomor Telp / WhatsApp</span>
          <span>: {letterData.phone || '0812-3456-7890'}</span>
        </div>
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Alamat Email</span>
          <span>: {letterData.email || 'email.pelamar@domain.com'}</span>
        </div>
        <div className="flex">
          <span className="w-40 shrink-0 font-medium">Pendidikan Terakhir</span>
          <span>: {letterData.pendidikanTerakhir || 'Sarjana (S1)'}</span>
        </div>
        {letterData.keahlianTools && letterData.keahlianTools.trim() && (
          <div className="flex">
            <span className="w-40 shrink-0 font-medium text-slate-800">Keahlian & Perangkat</span>
            <span>: <strong className="font-semibold text-slate-900">{letterData.keahlianTools}</strong></span>
          </div>
        )}
        {letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim() && (
          <div className="flex">
            <span className="w-40 shrink-0 font-medium text-slate-800">Pencapaian Utama</span>
            <span>: <strong className="font-semibold text-slate-900">{letterData.pencapaianSpesifik}</strong></span>
          </div>
        )}
      </div>

      {/* Paragraf Kualifikasi Spesifik (Alat, Pencapaian, Pengalaman Nyata) */}
      <div className="mb-3 text-justify indent-8 leading-relaxed">
        <p>{getIndonesianParagraph()}</p>
      </div>

      {/* Poin Spesifikasi Kompetensi & Bukti Prestasi Nyata */}
      {((letterData.keahlianTools && letterData.keahlianTools.trim()) ||
        (letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim())) && (
        <div className="mb-4 ml-4 pl-3.5 border-l-2 border-slate-700 font-sans text-xs space-y-1 bg-slate-50/80 py-2 px-2.5 rounded-r print:bg-transparent print:p-0 print:border-slate-800">
          {letterData.keahlianTools && letterData.keahlianTools.trim() && (
            <p>
              <span className="font-bold text-slate-900">• Penguasaan Alat & Software:</span>{' '}
              <span className="text-slate-800">{letterData.keahlianTools}</span>
            </p>
          )}
          {letterData.pencapaianSpesifik && letterData.pencapaianSpesifik.trim() && (
            <p>
              <span className="font-bold text-slate-900">• Bukti Pengalaman & Pencapaian:</span>{' '}
              <span className="text-slate-800">{letterData.pencapaianSpesifik}</span>
            </p>
          )}
        </div>
      )}

      {/* Daftar Lampiran Berkas */}
      <div className="mb-6">
        <p className="mb-2">Sebagai bahan pertimbangan Bapak/Ibu, bersama ini saya lampirkan:</p>
        <ol className="list-decimal ml-8 space-y-1 text-xs font-sans">
          {lampiranList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

      {/* Penutup */}
      <div className="mb-8 text-justify indent-8">
        <p>
          Demikian surat lamaran pekerjaan ini saya sampaikan dengan sebenar-benarnya. Besar harapan saya
          untuk dapat diberikan kesempatan wawancara agar dapat menjelaskan lebih lanjut mengenai potensi
          dan kualifikasi yang saya miliki. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya
          ucapkan terima kasih.
        </p>
      </div>

      {/* Tanda Tangan */}
      <div className="flex flex-col items-end mr-6">
        <div className="text-center min-w-[180px]">
          <p>Hormat saya,</p>
          <div className="h-20 flex items-center justify-center">
            {/* Space for physical or digital signature */}
          </div>
          <p className="font-bold underline uppercase">{letterData.nama || 'Nama Pelamar'}</p>
        </div>
      </div>
    </div>
  );
}
