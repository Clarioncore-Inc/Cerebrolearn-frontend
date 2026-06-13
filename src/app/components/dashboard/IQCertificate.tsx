import React from 'react';

const BRAND_COLOR = '#395192';
const BRAND_FONT_FAMILY = 'Roboto, Arial, sans-serif';
const STUDENT_NAME_FONT_FAMILY = "'Courgette', cursive";
const CERTIFICATE_BORDER_ASSET_PATH = '/assets/Vector.svg';
const CERTIFICATE_LOGO_ASSET_PATH = '/assets/certificate_logo.svg';
const CERTIFICATE_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Courgette&family=Roboto:wght@400;500;700;800&display=swap');";

export interface IQCertificateCognitiveProfile {
  pattern_recognition: number;
  working_memory: number;
  processing_speed: number;
  verbal_intelligence: number;
  spatial_reasoning: number;
}

export interface IQCertificateData {
  studentName: string;
  psychologistName: string;
  psychologistSpecialization?: string;
  iqScore: number;
  certificateId: string;
  issuedAt: string;
  assessmentDate?: string;
}

const formatCertificateDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatFooterIssueDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';

  const month = parsed.toLocaleDateString('en-US', { month: 'long' });
  const day = String(parsed.getDate()).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${month} ${day}, ${year}`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const calculateOfficialIQScore = (percentageScore: number) =>
  Math.round(100 + (percentageScore - 50) * 0.3);

export const calculateIQScoreFromCognitiveProfile = (
  profile: IQCertificateCognitiveProfile,
) => {
  const averageScore =
    (profile.pattern_recognition +
      profile.working_memory +
      profile.processing_speed +
      profile.verbal_intelligence +
      profile.spatial_reasoning) /
    5;

  return calculateOfficialIQScore(averageScore);
};

export const buildIQCertificateId = (bookingId: string) =>
  `IQ-${bookingId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12).toUpperCase()}`;

const buildCertificateBrandHtml = (logoAssetUrl: string) => `
  <div class="brand-header">
    <img class="brand-logo" src="${logoAssetUrl}" alt="CerebroLearn" />
  </div>
`;

const buildIQCertificateHtml = (
  certificate: IQCertificateData,
  borderAssetUrl: string,
  logoAssetUrl: string,
) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Official IQ Certificate</title>
      <style>
        ${CERTIFICATE_FONT_IMPORT}
        @page { size: landscape; margin: 12mm; }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: ${BRAND_FONT_FAMILY};
          color: #1f2937;
          background: #f5f1e8;
        }
        .certificate {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #fffdf8 0%, #f8f2e5 100%);
        }
        .certificate-border {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }
        .certificate-shell {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          padding: 64px 84px 72px;
          display: flex;
          flex-direction: column;
        }
        .brand-header {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo {
          width: 240px;
          max-width: 100%;
          height: auto;
          display: block;
        }
        .title { text-align: center; margin: 24px 0 12px; }
        .title h1 {
          margin: 0;
          font-size: 36px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: ${BRAND_COLOR};
          font-family: ${BRAND_FONT_FAMILY};
        }
        .title p { margin: 10px 0 0; color: #6b7280; font-family: ${BRAND_FONT_FAMILY}; }
        .content { text-align: center; padding: 16px 24px 8px; }
        .eyebrow { font-family: ${BRAND_FONT_FAMILY}; color: #6b7280; letter-spacing: 0.08em; text-transform: uppercase; }
        .student { margin: 18px 0 10px; font-size: 100px; line-height: 1.1; color: ${BRAND_COLOR}; font-family: ${STUDENT_NAME_FONT_FAMILY}; }
        .score-wrap { margin: 30px auto 24px; width: fit-content; padding: 18px 34px; border-radius: 999px; background: ${BRAND_COLOR}; color: white; }
        .score-label { font-family: ${BRAND_FONT_FAMILY}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8; }
        .score-value { font-size: 42px; font-weight: 700; line-height: 1.05; }
        .certificate-footer {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          margin-top: 34px;
          align-items: end;
          font-family: 'Times New Roman', Times, serif;
        }
        .footer-col {
          text-align: center;
        }
        .footer-line {
          height: 1px;
          width: 100%;
          background: rgba(57, 81, 146, 0.5);
          margin-bottom: 10px;
        }
        .footer-label {
          font-size: 15px;
          color: #000;
          font-weight:700;
          margin-bottom: 8px;
        }
        .footer-value {
          font-size: 24px;
          color: #000;
          font-weight: 700;
          line-height: 1.25;
        }
        .footer-subvalue {
          margin-top: 6px;
          font-size: 18px;
           font-weight: 700;
          color: #000;
          line-height: 1.3;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <img class="certificate-border" src="${borderAssetUrl}" alt="" />
        <div class="certificate-shell">
        ${buildCertificateBrandHtml(logoAssetUrl)}
        <div class="title">
          <p style=" color: ${BRAND_COLOR}; font-size: 46px; font-family: 'Times New Roman', Times, serif; font-weight:700;">INTELLIGENT QUOTIENT CERTIFICATE</p>
          <p style=" color: #000; font-family: 'Times New Roman', Times, serif;font-size:32px;">Issued to:</p>
        </div>
        <div class="content">
          <div class="student">${escapeHtml(certificate.studentName)}</div>
          <p style="font-family: 'Times New Roman', Times, serif; font-size: 32px; line-height: 1.6; margin: 0;">
            for successfully completing the <span style="color: ${BRAND_COLOR};">Culture Fair Intelligence Test</span> -<br />
            with a certified Psychologist Cognitive Growth Edition with the following score
          </p>
          <div class="score-wrap">
            <div class="score-label">Official IQ Score</div>
            <div class="score-value">${certificate.iqScore}</div>
          </div>
        </div>
        <div class="certificate-footer">
          <div class="footer-col">
            <div class="footer-label">Date of issuance</div>
            <div class="footer-value">${escapeHtml(formatFooterIssueDate(certificate.issuedAt))}</div>
          </div>
          <div class="footer-col">
            <div class="footer-line"></div>
            <div class="footer-value">${escapeHtml(certificate.psychologistName)}</div>
            <div class="footer-subvalue">${escapeHtml(
              certificate.psychologistSpecialization || 'Certified Psychologist',
            )}</div>
          </div>
          <div class="footer-col">
            <div class="footer-label">Certificate ID</div>
            <div class="footer-value">${escapeHtml(certificate.certificateId)}</div>
          </div>
        </div>
        </div>
      </div>
    </body>
  </html>
`;

