import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Student } from '../../../types';

export const getInitials = (first: string, last: string) => 
  `${first.charAt(0) || ''}${last.charAt(0) || ''}`.toUpperCase();

export const getDefaultStudentPhoto = (sex: 'M' | 'F', idSeed?: string): string => {
  const males = [
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  ];
  const females = [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80'
  ];
  const sum = (idSeed || 'std').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sex === 'M' ? males[sum % males.length] : females[sum % females.length];
};

export const getFormattedId = (student: Student) => {
  const cleanId = student.id.replace(/\D/g, '').slice(-4) || '9821';
  return `SEN-2026-${cleanId}-${student.sex.toUpperCase()}`;
};

export const handlePrintCard = (student: Student, cardElement: HTMLElement | null) => {
  if (!cardElement) return;
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute'; iframe.style.width = '0px'; iframe.style.height = '0px'; iframe.style.border = 'none';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) return;

  doc.write(`
    <html>
      <head>
        <title>Carte d'Élève - ${student.firstName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } } body { background-color: white; margin: 0; padding: 20px; display: flex; align-items: center; justify-content: center; }</style>
      </head>
      <body>
        <div class="w-[360px]">${cardElement.innerHTML}</div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); window.parent.document.body.removeChild(window.frameElement); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  doc.close();
};

export const handleDownloadCardPDF = async (student: Student, cardElement: HTMLElement | null) => {
  if (!cardElement) return;
  try {
    const canvas = await toCanvas(cardElement, { pixelRatio: 3, backgroundColor: undefined });
    const imgData = canvas.toDataURL('image/png');
    const width = canvas.width, height = canvas.height;
    const pdfWidth = 85.6, pdfHeight = (height * pdfWidth) / width;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [pdfWidth, pdfHeight] });
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`carte-elite-${student.firstName}-${student.lastName}.pdf`);
  } catch (error) {
    console.error('Erreur PDF:', error);
  }
};
