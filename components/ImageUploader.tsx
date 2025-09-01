
import React, { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
    onImageUpload: (base64: string | null) => void;
    title: string;
    icon: React.ReactNode;
    uploadedImage: string | null;
}

const MIN_RESOLUTION = 512;

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, icon, uploadedImage }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (files: FileList | null) => {
        const file = files?.[0];
        setError(null);

        if (!file) {
            onImageUpload(null);
            return;
        }

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                const img = new Image();
                img.onload = () => {
                    if (img.width < MIN_RESOLUTION || img.height < MIN_RESOLUTION) {
                        setError(`Image must be at least ${MIN_RESOLUTION}x${MIN_RESOLUTION}px.`);
                        onImageUpload(null);
                    } else {
                        onImageUpload(base64);
                    }
                };
                img.src = base64;
            };
            reader.readAsDataURL(file);
        } else {
            setError("Invalid file type. Please upload an image.");
            onImageUpload(null);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, [handleFileChange]);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
            <div
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative w-full aspect-square rounded-lg border-2 border-dashed transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden group
                ${error ? 'border-red-500 bg-red-500/10' : ''}
                ${isDragging ? 'border-sky-500 bg-sky-500/10' : 'border-slate-600 hover:border-sky-600 hover:bg-slate-700/50'}
                ${uploadedImage && !error ? 'border-solid border-sky-500' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${title}-error` : undefined}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                />
                {uploadedImage && !error ? (
                    <>
                        <img src={uploadedImage} alt={title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-semibold">Change Photo</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center p-4">
                        {icon}
                        <p className="mt-2 text-sm text-slate-400">
                            <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (min. 512x512)</p>
                    </div>
                )}
            </div>
            {error && (
                 <p id={`${title}-error`} className="text-red-400 text-sm mt-2 text-center" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};

export default ImageUploader;