export const downloadIQCertificate = (certificate: IQCertificateData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Please allow popups to download the certificate');
  }

  const borderAssetUrl = `${window.location.origin}${CERTIFICATE_BORDER_ASSET_PATH}`;
  const logoAssetUrl = `${window.location.origin}${CERTIFICATE_LOGO_ASSET_PATH}`;

  printWindow.document.write(
    buildIQCertificateHtml(certificate, borderAssetUrl, logoAssetUrl),
  );
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
};

export function IQCertificatePreview({ certificate }: { certificate: IQCertificateData }) {
  return (
    <>
      <style>{CERTIFICATE_FONT_IMPORT}</style>
      <div className='relative aspect-[1.414/1] overflow-hidden bg-gradient-to-br from-[#fffdf8] via-[#fbf7ef] to-[#f5ecda] shadow-2xl'>
        <img
          src={CERTIFICATE_BORDER_ASSET_PATH}
          alt=''
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 h-full w-full select-none object-fill'
        />
        <div className='relative z-10 flex h-full flex-col px-10 py-8 md:px-16 md:py-12'>
        <div className='flex items-center justify-center'>
          <img
            src={CERTIFICATE_LOGO_ASSET_PATH}
            alt='CerebroLearn'
            className='h-auto w-[220px] max-w-full'
          />
        </div>
        <div className='flex flex-1 flex-col items-center justify-center px-2 text-center'>
          <p
            className='text-[10px] uppercase tracking-[0.25em] md:text-xs'
            style={{ color: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}
          >
            Official IQ Certificate
          </p>
          <h2
            className='mt-3 font-semibold'
            style={{ color: BRAND_COLOR, fontFamily: STUDENT_NAME_FONT_FAMILY, fontSize: '100px', lineHeight: 1.1 }}
          >
            {certificate.studentName}
          </h2>
          <p
            className='mt-3 max-w-2xl text-xs text-muted-foreground md:text-base'
            style={{ fontFamily: 'Times New Roman, Times, serif', lineHeight: 1.6 }}
          >
            for successfully completing the{' '}
            <span style={{ color: BRAND_COLOR }}>Culture Fair Intelligence Test</span> -
            <br />
            with a certified Psychologist Cognitive Growth Edition with the
            following score
          </p>
          <div className='mt-5 rounded-full px-6 py-3 text-white md:px-10 md:py-4' style={{ backgroundColor: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}>
            <p className='text-[10px] uppercase tracking-[0.25em] text-white/80 md:text-xs'>Official IQ Score</p>
            <p className='text-3xl font-bold md:text-5xl'>{certificate.iqScore}</p>
          </div>
        </div>
        <div className='mt-8 grid gap-5 text-center md:grid-cols-3'>
          <div>
            <div className='w-full border-t border-[#395192]/50 pt-3' />
            <p className='text-sm text-muted-foreground' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Date of issuance
            </p>
            <p className='mt-2 text-xl font-semibold' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              {formatFooterIssueDate(certificate.issuedAt)}
            </p>
          </div>
          <div>
            <div className='w-full border-t border-[#395192]/50 pt-3' />
            <p className='text-sm text-muted-foreground' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Psychologist signature
            </p>
            <p className='mt-2 text-xl font-semibold' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              {certificate.psychologistName}
            </p>
            <p className='mt-1 text-base' style={{ color: BRAND_COLOR, fontFamily: 'Times New Roman, Times, serif' }}>
              {certificate.psychologistSpecialization || 'Certified Psychologist'}
            </p>
          </div>
          <div>
            <div className='w-full border-t border-[#395192]/50 pt-3' />
            <p className='text-sm text-muted-foreground' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              Certificate ID
            </p>
            <p className='mt-2 text-xl font-semibold' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              {certificate.certificateId}
            </p>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}