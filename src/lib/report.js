import jsPDF from 'jspdf';
import { formatValue, percentError } from './utils.js';

function addWrapped(doc, text, x, y, width, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function exportLabReport({ experiment, controls, readings, result }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('UPES Physics Virtual Lab Simulator', margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(experiment.title, margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y = addWrapped(doc, `Aim: ${experiment.aim}`, margin, y, pageWidth - margin * 2);
  y += 3;
  y = addWrapped(doc, `Theory: ${experiment.theory}`, margin, y, pageWidth - margin * 2);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('Controls', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  Object.entries(controls).forEach(([key, value]) => {
    y = addWrapped(doc, `${key}: ${value}`, margin, y, pageWidth - margin * 2, 5);
  });
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Observation Table', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');

  if (!readings.length) {
    doc.text('No readings captured yet.', margin, y);
    y += 6;
  } else {
    const columns = experiment.observationColumns;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    columns.slice(0, 5).forEach((column, index) => {
      doc.text(column.label.slice(0, 22), margin + index * 36, y);
    });
    y += 5;
    doc.setFont('helvetica', 'normal');

    readings.slice(0, 12).forEach((reading) => {
      columns.slice(0, 5).forEach((column, index) => {
        const value = column.format
          ? column.format(reading[column.key])
          : formatValue(reading[column.key], column.unit, column.digits ?? 3);
        doc.text(String(value).slice(0, 22), margin + index * 36, y);
      });
      y += 5;
      if (y > 275) {
        doc.addPage();
        y = 16;
      }
    });
  }

  y += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Final Result', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');

  const error = result?.reference ? percentError(result.value, result.reference) : null;
  y = addWrapped(
    doc,
    `${result.label}: ${formatValue(result.value, result.unit, 4)}${
      error === null ? '' : ` | Error: ${error.toFixed(2)} percent`
    }`,
    margin,
    y,
    pageWidth - margin * 2
  );

  if (result.details?.length) {
    result.details.forEach((detail) => {
      y = addWrapped(doc, detail, margin, y + 1, pageWidth - margin * 2, 5);
    });
  }

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 288);
  doc.save(`${experiment.title.replaceAll(' ', '-')}-lab-report.pdf`);
}
