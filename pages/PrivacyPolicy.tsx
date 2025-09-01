
import React from 'react';
import Button from '../components/Button';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto max-w-4xl text-slate-300 py-8">
            <Button onClick={onBack} className="mb-8 bg-slate-700 hover:bg-slate-600">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to App
            </Button>
            <div className="space-y-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                <h1 className="text-3xl font-bold text-sky-400">Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-2xl font-semibold text-slate-100 pt-4">Introduction</h2>
                <p>Your privacy is important to us. This Privacy Policy explains how we handle the information you provide when you use our AI Virtual Try-On application.</p>
                
                <h2 className="text-2xl font-semibold text-slate-100 pt-4">Information We Process</h2>
                <p>When you use our service, you upload two images: a photo of yourself and a photo of an outfit. These images are the only data we process for the virtual try-on feature.</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>We do not ask for, collect, or store any personal identification information such as your name, email address, or location.</li>
                    <li>The images you upload are sent directly to the Google Gemini API for processing.</li>
                    <li>We do not store your images on our servers. They are used only for the duration of the API call to generate the result and are not retained by us.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-slate-100 pt-4">How We Use Your Images</h2>
                <p>Your images are used exclusively to generate the virtual try-on result. The AI model processes the images to combine the person from one image with the clothing from the other. The processing is automated and does not involve manual review of your photos by us.</p>
                
                <h2 className="text-2xl font-semibold text-slate-100 pt-4">Third-Party Services</h2>
                <p>We use Google's Gemini API to power our virtual try-on feature. The images you upload are subject to Google's Privacy Policy. We encourage you to review Google's policy to understand how they handle data.</p>
                
                <h2 className="text-2xl font-semibold text-slate-100 pt-4">Data Security</h2>
                <p>We are committed to ensuring your information is secure. While we do not store your images, we use secure methods to transmit them to the Google Gemini API.</p>

                <h2 className="text-2xl font-semibold text-slate-100 pt-4">Changes to This Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
