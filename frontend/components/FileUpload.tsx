'use client';

import { useCallback, useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept: string;
  maxSize: number; // in MB
  onFileSelect: (file: File | null) => void;
  label: string;
  currentFile?: string;
  type?: 'document' | 'image';
}

export function FileUpload({
  accept,
  maxSize,
  onFileSelect,
  label,
  currentFile,
  type = 'document',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);

      // Check file type
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isValidType = acceptedTypes.some(
        (t) =>
          t === fileExtension ||
          t === mimeType ||
          (t.includes('/*') && mimeType.startsWith(t.replace('/*', '/')))
      );

      if (!isValidType) {
        setError(`Fayl turi noto'g'ri. Ruxsat etilgan: ${accept}`);
        return false;
      }
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        setError(`Fayl hajmi ${maxSize}MB dan oshmasligi kerak`);
        return false;
      }

      return true;
    },
    [accept, maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);

        if (type === 'image') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [validateFile, onFileSelect, type]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      {selectedFile || preview ? (
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'image' && preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedFile?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="p-1 hover:bg-secondary rounded"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      ) : currentFile ? (
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'image' ? (
                <img
                  src={currentFile}
                  alt="Current"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mavjud fayl
                </p>
                <a
                  href={currentFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  Ko&apos;rish
                </a>
              </div>
            </div>
            <label className="cursor-pointer px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
              Yangilash
              <input
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            dragActive
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50',
            error && 'border-destructive'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              {type === 'image' ? (
                <Image className="h-10 w-10 text-muted-foreground" />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                Faylni bu yerga tashlang yoki{' '}
                <span className="text-accent font-medium">tanlang</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxSize}MB - {accept}
              </p>
            </div>
          </label>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
