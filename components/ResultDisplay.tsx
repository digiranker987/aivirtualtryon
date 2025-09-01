import React from 'react';
import Button from './Button';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ResultDisplayProps {
    image: string | null;
    isLoading: boolean;
    onDownload: () => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="w-full aspect-square rounded-lg bg-slate-700 animate-pulse flex flex-col items-center justify-center">
        <SparklesIcon className="w-12 h-12 text-slate-500 animate-pulse" />
        <p className="mt-4 text-slate-400">AI is creating your new look...</p>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="w-full aspect-square rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center p-4">
        <SparklesIcon className="w-12 h-12 text-slate-600" />
        <p className="mt-4 text-slate-400">Your generated image will appear here.</p>
        <p className="text-sm text-slate-500">Upload your images and click "Virtually Try On".</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, isLoading, onDownload }) => {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!image) {
        return <Placeholder />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-700 shadow-md">
                <img src={image} alt="Generated virtual try-on" className="w-full h-full object-cover" />
            </div>
            <Button onClick={onDownload} className="w-full">
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Download Image
            </Button>
        </div>
    );
};

export default ResultDisplay;