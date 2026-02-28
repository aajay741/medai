import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ZohoCallback() {
    const [searchParams] = useSearchParams();
    const [code, setCode] = useState('');

    useEffect(() => {
        const authCode = searchParams.get('code');
        if (authCode) {
            setCode(authCode);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 text-white pt-32">
            <div className="max-w-2xl w-full bg-[#0a0a0a] border border-[#A78BFA]/20 p-10 rounded-3xl backdrop-blur-xl">
                <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-white to-[#A78BFA] bg-clip-text text-transparent">
                    Zoho Auth Code Received
                </h1>

                {code ? (
                    <div className="space-y-6">
                        <p className="text-gray-400 text-lg">
                            Copy the code below and send it back to me. I will use it to generate your permanent Refresh Token.
                        </p>

                        <div className="bg-black/50 p-6 rounded-2xl border border-[#A78BFA]/10 break-all font-mono text-[#A78BFA] select-all cursor-pointer hover:bg-black/80 transition-all">
                            {code}
                        </div>

                        <p className="text-xs text-gray-500 italic">
                            Tip: Once you give me this code, I'll update the configuration automatically.
                        </p>
                    </div>
                ) : (
                    <div className="text-red-400">
                        No code found in the URL. Please go back to the authorization link.
                    </div>
                )}
            </div>
        </div>
    );
}
