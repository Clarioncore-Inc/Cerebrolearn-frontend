import React, { useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Share2, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CertificateGeneratorProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  courseCreator: string;
  certificateId: string;
}

export function CertificateGenerator({
  studentName,
  courseName,
  completionDate,
  courseCreator,
  certificateId,
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    // In a real app, you'd use html2canvas or similar to convert to image/PDF
    toast.success('Certificate download started! (Feature in development)');
    
    // Mock download simulation
    const link = document.createElement('a');
    link.download = `certificate-${certificateId}.pdf`;
    // In production, this would be a generated PDF URL
    link.href = '#';
    link.click();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/certificates/${certificateId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Certificate link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={certificateRef}
            className="relative aspect-[1.414/1] bg-gradient-to-br from-white to-gray-50 p-12"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(57, 81, 146, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(57, 81, 146, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-primary/20 rounded-lg" />
            <div className="absolute inset-6 border-2 border-primary/10 rounded-lg" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              {/* Logo/Icon */}
              <div className="mb-8">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Award className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Header */}
              <h1 className="text-4xl font-bold mb-2 text-primary">CerebroLearn</h1>
              <p className="text-lg text-muted-foreground mb-8">Certificate of Completion</p>

              {/* Main Content */}
              <div className="max-w-2xl">
                <p className="text-muted-foreground mb-4">This is to certify that</p>
                <h2 className="text-4xl font-bold mb-6 text-primary">{studentName}</h2>
                <p className="text-muted-foreground mb-4">has successfully completed the course</p>
                <h3 className="text-2xl font-semibold mb-8">{courseName}</h3>

                {/* Date and Instructor */}
                <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-primary/20">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground mb-1">Date of Completion</p>
                    <p className="font-semibold">
                      {new Date(completionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Course Creator</p>
                    <p className="font-semibold">{courseCreator}</p>
                  </div>
                </div>

                {/* Certificate ID */}
                <p className="text-xs text-muted-foreground mt-8">
                  Certificate ID: {certificateId}
                </p>
              </div>

              {/* Seal */}
              <div className="absolute bottom-12 right-12">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-white/50" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button size="lg" onClick={handleDownload}>
          <Download className="h-5 w-5 mr-2" />
          Download Certificate
        </Button>
        <Button size="lg" variant="outline" onClick={handleShare}>
          <Share2 className="h-5 w-5 mr-2" />
          Share Certificate
        </Button>
      </div>

      {/* Verification Info */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-3">Certificate Verification</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Anyone can verify the authenticity of this certificate using the unique
            certificate ID. Share your achievement with confidence!
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono mb-2">
              Verification URL:
            </p>
            <p className="text-sm font-mono text-primary break-all">
              {window.location.origin}/verify/{certificateId}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credential Type</p>
                <p className="font-semibold">Course Certificate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shareable</p>
                <p className="font-semibold">Public Link</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Certificate List Component (for showing all earned certificates)
export function CertificateList({ certificates }: { certificates: any[] }) {
  return (
    <div className="space-y-4">
      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete courses to earn certificates
            </p>
            <Button>Browse Courses</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{cert.courseName}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Completed {new Date(cert.completionDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
