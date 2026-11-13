import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportPdfOptions {
  filename?: string;
  candidateName?: string;
  footerLabel?: string;
  onProgress?: (stage: string) => void;
}

export interface ExportPdfResult {
  success: boolean;
  filename: string;
  pageCount: number;
  error?: string;
}

/**
 * Converts modern CSS color functions (oklch, oklab, color-mix, etc.) used by Tailwind v4
 * into standard rgba(...) strings using an offscreen 1x1 2D canvas so html2canvas 1.4.x
 * can parse every computed style without throwing an unsupported color error.
 */
function createColorResolver() {
  const cache = new Map<string, string>();
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  return (colorValue: string): string => {
    if (!colorValue || colorValue === 'none' || colorValue === 'transparent') {
      return colorValue;
    }
    const needsConversion =
      colorValue.includes('oklch') ||
      colorValue.includes('oklab') ||
      colorValue.includes('color-mix') ||
      colorValue.includes('lab(') ||
      colorValue.includes('lch(');

    if (!needsConversion) {
      return colorValue;
    }

    const cached = cache.get(colorValue);
    if (cached) return cached;

    if (!ctx) return 'rgb(15, 23, 42)';

    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorValue;
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const alpha = +(data[3] / 255).toFixed(3);
      const rgba =
        alpha === 1
          ? `rgb(${data[0]}, ${data[1]}, ${data[2]})`
          : `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${alpha})`;
      cache.set(colorValue, rgba);
      return rgba;
    } catch {
      return 'rgb(15, 23, 42)';
    }
  };
}

/**
 * Replaces oklch/oklab/color-mix tokens inside CSS boxShadow or gradient strings.
 */
function sanitizeComplexCssValue(value: string, resolveColor: (c: string) => string): string {
  if (
    !value ||
    (!value.includes('oklch') && !value.includes('oklab') && !value.includes('color-mix'))
  ) {
    return value;
  }

  // Replace standalone oklch(...), oklab(...), or color-mix(...) expressions
  return value.replace(/(?:oklch|oklab|color-mix)\([^()]*(?:\([^()]*\)[^()]*)*\)/g, (match) =>
    resolveColor(match)
  );
}

/**
 * Exports a DOM element representing a clean A4 preview to a formatted PDF
 * using html2canvas and jsPDF.
 */
export async function exportA4ElementToPdf(
  element: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<ExportPdfResult> {
  const candidate = (options.candidateName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = options.filename || `${candidate}_Report_A4.pdf`;
  const footerLabel = options.footerLabel || 'JobReady AI • Resume Analysis Report';

  try {
    options.onProgress?.('Preparing clean A4 document...');

    // Standard A4 dimensions in millimeters (ISO 216)
    const a4WidthMm = 210;
    const a4HeightMm = 297;

    options.onProgress?.('Rendering high-resolution A4 canvas...');

    const resolveColor = createColorResolver();
    const captureId = `pdf-capture-${Date.now()}`;
    element.setAttribute('data-pdf-capture-root', captureId);

    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: Math.max(element.scrollWidth, 794),
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.querySelector(`[data-pdf-capture-root="${captureId}"]`) as HTMLElement | null;
          if (!clonedRoot) return;

          // Hide elements marked to ignore
          const ignores = clonedRoot.querySelectorAll('[data-html2canvas-ignore="true"]');
          ignores.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });

          // Remove any CSS transform zoom scaling on ancestors so A4 capture is unscaled 1:1
          let parent = clonedRoot.parentElement;
          while (parent) {
            if (parent.style?.transform) {
              parent.style.transform = 'none';
            }
            parent = parent.parentElement;
          }

          // Normalize Tailwind v4 oklch/oklab/color-mix computed styles to rgb/rgba
          const allElements = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll('*'))] as HTMLElement[];
          const win = clonedDoc.defaultView || window;

          for (const el of allElements) {
            const computed = win.getComputedStyle(el);
            if (!computed) continue;

            const colorProps = [
              'color',
              'backgroundColor',
              'borderTopColor',
              'borderRightColor',
              'borderBottomColor',
              'borderLeftColor',
              'outlineColor',
              'textDecorationColor',
              'fill',
              'stroke',
            ] as const;

            for (const prop of colorProps) {
              const val = computed[prop];
              if (
                val &&
                (val.includes('oklch') || val.includes('oklab') || val.includes('color-mix'))
              ) {
                el.style[prop] = resolveColor(val);
              }
            }

            if (
              computed.backgroundImage &&
              computed.backgroundImage !== 'none' &&
              (computed.backgroundImage.includes('oklch') ||
                computed.backgroundImage.includes('oklab') ||
                computed.backgroundImage.includes('color-mix'))
            ) {
              el.style.backgroundImage = sanitizeComplexCssValue(
                computed.backgroundImage,
                resolveColor
              );
            }

            if (
              computed.boxShadow &&
              computed.boxShadow !== 'none' &&
              (computed.boxShadow.includes('oklch') ||
                computed.boxShadow.includes('oklab') ||
                computed.boxShadow.includes('color-mix'))
            ) {
              el.style.boxShadow = sanitizeComplexCssValue(computed.boxShadow, resolveColor);
            }
          }
        },
      });
    } finally {
      element.removeAttribute('data-pdf-capture-root');
    }

    options.onProgress?.('Formatting A4 pages in jsPDF...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = a4WidthMm;
    const imgHeight = (canvas.height * a4WidthMm) / canvas.width;

    // Reserve clean bottom margin for footer on multi-page splits
    const usablePageHeightMm = a4HeightMm - 10;
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 1;

    // First A4 page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= usablePageHeightMm;

    // Subsequent A4 pages if content exceeds 1 sheet
    while (heightLeft > 4) {
      position -= usablePageHeightMm;
      pdf.addPage();
      pageCount++;
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= usablePageHeightMm;
    }

    // Paint clean white footer strip and page numbering on each page
    for (let p = 1; p <= pageCount; p++) {
      pdf.setPage(p);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, a4HeightMm - 10, a4WidthMm, 10, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.line(12, a4HeightMm - 10, a4WidthMm - 12, a4HeightMm - 10);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `${footerLabel}  •  Page ${p} of ${pageCount}`,
        a4WidthMm / 2,
        a4HeightMm - 4.5,
        { align: 'center' }
      );
    }

    options.onProgress?.('Saving PDF document...');
    pdf.save(filename);

    return {
      success: true,
      filename,
      pageCount,
    };
  } catch (error: any) {
    console.error('Failed to export PDF using html2canvas and jsPDF:', error);
    return {
      success: false,
      filename,
      pageCount: 0,
      error: error?.message || 'Failed to generate PDF',
    };
  }
}
