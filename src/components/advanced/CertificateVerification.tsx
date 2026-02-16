import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Award, Calendar, User, Link as LinkIcon, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function CertificateVerification() {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setIsVerifying(true);

    // Simulate verification
    setTimeout(() => {
      setVerificationResult({
        valid: true,
        certificateId: certificateId.toUpperCase(),
        studentName: 'John Doe',
        courseName: 'Advanced React Development',
        issueDate: '2024-11-15',
        completionDate: '2024-11-10',
        grade: 'A+ (95%)',
        instructor: 'Dr. Sarah Johnson',
        credentialUrl: `https://cerebrolearn.com/verify/${certificateId}`,
        blockchain: {
          verified: true,
          transactionHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
        }
      });
      setIsVerifying(false);
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(verificationResult.credentialUrl);
    toast.success('Certificate URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Certificate</h2>
          <p className="text-gray-600 mb-6">Enter a certificate ID to verify its authenticity</p>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Enter certificate ID (e.g., CERT-2024-XXXX)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full pl-12 pr-4 h-12"
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Certificate ID can be found at the bottom of your certificate
          </p>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Status Banner */}
            <div className={`p-6 ${
              verificationResult.valid 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            } text-white`}>
              <div className="flex items-center justify-center gap-3">
                {verificationResult.valid ? (
                  <>
                    <CheckCircle className="w-8 h-8" />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-1">Certificate Verified ✓</h2>
                      <p className="text-green-100">This is a valid CerebroLearn certificate</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8" />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-1">Certificate Not Found</h2>
                      <p className="text-red-100">This certificate ID could not be verified</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {verificationResult.valid && (
              <div className="p-8">
                {/* Certificate Details */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="font-semibold text-gray-900">{verificationResult.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
                    <p className="font-mono font-semibold text-gray-900">{verificationResult.certificateId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Course Name</p>
                    <p className="font-semibold text-gray-900">{verificationResult.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Instructor</p>
                    <p className="font-semibold text-gray-900">{verificationResult.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                    <p className="font-semibold text-gray-900">{verificationResult.completionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                    <p className="font-semibold text-gray-900">{verificationResult.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Final Grade</p>
                    <p className="font-semibold text-green-600">{verificationResult.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Verification Status</p>
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </p>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900 mb-2">Blockchain Verified</h3>
                      <p className="text-sm text-purple-700 mb-2">
                        This certificate has been recorded on the blockchain for permanent verification.
                      </p>
                      <p className="text-xs text-purple-600 font-mono break-all">
                        Transaction: {verificationResult.blockchain.transactionHash}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Certificate
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <a
                    href={verificationResult.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <LinkIcon className="w-5 h-5" />
                    View Online
                  </a>
                </div>

                {/* Credential URL */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Shareable Credential URL:</p>
                  <code className="text-sm text-primary break-all">
                    {verificationResult.credentialUrl}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-[#395192]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain Secured</h3>
            <p className="text-sm text-gray-600">
              All certificates are recorded on blockchain for tamper-proof verification
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Verification</h3>
            <p className="text-sm text-gray-600">
              Employers can verify credentials in seconds
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Industry Recognized</h3>
            <p className="text-sm text-gray-600">
              Trusted by top companies worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}