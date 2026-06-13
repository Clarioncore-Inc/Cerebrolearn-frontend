import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const BRAND_COLOR = '#395192';
const BRAND_FONT_FAMILY = 'Roboto, Arial, sans-serif';

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

const buildCertificateBrandHtml = () => `
  <div class="brand-header">
    <div class="brand-mark" aria-hidden="true">
      <span class="brand-page brand-page-left"></span>
      <span class="brand-spine"></span>
      <span class="brand-page brand-page-right"></span>
    </div>
    <div class="brand-name">CerebroLearn</div>
  </div>
`;

const buildIQCertificateHtml = (certificate: IQCertificateData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Official IQ Certificate</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800&display=swap');
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
          border: 10px solid #b78a2f;
          padding: 28px;
          background: linear-gradient(135deg, #fffdf8 0%, #f8f2e5 100%);
        }
        .certificate::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 2px solid rgba(183, 138, 47, 0.45);
          pointer-events: none;
        }
        .meta, .footer { display: flex; justify-content: space-between; gap: 24px; }
        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
        }
        .brand-mark {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 68px;
          height: 44px;
        }
        .brand-page {
          display: block;
          width: 24px;
          height: 30px;
          border: 3px solid ${BRAND_COLOR};
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
        }
        .brand-page-left { transform: skewY(8deg); }
        .brand-page-right { transform: skewY(-8deg); }
        .brand-spine {
          width: 4px;
          height: 30px;
          border-radius: 999px;
          background: ${BRAND_COLOR};
        }
        .brand-name {
          color: ${BRAND_COLOR};
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.02em;
          font-family: ${BRAND_FONT_FAMILY};
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
        .student { margin: 18px 0 10px; font-size: 44px; color: ${BRAND_COLOR}; font-family: ${BRAND_FONT_FAMILY}; }
        .score-wrap { margin: 30px auto 24px; width: fit-content; padding: 18px 34px; border-radius: 999px; background: ${BRAND_COLOR}; color: white; }
        .score-label { font-family: ${BRAND_FONT_FAMILY}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8; }
        .score-value { font-size: 42px; font-weight: 700; line-height: 1.05; }
        .meta-card {
          flex: 1;
          padding-top: 18px;
          border-top: 1px solid rgba(122, 77, 0, 0.25);
          font-family: ${BRAND_FONT_FAMILY};
        }
        .meta-label { font-size: 11px; color: #6b7280; letter-spacing: 0.08em; text-transform: uppercase; }
        .meta-value { margin-top: 8px; font-size: 18px; font-weight: 600; color: #111827; }
        .footer { margin-top: 26px; align-items: flex-end; }
        .seal {
          width: 88px; height: 88px; border-radius: 999px; border: 3px solid ${BRAND_COLOR};
          display: flex; align-items: center; justify-content: center; color: ${BRAND_COLOR};
          font-family: ${BRAND_FONT_FAMILY}; font-size: 12px; text-align: center; line-height: 1.2;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        ${buildCertificateBrandHtml()}
        <div class="title">
          <h1>Official IQ Certificate</h1>
          <p>This document confirms the outcome of a psychologist-reviewed CerebroLearn IQ assessment.</p>
        </div>
        <div class="content">
          <div class="eyebrow">This certifies that</div>
          <div class="student">${escapeHtml(certificate.studentName)}</div>
          <p style="font-family: Arial, sans-serif; color: #4b5563; font-size: 18px; margin: 0;">
            has been awarded an official IQ assessment score following a proctored review.
          </p>
          <div class="score-wrap">
            <div class="score-label">Official IQ Score</div>
            <div class="score-value">${certificate.iqScore}</div>
          </div>
        </div>
        <div class="meta">
          <div class="meta-card">
            <div class="meta-label">Psychologist</div>
            <div class="meta-value">${escapeHtml(certificate.psychologistName)}</div>
          </div>
          <div class="meta-card">
            <div class="meta-label">Assessment Date</div>
            <div class="meta-value">${escapeHtml(formatCertificateDate(certificate.assessmentDate))}</div>
          </div>
          <div class="meta-card">
            <div class="meta-label">Issued On</div>
            <div class="meta-value">${escapeHtml(formatCertificateDate(certificate.issuedAt))}</div>
          </div>
        </div>
        <div class="footer">
          <div style="font-family: ${BRAND_FONT_FAMILY}; color: #6b7280; max-width: 60%;">
            Verified by CerebroLearn. This certificate is generated from the psychologist's submitted cognitive profile results.
            <div style="margin-top: 10px; font-size: 12px; color: ${BRAND_COLOR};">Certificate ID: ${escapeHtml(certificate.certificateId)}</div>
          </div>
          <div class="seal">CerebroLearn<br />Verified</div>
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

  printWindow.document.write(buildIQCertificateHtml(certificate));
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
};

function CertificateBrandMark() {
  return (
    <div className='relative flex h-10 w-16 items-center justify-center gap-1.5' aria-hidden='true'>
      <span className='block h-7 w-5 rounded-[8px] border-[3px] bg-white' style={{ borderColor: BRAND_COLOR, transform: 'skewY(8deg)' }} />
      <span className='h-7 w-1 rounded-full' style={{ backgroundColor: BRAND_COLOR }} />
      <span className='block h-7 w-5 rounded-[8px] border-[3px] bg-white' style={{ borderColor: BRAND_COLOR, transform: 'skewY(-8deg)' }} />
    </div>
  );
}

export function IQCertificatePreview({ certificate }: { certificate: IQCertificateData }) {
  return (
    <div className='relative aspect-[1.414/1] overflow-hidden rounded-[28px] border-[10px] border-[#b78a2f] bg-gradient-to-br from-[#fffdf8] via-[#fbf7ef] to-[#f5ecda] p-4 shadow-2xl md:p-8'>
      <div className='absolute inset-[12px] rounded-[18px] border-2 border-[#b78a2f]/40' />
      <div className='relative flex h-full flex-col'>
        <div className='flex flex-col items-center justify-center gap-2 text-center'>
          <CertificateBrandMark />
          <p
            className='text-xl font-bold md:text-3xl'
            style={{ color: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}
          >
            CerebroLearn
          </p>
        </div>
        <div className='flex flex-1 flex-col items-center justify-center px-2 text-center'>
          <p
            className='text-[10px] uppercase tracking-[0.25em] md:text-xs'
            style={{ color: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}
          >
            Official IQ Certificate
          </p>
          <h2 className='mt-3 text-xl font-semibold md:text-5xl' style={{ color: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}>{certificate.studentName}</h2>
          <p className='mt-3 max-w-2xl text-xs text-muted-foreground md:text-base'>Awarded after a psychologist-reviewed CerebroLearn IQ assessment.</p>
          <div className='mt-5 rounded-full px-6 py-3 text-white md:px-10 md:py-4' style={{ backgroundColor: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}>
            <p className='text-[10px] uppercase tracking-[0.25em] text-white/80 md:text-xs'>Official IQ Score</p>
            <p className='text-3xl font-bold md:text-5xl'>{certificate.iqScore}</p>
          </div>
        </div>
        <div className='grid gap-3 border-t border-[#b78a2f]/30 pt-4 text-left md:grid-cols-3'>
          <div>
            <p className='text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>Psychologist</p>
            <p className='mt-1 text-sm font-semibold md:text-lg'>{certificate.psychologistName}</p>
          </div>
          <div>
            <p className='text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>Assessment Date</p>
            <p className='mt-1 text-sm font-semibold md:text-lg'>{formatCertificateDate(certificate.assessmentDate)}</p>
          </div>
          <div className='flex items-end justify-between gap-3 md:block'>
            <div>
              <p className='text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>Issued On</p>
              <p className='mt-1 text-sm font-semibold md:text-lg'>{formatCertificateDate(certificate.issuedAt)}</p>
            </div>
            <div className='flex h-14 w-14 items-center justify-center rounded-full border-2 md:ml-auto md:h-20 md:w-20' style={{ borderColor: BRAND_COLOR, color: BRAND_COLOR }}>
              <CheckCircle2 className='h-7 w-7 md:h-9 md:w-9' />
            </div>
          </div>
        </div>
        <p className='mt-3 text-center text-xs font-medium' style={{ color: BRAND_COLOR, fontFamily: BRAND_FONT_FAMILY }}>
          Certificate ID: {certificate.certificateId}
        </p>
      </div>
    </div>
  );
}