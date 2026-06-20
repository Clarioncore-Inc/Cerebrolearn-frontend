import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';

const BRAND_COLOR = '#395192';
const BRAND_FONT_FAMILY = 'Roboto, Arial, sans-serif';
const STUDENT_NAME_FONT_FAMILY = "'Courgette', cursive";
const CERTIFICATE_BORDER_ASSET_PATH = '/assets/Vector.svg';
const CERTIFICATE_LOGO_ASSET_PATH = '/assets/certificate_logo.svg';
const CERTIFICATE_WRAPPER_ASSET_PATH = '/assets/Wrapper.svg';
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
  psychologistSignatureImage?: string;
  iqScore: number;
  cognitiveProfile?: IQCertificateCognitiveProfile;
  certificateId: string;
  testType?: string;
  issuedAt: string;
  assessmentDate?: string;
}

const CERTIFICATE_EXPORT_WIDTH = 1122;
const CERTIFICATE_EXPORT_HEIGHT = 794;
const PDF_PAGE_WIDTH_MM = 297;
const PDF_PAGE_HEIGHT_MM = 210;
const CERTIFICATE_EXPORT_STYLES = `
  .iq-certificate-export {
    position: relative;
    width: ${CERTIFICATE_EXPORT_WIDTH}px;
    height: ${CERTIFICATE_EXPORT_HEIGHT}px;
    overflow: hidden;
    background: linear-gradient(135deg, #fffdf8 0%, #f8f2e5 100%);
    color: #1f2937;
  }
  .iq-certificate-border {
    position: absolute;
    inset: 22px;
    width: calc(100% - 44px);
    height: calc(100% - 44px);
    object-fit: fill;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }
  .iq-certificate-shell {
    position: relative;
    z-index: 1;
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    padding: 80px 100px 110px;
  }
  .iq-certificate-brand {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .iq-certificate-brand-logo {
    width: 180px;
    max-width: 100%;
    height: auto;
    display: block;
  }
  .iq-certificate-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .iq-certificate-title {
    text-align: center;
    margin: -4px 0 8px;
  }
  .iq-certificate-heading {
    margin: 0;
    color: ${BRAND_COLOR};
    font-size: 26px;
    font-family: 'Times New Roman', Times, serif;
    font-weight: 700;
  }
  .iq-certificate-subheading {
    margin: 12px 0 0;
    color: #000;
    font-size: 18px;
    font-family: 'Times New Roman', Times, serif;
  }
  .iq-certificate-content {
    padding: 8px 24px 4px;
    text-align: center;
  }
  .iq-certificate-student {
    margin: 8px 0 14px;
    color: ${BRAND_COLOR};
    font-size: 58px;
    line-height: 1.1;
    font-family: ${STUDENT_NAME_FONT_FAMILY};
  }
  .iq-certificate-description {
    margin: 0;
    color: #000;
    font-size: 18px;
    line-height: 1.6;
    font-family: 'Times New Roman', Times, serif;
  }
  .iq-certificate-score-wrap {
    width: fit-content;
    margin: 24px auto 12px;
    padding: 15px 32px;
    border-radius: 999px;
    background: ${BRAND_COLOR};
    color: white;
  }
  .iq-certificate-score-label {
    font-family: ${BRAND_FONT_FAMILY};
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.8;
  }
  .iq-certificate-score-value {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.12;
  }
  .iq-certificate-kpi-row {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    align-self: stretch;
    margin: 16px 0 8px;
    padding: 0 16px;
  }
  .iq-certificate-kpi-col {
    flex: 1;
    text-align: center;
    padding: 0 8px;
  }
  .iq-certificate-kpi-label {
    font-size: 13px;
    font-family: 'Times New Roman', Times, serif;
    color: #6b7280;
    margin-bottom: 6px;
    font-weight: 400;
  }
  .iq-certificate-kpi-value {
    font-size: 28px;
    font-weight: 700;
    color: ${BRAND_COLOR};
    font-family: 'Times New Roman', Times, serif;
    line-height: 1.1;
  }
  .iq-certificate-kpi-col--highlight .iq-certificate-kpi-label {
    font-weight: 700;
    color: ${BRAND_COLOR};
    font-size: 14px;
  }
  .iq-certificate-kpi-col--highlight .iq-certificate-kpi-value {
    font-size: 44px;
  }
  .iq-certificate-wrapper {
    display: block;
    width: 100%;
    max-width: 900px;
    height: auto;
    margin: 18px auto 0;
  }
  .iq-certificate-footer {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 18px;
    padding: 0 42px;
    align-items: end;
    font-family: 'Times New Roman', Times, serif;
  }
  .iq-certificate-footer-col {
    text-align: center;
  }
  .iq-certificate-footer-col:first-child,
  .iq-certificate-footer-col:last-child {
    padding-inline: 18px;
  }
  .iq-certificate-footer-line {
    width: 100%;
    height: 1px;
    margin-bottom: 0;
    background: rgba(57, 81, 146, 0.5);
  }
  .iq-certificate-footer-label {
    margin-bottom: 8px;
    color: #000;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Times New Roman', Times, serif;
  }
  .iq-certificate-footer-value {
    color: #000;
    font-size: 18px;
    line-height: 1.25;
    font-weight: 700;
    font-family: 'Times New Roman', Times, serif;
    overflow-wrap: anywhere;
  }
  .iq-certificate-footer-subvalue {
    margin-top: 6px;
    color: #000;
    font-size: 14px;
    line-height: 1.3;
    font-weight: 700;
    font-family: 'Times New Roman', Times, serif;
  }
  .iq-certificate-signature {
    display: block;
    width: 100%;
    max-width: 180px;
    height: 44px;
    object-fit: contain;
    position: relative;
    z-index: 1;
    margin: -24px auto 6px;
    background: transparent;
    mix-blend-mode: multiply;
    filter: contrast(1.12) saturate(0.9);
  }
`;

const formatFooterIssueDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';

  const month = parsed.toLocaleDateString('en-US', { month: 'long' });
  const day = String(parsed.getDate()).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${month} ${day}, ${year}`;
};

const formatPsychologistSpecialization = (specialization?: string) => {
  const trimmedSpecialization = specialization?.trim();
  if (!trimmedSpecialization) return 'Certified Psychologist';

  const titleCasedSpecialization = trimmedSpecialization
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return titleCasedSpecialization.endsWith('Psychologist')
    ? titleCasedSpecialization
    : `${titleCasedSpecialization} Psychologist`;
};

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

const formatIQTestType = (testType?: string) => {
  switch (testType) {
    case 'weschler_intelligence_test':
      return 'Weschler Intelligence Test';
    case 'culture_fair_intelligence_test':
      return 'Culture Fair Intelligence Test';
    default:
      return testType?.trim() || 'Culture Fair Intelligence Test';
  }
};

const waitForNextPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

const waitForFonts = async () => {
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness failures and continue with export.
    }
  }
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to convert image blob to data URL.'));
    };
    reader.onerror = () => reject(new Error('Unable to read image blob.'));
    reader.readAsDataURL(blob);
  });

const resolveExportImageSource = async (src?: string) => {
  if (!src) return '';

  if (/^(data:|blob:)/i.test(src)) {
    return src;
  }

  if (!/^https?:\/\//i.test(src)) {
    return src;
  }

  try {
    const response = await fetch(src, { credentials: 'omit' });
    if (!response.ok) {
      return src;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return src;
    }

    const imageBlob = await response.blob();
    if (!imageBlob.type.toLowerCase().startsWith('image/')) {
      return src;
    }

    return await blobToDataUrl(imageBlob);
  } catch {
    return src;
  }
};

const waitForImages = async (container: HTMLElement) => {
  const images = Array.from(container.querySelectorAll('img'));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          const complete = () => {
            if (typeof image.decode === 'function') {
              image.decode().catch(() => undefined).finally(() => resolve());
              return;
            }
            resolve();
          };

          if (image.complete) {
            complete();
            return;
          }

          image.addEventListener('load', complete, { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
};

const buildCertificateFilename = (certificateId: string) => {
  const safeId = certificateId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `IQ_Certificate_${safeId || 'download'}.pdf`;
};

const prepareCertificateForExport = async (
  certificate: IQCertificateData,
): Promise<IQCertificateData> => ({
  ...certificate,
  psychologistSignatureImage: await resolveExportImageSource(
    certificate.psychologistSignatureImage,
  ),
});

function IQCertificateDocument({ certificate }: { certificate: IQCertificateData }) {
  return (
    <>
      <style>{`${CERTIFICATE_FONT_IMPORT}
