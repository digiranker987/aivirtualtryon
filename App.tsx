
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Button from './components/Button';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import { generateVirtualTryOnImage } from './services/geminiService';
import { UploadIcon } from './components/icons/UploadIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';

type Page = 'main' | 'privacy' | 'disclaimer';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('main');
    const [userImage, setUserImage] = useState<string | null>(null);
    const [outfitImage, setOutfitImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTryOn = useCallback(async () => {
        if (!userImage || !outfitImage) {
            setError("Please upload both your photo and an outfit photo.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const result = await generateVirtualTryOnImage(userImage, outfitImage);
            setGeneratedImage(result);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [userImage, outfitImage]);

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'virtual-try-on.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'privacy':
                return <PrivacyPolicy onBack={() => setCurrentPage('main')} />;
            case 'disclaimer':
                return <Disclaimer onBack={() => setCurrentPage('main')} />;
            case 'main':
            default:
                return (
                    <>
                        <header className="text-center mb-8">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                                AI Virtual Try-On Studio
                            </h1>
                            <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
                                See yourself in a new outfit. Upload your photo, pick a style, and let AI create your new look. For best results, use images that are at least 512x512 pixels.
                            </p>
                        </header>

                        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-6 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                                <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-700 pb-3">1. Upload Your Images</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ImageUploader 
                                        title="Your Photo"
                                        onImageUpload={setUserImage}
                                        uploadedImage={userImage}
                                        icon={<UploadIcon className="w-8 h-8 text-slate-500" />}
                                    />
                                    <ImageUploader 
                                        title="Outfit Photo"
                                        onImageUpload={setOutfitImage}
                                        uploadedImage={outfitImage}
                                        icon={<UploadIcon className="w-8 h-8 text-slate-500" />}
                                    />
                                </div>
                                 <div className="mt-4">
                                    <Button 
                                        onClick={handleTryOn}
                                        disabled={!userImage || !outfitImage || isLoading}
                                        className="w-full"
                                    >
                                        <SparklesIcon className="w-5 h-5 mr-2"/>
                                        {isLoading ? 'Generating Your Look...' : 'Virtually Try On'}
                                    {/* FIX: Corrected the closing tag for the Button component. */}
                                    </Button>
                                 </div>
                                 {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                                 <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-700 pb-3 mb-6">2. Your New Look</h2>
                                <ResultDisplay 
                                    image={generatedImage}
                                    isLoading={isLoading}
                                    onDownload={handleDownload}
                                />
                            </div>
                        </main>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
            <div className="container mx-auto max-w-7xl flex-grow">
               {renderPage()}
            </div>
            <Footer onNavigate={setCurrentPage} />
        </div>
    );
};

export default App;