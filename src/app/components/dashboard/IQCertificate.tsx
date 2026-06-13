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
        @page { size: A4 landscape; margin: 0; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #fffdf8 0%, #f8f2e5 100%);
        }
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: ${BRAND_FONT_FAMILY};
          color: #1f2937;
          background: linear-gradient(135deg, #fffdf8 0%, #f8f2e5 100%);
        }
        .certificate {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
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
          height: 100%;
          padding: 120px 100px 110px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .brand-header {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo {
          width: 180px;
          max-width: 100%;
          height: auto;
          display: block;
        }
        .title { text-align: center; margin: 10px 0 6px; }
        .title h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: ${BRAND_COLOR};
          font-family: ${BRAND_FONT_FAMILY};
        }
        .title p { margin: 6px 0 0; color: #6b7280; font-family: ${BRAND_FONT_FAMILY}; }
        .main-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .content { text-align: center; padding: 8px 24px 4px; }
        .eyebrow { font-family: ${BRAND_FONT_FAMILY}; color: #6b7280; letter-spacing: 0.08em; text-transform: uppercase; }
        .student { margin: 8px 0 6px; font-size: 58px; line-height: 1.1; color: ${BRAND_COLOR}; font-family: ${STUDENT_NAME_FONT_FAMILY}; }
        .score-wrap { margin: 14px auto 12px; width: fit-content; padding: 12px 28px; border-radius: 999px; background: ${BRAND_COLOR}; color: white; }
        .score-label { font-family: ${BRAND_FONT_FAMILY}; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8; }
        .score-value { font-size: 36px; font-weight: 700; line-height: 1.05; }
        .certificate-footer {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 18px;
          padding: 0 42px;
          align-items: end;
          font-family: 'Times New Roman', Times, serif;
        }
        .footer-col {
          text-align: center;
        }
        .footer-col:first-child,
        .footer-col:last-child {
          padding-inline: 18px;
        }
        .footer-line {
          height: 1px;
          width: 100%;
          background: rgba(57, 81, 146, 0.5);
          margin-bottom: 10px;
        }
        .footer-label {
          font-size: 14px;
          color: #000;
          font-weight:700;
          margin-bottom: 8px;
          font-family: 'Times New Roman', Times, serif;
        }
        .footer-value {
          font-size: 18px;
          color: #000;
          font-weight: 700;
          line-height: 1.25;
          font-family: 'Times New Roman', Times, serif;
          overflow-wrap: anywhere;
        }
        .footer-subvalue {
          margin-top: 6px;
          font-size: 14px;
           font-weight: 700;
           font-family: 'Times New Roman', Times, serif;
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
        <div class="main-body">
          <div class="title">
            <p style="color: ${BRAND_COLOR}; font-size: 26px; font-family: 'Times New Roman', Times, serif; font-weight:700;">INTELLIGENT QUOTIENT CERTIFICATE</p>
            <p style="color: #000; font-family: 'Times New Roman', Times, serif; font-size: 18px; margin-top: 10px;">Issued to:</p>
          </div>
          <div class="content">
            <div class="student">${escapeHtml(certificate.studentName)}</div>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 18px; line-height: 1.6; margin: 0;">
              for successfully completing the <span style="color: ${BRAND_COLOR};">Culture Fair Intelligence Test</span> -<br />
              with a certified Psychologist Cognitive Growth Edition with the following score
            </p>
            <div class="score-wrap">
              <div class="score-label">Official IQ Score</div>
              <div class="score-value">${certificate.iqScore}</div>
            </div>
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
  const iframe = document.createElement('iframe');
  // Off-screen but with real dimensions so the browser renders and prints it
  iframe.style.cssText =
    'position:fixed;left:-9999px;top:0;width:1122px;height:794px;border:0;pointer-events:none;';
  document.body.appendChild(iframe);

  const borderAssetUrl = `${window.location.origin}${CERTIFICATE_BORDER_ASSET_PATH}`;
  const logoAssetUrl = `${window.location.origin}${CERTIFICATE_LOGO_ASSET_PATH}`;

  const html = buildIQCertificateHtml(certificate, borderAssetUrl, logoAssetUrl);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  const cleanup = () => {
    URL.revokeObjectURL(blobUrl);
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
  };

  iframe.onload = () => {
    if (!iframe.contentWindow) { cleanup(); return; }
    iframe.contentWindow.document.fonts.ready.then(() => {
      iframe.contentWindow!.print();
      setTimeout(cleanup, 2000);
    });
  };

  iframe.src = blobUrl;
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
        <div className='relative z-10 flex h-full flex-col px-8 py-5 md:px-14 md:py-8'>
          <div className='flex items-center justify-center'>
            <img
              src={CERTIFICATE_LOGO_ASSET_PATH}
              alt='CerebroLearn'
              className='h-auto w-[140px] max-w-full md:w-[180px]'
            />
          </div>
          <div className='flex flex-1 flex-col items-center justify-center px-2 text-center'>
            <p
              className='text-[9px] uppercase tracking-[0.25em] md:text-[11px]'
              style={{ color: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}
            >
              Official IQ Certificate
            </p>
            <h2
              className='mt-1 font-semibold'
              style={{ color: BRAND_COLOR, fontFamily: STUDENT_NAME_FONT_FAMILY, fontSize: 'clamp(22px, 4.5vw, 58px)', lineHeight: 1.1 }}
            >
              {certificate.studentName}
            </h2>
            <p
              className='mt-2 max-w-2xl text-[10px] text-muted-foreground md:text-sm'
              style={{ fontFamily: 'Times New Roman, Times, serif', lineHeight: 1.6 }}
            >
              for successfully completing the{' '}
              <span style={{ color: BRAND_COLOR }}>Culture Fair Intelligence Test</span> -
              <br />
              with a certified Psychologist Cognitive Growth Edition with the
              following score
            </p>
            <div className='mt-3 rounded-full px-5 py-2 text-white md:px-8 md:py-3' style={{ backgroundColor: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}>
              <p className='text-[9px] uppercase tracking-[0.25em] text-white/80 md:text-[11px]'>Official IQ Score</p>
              <p className='text-2xl font-bold md:text-4xl'>{certificate.iqScore}</p>
            </div>
          </div>
          <div className='mt-4 grid gap-3 px-4 text-center md:grid-cols-3 md:px-10'>
            <div className='px-2 md:px-4'>
              <div className='w-full border-t border-[#395192]/50 pt-2' />
              <p className='text-[10px] text-muted-foreground md:text-xs' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Date of issuance
              </p>
              <p className='mt-1 text-sm font-semibold md:text-base' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                {formatFooterIssueDate(certificate.issuedAt)}
              </p>
            </div>
            <div>
              <div className='w-full border-t border-[#395192]/50 pt-2' />
              <p className='text-[10px] text-muted-foreground md:text-xs' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Psychologist
              </p>
              <p className='mt-1 text-sm font-semibold md:text-base' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                {certificate.psychologistName}
              </p>
              <p className='mt-0.5 text-[10px] md:text-xs' style={{ color: BRAND_COLOR, fontFamily: 'Times New Roman, Times, serif' }}>
                {certificate.psychologistSpecialization || 'Certified Psychologist'}
              </p>
            </div>
            <div className='px-2 md:px-4'>
              <div className='w-full border-t border-[#395192]/50 pt-2' />
              <p className='text-[10px] text-muted-foreground md:text-xs' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                Certificate ID
              </p>
              <p className='mt-1 text-sm font-semibold md:text-base' style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                {certificate.certificateId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}