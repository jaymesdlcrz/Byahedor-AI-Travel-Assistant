import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TripPlan, ChecklistCategory } from '../types';

// Philippine-inspired color palette for PDF design
const COLORS = {
  navy: [16, 42, 67] as [number, number, number],       // #102A43 Primary Dark
  teal: [8, 126, 164] as [number, number, number],      // #087EA4 Brand Accent
  amber: [255, 184, 77] as [number, number, number],    // #FFB84D Sunshine
  emerald: [57, 169, 107] as [number, number, number],  // #39A96B Tropical Green
  slate: [98, 125, 152] as [number, number, number],    // #627D98 Body Muted
  charcoal: [36, 59, 83] as [number, number, number],   // #243B53 Body Text
  lightBg: [248, 250, 252] as [number, number, number], // #F8FAFC
  border: [226, 232, 240] as [number, number, number],  // #E2E8F0
};

/**
 * Exports a full TripPlan as a beautifully formatted PDF document.
 */
export function exportTripPlanPdf(plan: TripPlan): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Helper to add header banner
  const addHeader = () => {
    // Header gradient line
    doc.setFillColor(...COLORS.teal);
    doc.rect(margin, 10, contentWidth, 2, 'F');
    doc.setFillColor(...COLORS.amber);
    doc.rect(margin + contentWidth * 0.7, 10, contentWidth * 0.3, 2, 'F');

    // Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.navy);
    doc.text('BYAHEDOR', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slate);
    doc.text('PHILIPPINE ARCHIPELAGO TRAVEL CONCIERGE', margin + 37, 17.5);

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slate);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth - margin, 18, { align: 'right' });

    // Thin separator
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, 21, pageWidth - margin, 21);
  };

  // Add initial header
  addHeader();

  // Trip Title & Destination
  let currentY = 27;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.navy);
  const titleLines = doc.splitTextToSize(plan.title || `${plan.destination} Itinerary`, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 6 + 1;

  // Trip Metadata Badges Box
  doc.setFillColor(...COLORS.lightBg);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.teal);
  doc.text('DESTINATION', margin + 4, currentY + 4.5);
  doc.text('DURATION', margin + 45, currentY + 4.5);
  doc.text('TRAVELERS', margin + 85, currentY + 4.5);
  doc.text('TOTAL BUDGET (EST.)', margin + 125, currentY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.navy);
  doc.text(plan.destination, margin + 4, currentY + 10);
  doc.text(`${plan.days} Days`, margin + 45, currentY + 10);
  doc.text(`${plan.travelers} ${plan.travelers === 1 ? 'Traveler' : 'Travelers'}`, margin + 85, currentY + 10);
  doc.text(`PHP ${plan.totalBudget.toLocaleString()}`, margin + 125, currentY + 10);

  currentY += 19;

  // Overview section
  if (plan.overview) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.navy);
    doc.text('Journey Overview', margin, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.charcoal);
    const overviewLines = doc.splitTextToSize(plan.overview, contentWidth);
    doc.text(overviewLines, margin, currentY);
    currentY += overviewLines.length * 4.2 + 4;
  }

  // Budget Breakdown Table
  if (plan.budgetBreakdown) {
    const total = plan.totalBudget || 1;
    const b = plan.budgetBreakdown;
    
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Budget Category', 'Estimated Allocation (PHP)', 'Share of Budget', 'Local Planning Notes']],
      body: [
        ['Transportation', `PHP ${b.transportation.toLocaleString()}`, `${Math.round((b.transportation / total) * 100)}%`, 'Flights, RORO/fast-craft ferries, tricycles & habal-habal'],
        ['Accommodation', `PHP ${b.accommodation.toLocaleString()}`, `${Math.round((b.accommodation / total) * 100)}%`, 'Island homestays, boutique resorts or beach hostels'],
        ['Food & Dining', `PHP ${b.food.toLocaleString()}`, `${Math.round((b.food / total) * 100)}%`, 'Regional carinderias, fresh seafood dampa & seaside cafes'],
        ['Activities & Tours', `PHP ${b.activities.toLocaleString()}`, `${Math.round((b.activities / total) * 100)}%`, 'Accredited DOT guides, boat tours & marine sanctuary fees'],
        ['Emergency Buffer', `PHP ${b.emergency.toLocaleString()}`, `${Math.round((b.emergency / total) * 100)}%`, 'Weather delay contingency, pharmacy & rural cash reserve'],
      ],
      headStyles: {
        fillColor: COLORS.navy,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'left',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: COLORS.charcoal,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 38 },
        1: { cellWidth: 42, fontStyle: 'bold', textColor: COLORS.teal },
        2: { cellWidth: 28, halign: 'center' },
        3: { cellWidth: 'auto' },
      },
      theme: 'grid',
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;
  }

  // Day-by-day Itinerary
  if (plan.daysPlan && plan.daysPlan.length > 0) {
    plan.daysPlan.forEach((day) => {
      // Check if we need a new page
      if (currentY > pageHeight - 45) {
        doc.addPage();
        addHeader();
        currentY = 27;
      }

      // Day Header Banner
      doc.setFillColor(...COLORS.teal);
      doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`DAY ${day.dayNumber}: ${day.theme.toUpperCase()}`, margin + 4, currentY + 4.8);

      currentY += 9;

      const activitiesBody = day.activities.map((act) => [
        act.time || '—',
        act.activity || '',
        act.location || '—',
        act.duration || '—',
        act.estimatedCostPHP ? `PHP ${act.estimatedCostPHP.toLocaleString()}` : 'Free / Included',
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Time', 'Activity & Details', 'Location', 'Duration', 'Est. Cost']],
        body: activitiesBody,
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: COLORS.navy,
          fontSize: 7.5,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8,
          textColor: COLORS.charcoal,
          cellPadding: 2.2,
        },
        columnStyles: {
          0: { cellWidth: 24, fontStyle: 'bold', textColor: COLORS.teal },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 32, textColor: COLORS.slate },
          3: { cellWidth: 22, halign: 'center' },
          4: { cellWidth: 28, halign: 'right', fontStyle: 'bold', textColor: COLORS.emerald },
        },
        theme: 'striped',
      });

      currentY = (doc as any).lastAutoTable.finalY + 6;
    });
  }

  // Local Insider & Safety Tips Section
  if (plan.localTips && plan.localTips.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      addHeader();
      currentY = 27;
    }

    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(251, 191, 36);  // amber-400
    doc.roundedRect(margin, currentY, contentWidth, 6 + plan.localTips.length * 5, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('BYAHEDOR LOCAL INSIDER & ISLAND SAFETY NOTES', margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 53, 15);
    let tipY = currentY + 9;
    plan.localTips.forEach((tip) => {
      const bullet = `• ${tip}`;
      const lines = doc.splitTextToSize(bullet, contentWidth - 8);
      doc.text(lines, margin + 4, tipY);
      tipY += lines.length * 4;
    });

    currentY = tipY + 4;
  }

  // Add Footers with Page Numbers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.slate);
    doc.text('Byahedor • Sustainable Philippine Tourism • Leave No Trace (LNT)', margin, pageHeight - 6.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  }

  // Generate file name & trigger download
  const safeDest = (plan.destination || 'Archipelago').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Byahedor_${safeDest}_Itinerary.pdf`);
}

/**
 * Exports the packing checklist as a styled PDF document.
 */
export function exportChecklistPdf(
  categories: ChecklistCategory[],
  percentComplete: number,
  destinationName?: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Add header
  const addHeader = () => {
    doc.setFillColor(...COLORS.teal);
    doc.rect(margin, 10, contentWidth, 2, 'F');
    doc.setFillColor(...COLORS.emerald);
    doc.rect(margin + contentWidth * 0.75, 10, contentWidth * 0.25, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.navy);
    doc.text('BYAHEDOR', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slate);
    doc.text('SMART PHILIPPINE TRAVEL PACKING CHECKLIST', margin + 37, 17.5);

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slate);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth - margin, 18, { align: 'right' });

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, 21, pageWidth - margin, 21);
  };

  addHeader();

  let currentY = 27;

  // Title & Destination Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.navy);
  const checklistTitle = destinationName 
    ? `Packing Checklist tailored for ${destinationName}`
    : 'Essential Philippine Archipelago Packing Checklist';
  doc.text(checklistTitle, margin, currentY);
  currentY += 6;

  // Progress Bar Summary Card
  const allItems = categories.flatMap(c => c.items);
  const packedCount = allItems.filter(i => i.isChecked).length;
  const totalCount = allItems.length;

  doc.setFillColor(...COLORS.lightBg);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, currentY, contentWidth, 13, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navy);
  doc.text(`PACKING STATUS: ${packedCount} of ${totalCount} Items Packed (${percentComplete}%)`, margin + 4, currentY + 5.5);

  // Mini visual progress bar
  const barWidth = contentWidth - 8;
  const fillWidth = (barWidth * Math.min(Math.max(percentComplete, 0), 100)) / 100;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(margin + 4, currentY + 7.5, barWidth, 3, 1, 1, 'F');
  if (fillWidth > 0) {
    doc.setFillColor(...COLORS.emerald);
    doc.roundedRect(margin + 4, currentY + 7.5, fillWidth, 3, 1, 1, 'F');
  }

  currentY += 18;

  // Categories & Items
  categories.forEach((cat) => {
    if (currentY > pageHeight - 35) {
      doc.addPage();
      addHeader();
      currentY = 27;
    }

    // Category Header
    doc.setFillColor(...COLORS.navy);
    doc.roundedRect(margin, currentY, contentWidth, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    const catPacked = cat.items.filter(i => i.isChecked).length;
    doc.text(`${cat.name.toUpperCase()} (${catPacked}/${cat.items.length})`, margin + 4, currentY + 4.2);

    currentY += 7.5;

    const tableRows = cat.items.map((item) => [
      item.isChecked ? '[ X ] Packed' : '[    ] To Pack',
      item.label,
      item.isEssential ? 'Essential' : 'Standard',
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Status', 'Packing Item', 'Priority']],
      body: tableRows,
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: COLORS.navy,
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: COLORS.charcoal,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 26, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          if (data.column.index === 0) {
            const val = String(data.cell.raw);
            if (val.includes('Packed')) {
              data.cell.styles.textColor = COLORS.emerald;
            } else {
              data.cell.styles.textColor = COLORS.slate;
            }
          }
          if (data.column.index === 2) {
            const val = String(data.cell.raw);
            if (val === 'Essential') {
              data.cell.styles.textColor = [225, 29, 72]; // rose-600
            } else {
              data.cell.styles.textColor = COLORS.slate;
            }
          }
        }
      },
      theme: 'grid',
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;
  });

  // Philippine Travel Packing Reminders Box
  if (currentY > pageHeight - 35) {
    doc.addPage();
    addHeader();
    currentY = 27;
  }

  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, currentY, contentWidth, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text('ARCHIPELAGO COMMUTER & ISLAND-HOPPING ESSENTIALS', margin + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(4, 120, 87);
  doc.text('• Physical Cash (PHP ₱): Rural island tricycles, environmental user fees (EUF), and boat port terminals rarely take cards.', margin + 4, currentY + 8.5);
  doc.text('• Reef-Safe Sunscreen: Oxybenzone-free to protect coral gardens in Palawan, Apo Island, Boracay, and Bohol.', margin + 4, currentY + 12.5);
  doc.text('• Waterproof Dry Bag: Protect passport, electronics, and power bank during motorized bangka spray and open sea crossings.', margin + 4, currentY + 16.5);

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.slate);
    doc.text('Byahedor • Sustainable Philippine Tourism • Leave No Trace (LNT)', margin, pageHeight - 6.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  }

  const safeName = (destinationName || 'Archipelago').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Byahedor_${safeName}_Packing_Checklist.pdf`);
}