${CERTIFICATE_EXPORT_STYLES}`}</style>
      <div className='iq-certificate-export' data-iq-certificate-root='true'>
        <img
          src={CERTIFICATE_BORDER_ASSET_PATH}
          alt=''
          aria-hidden='true'
          crossOrigin='anonymous'
          className='iq-certificate-border'
        />
        <div className='iq-certificate-shell'>
          <div className='iq-certificate-brand'>
            <img
              src={CERTIFICATE_LOGO_ASSET_PATH}
              alt='CerebroLearn'
              crossOrigin='anonymous'
              className='iq-certificate-brand-logo'
            />
          </div>
          <div className='iq-certificate-main'>
            <div className='iq-certificate-title'>
              <p className='iq-certificate-heading'>INTELLIGENT QUOTIENT CERTIFICATE</p>
              <p className='iq-certificate-subheading'>Issued to:</p>
            </div>
            <div className='iq-certificate-content'>
              <div className='iq-certificate-student'>{certificate.studentName}</div>
              <p className='iq-certificate-description'>
                for successfully completing the{' '}
                <span style={{ color: BRAND_COLOR, fontWeight: 700 }}>
                  {formatIQTestType(certificate.testType)}
                </span>{' '}
                -
                <br />
                with a certified Psychologist Cognitive Growth Edition with the
                following score
              </p>
              {!certificate.cognitiveProfile && (
                <div className='iq-certificate-score-wrap'>
                  <div className='iq-certificate-score-label'>Official IQ Score</div>
                  <div className='iq-certificate-score-value'>{certificate.iqScore}</div>
                </div>
              )}
            </div>
            {certificate.cognitiveProfile && (
              <div className='iq-certificate-kpi-row'>
                <div className='iq-certificate-kpi-col'>
                  <div className='iq-certificate-kpi-label'>Pattern Recognition</div>
                  <div className='iq-certificate-kpi-value'>{certificate.cognitiveProfile.pattern_recognition}</div>
                </div>
                <div className='iq-certificate-kpi-col'>
                  <div className='iq-certificate-kpi-label'>Verbal Intelligence</div>
                  <div className='iq-certificate-kpi-value'>{certificate.cognitiveProfile.verbal_intelligence}</div>
                </div>
                <div className='iq-certificate-kpi-col iq-certificate-kpi-col--highlight'>
                  <div className='iq-certificate-kpi-label'>IQ Score</div>
                  <div className='iq-certificate-kpi-value'>{certificate.iqScore}</div>
                </div>
                <div className='iq-certificate-kpi-col'>
                  <div className='iq-certificate-kpi-label'>Spatial Reasoning</div>
                  <div className='iq-certificate-kpi-value'>{certificate.cognitiveProfile.spatial_reasoning}</div>
                </div>
                <div className='iq-certificate-kpi-col'>
                  <div className='iq-certificate-kpi-label'>Processing Speed</div>
                  <div className='iq-certificate-kpi-value'>{certificate.cognitiveProfile.processing_speed}</div>
                </div>
              </div>
            )}
            <img
              src={CERTIFICATE_WRAPPER_ASSET_PATH}
              alt=''
              aria-hidden='true'
              crossOrigin='anonymous'
              className='iq-certificate-wrapper'
            />
          </div>
          <div className='iq-certificate-footer'>
            <div className='iq-certificate-footer-col'>
              <div className='iq-certificate-footer-label'>Date of issuance</div>
              <div className='iq-certificate-footer-value'>
                {formatFooterIssueDate(certificate.issuedAt)}
              </div>
            </div>
            <div className='iq-certificate-footer-col'>
              <div className='iq-certificate-footer-line' />
              {certificate.psychologistSignatureImage ? (
                <img
                  src={certificate.psychologistSignatureImage}
                  alt='Psychologist signature'
                  className='iq-certificate-signature'
                />
              ) : null}
              <div className='iq-certificate-footer-value'>{certificate.psychologistName}</div>
              <div className='iq-certificate-footer-subvalue'>
                {formatPsychologistSpecialization(certificate.psychologistSpecialization)}
              </div>
            </div>
            <div className='iq-certificate-footer-col'>
              <div className='iq-certificate-footer-label'>Certificate ID</div>
              <div className='iq-certificate-footer-value'>{certificate.certificateId}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const downloadIQCertificate = async (certificate: IQCertificateData) => {
  const mountNode = document.createElement('div');
  mountNode.style.cssText = `position:fixed;left:-200vw;top:0;width:${CERTIFICATE_EXPORT_WIDTH}px;height:${CERTIFICATE_EXPORT_HEIGHT}px;pointer-events:none;opacity:0;overflow:hidden;`;
  document.body.appendChild(mountNode);

  const root = createRoot(mountNode);

  try {
    const exportCertificate = await prepareCertificateForExport(certificate);
    root.render(<IQCertificateDocument certificate={exportCertificate} />);

    await waitForNextPaint();
    await waitForFonts();
    await waitForImages(mountNode);
    await waitForNextPaint();

    const certificateElement = mountNode.querySelector<HTMLElement>(
      '[data-iq-certificate-root="true"]',
    );

    if (!certificateElement) {
      throw new Error('Unable to render the certificate for download.');
    }

    const canvas = await html2canvas(certificateElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      imageTimeout: 15000,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      PDF_PAGE_WIDTH_MM,
      PDF_PAGE_HEIGHT_MM,
      undefined,
      'FAST',
    );

    const pdfBlob = pdf.output('blob');
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = buildCertificateFilename(certificate.certificateId);
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60_000);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Unable to generate the certificate download.');
  } finally {
    root.unmount();
    mountNode.remove();
  }
};

function IQCertificatePreview({ certificate }: { certificate: IQCertificateData }) {
  return (
    <>
      <style>{`${CERTIFICATE_FONT_IMPORT}
${CERTIFICATE_EXPORT_STYLES}`}</style>
      <div style={{ display: 'inline-block', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)' }}>
        <IQCertificateDocument certificate={certificate} />
      </div>
    </>
  );
}

export { IQCertificatePreview };
