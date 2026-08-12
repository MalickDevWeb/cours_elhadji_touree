import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { getStudentPhoto } from './StudentCardBody';
import { StudentPhotoModal } from './StudentPhotoModal';

interface StudentPhotoUploaderProps {
  studentId: string; sex: 'M' | 'F'; currentPhotoUrl?: string; studentName: string;
  onPhotoChange: (newPhotoUrl: string) => void;
}

export const StudentPhotoUploader: React.FC<StudentPhotoUploaderProps> = ({
  studentId, sex, currentPhotoUrl, studentName, onPhotoChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const displayPhoto = currentPhotoUrl || getStudentPhoto(studentId, sex);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: reader.result, folder: 'students' })
          });
          const data = await res.json();
          onPhotoChange(data.url || reader.result);
        } catch {
          onPhotoChange(reader.result);
        } finally {
          setIsUploading(false);
          setIsMenuOpen(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative inline-block">
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
      <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

      <div className="relative group cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="w-16 h-20 rounded-2xl bg-slate-800 border-2 border-amber-400 overflow-hidden shadow-md flex items-center justify-center relative">
          <img src={displayPhoto} alt={studentName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          {isUploading ? (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
          )}
        </div>
        <button type="button" className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-1.5 rounded-full shadow-md border border-white cursor-pointer">
          <Camera className="w-3 h-3" />
        </button>
      </div>

      <StudentPhotoModal
        isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} studentName={studentName} sex={sex}
        isUploading={isUploading} onSelectCamera={() => cameraInputRef.current?.click()}
        onSelectFile={() => fileInputRef.current?.click()} onSelectPreset={(url) => onPhotoChange(url)}
      />
    </div>
  );
};
