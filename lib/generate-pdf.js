"use client"

import jsPDF from "jspdf"
import 'jspdf-autotable'

// Function to generate test drive PDF
export const generateTestDrivePDF = (testDrive) => {
  const doc = new jsPDF()

  // Add Kia logo
  doc.setFontSize(22)
  doc.setTextColor(232, 0, 0) // Kia red
  doc.text("KIA", 105, 20, { align: "center" })

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("Test Drive Confirmation", 105, 30, { align: "center" })

  // Add booking details
  doc.setFontSize(12)
  doc.text(`Booking ID: TD${testDrive.id.toString().padStart(6, "0")}`, 20, 50)
  doc.text(`Date: ${testDrive.bookingDate}`, 20, 60)
  doc.text(`Time: ${testDrive.bookingTime}`, 20, 70)

  // Add vehicle details
  doc.setFontSize(14)
  doc.text("Vehicle Details", 20, 90)

  doc.setFontSize(12)
  doc.text(`Vehicle: ${testDrive.vehicleName}`, 20, 100)

  // Add dealer details
  doc.setFontSize(14)
  doc.text("Dealer Information", 20, 120)

  doc.setFontSize(12)
  doc.text(`Dealer: ${testDrive.dealerName}`, 20, 130)
  doc.text(`Address: ${testDrive.dealerAddress}`, 20, 140)

  // Add instructions
  doc.setFontSize(14)
  doc.text("Important Information", 20, 170)

  doc.setFontSize(10)
  doc.text("1. Please arrive 10 minutes before your scheduled time.", 20, 180)
  doc.text("2. Bring your valid driving license and ID proof.", 20, 190)
  doc.text("3. The test drive will last approximately 30 minutes.", 20, 200)
  doc.text("4. For any changes or cancellations, please contact us at least 4 hours in advance.", 20, 210)

  // Add footer
  doc.setFontSize(10)
  doc.text("Thank you for choosing Kia Motors.", 105, 270, { align: "center" })
  doc.text("For any queries, please call our customer care at 1800-XXX-XXXX", 105, 280, { align: "center" })

  return doc
}

// Function to generate quote PDF
export const generateQuotePDF = (quote) => {
  const doc = new jsPDF();
  
  // Add Kia logo
  doc.setFontSize(22);
  doc.setTextColor(232, 0, 0); // Kia red
  doc.text("KIA", 105, 20, { align: "center" });

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("Vehicle Price Quote", 105, 30, { align: "center" })

  // Add quote details
  doc.setFontSize(12)
  doc.text(`Quote ID: QR${quote.id.toString().padStart(6, "0")}`, 20, 50)
  doc.text(`Date: ${quote.requestDate}`, 20, 60)
  doc.text(`Valid Until: ${quote.validUntil || "N/A"}`, 20, 70)

  // Add vehicle details
  doc.setFontSize(14)
  doc.text("Vehicle Details", 20, 90)

  doc.setFontSize(12)
  doc.text(`Vehicle: ${quote.vehicleName}`, 20, 100)
  doc.text(`Variant: ${quote.variant}`, 20, 110)
  doc.text(`Color: ${quote.color}`, 20, 120)

  // Add price details
  doc.setFontSize(14)
  doc.text("Price Details", 20, 140)

  // Calculate total price first
  const totalPrice = quote.quotedPrice ? quote.quotedPrice + quote.quotedPrice * 0.2 : 0

  // Create table for price breakdown
  const priceData = [
    ["Ex-showroom Price", formatPrice(quote.quotedPrice || 0)],
    ["Registration", formatPrice(quote.quotedPrice ? quote.quotedPrice * 0.1 : 0)],
    ["Insurance", formatPrice(quote.quotedPrice ? quote.quotedPrice * 0.05 : 0)],
    ["Accessories", formatPrice(quote.quotedPrice ? quote.quotedPrice * 0.03 : 0)],
    ["Other Charges", formatPrice(quote.quotedPrice ? quote.quotedPrice * 0.02 : 0)],
    ["Total Price (On-Road)", formatPrice(totalPrice)]
  ];

  // Replace empty values with "-"
  const sanitizedPriceData = priceData.map(row => 
    row.map(cell => cell || "-")
  );

  // Manual table drawing
  const startY = 150;
  const cellWidth = 85;
  const cellHeight = 10;
  let currentY = startY;

  // Draw headers
  doc.setFillColor(232, 0, 0);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, currentY, cellWidth, cellHeight, 'F');
  doc.rect(20 + cellWidth, currentY, cellWidth, cellHeight, 'F');
  doc.text("Description", 25, currentY + 7);
  doc.text("Amount", 25 + cellWidth, currentY + 7);
  
  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  currentY += cellHeight;

  // Draw content rows
  sanitizedPriceData.forEach((row, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, currentY, cellWidth * 2, cellHeight, 'F');
    }
    doc.text(row[0], 25, currentY + 7);
    doc.text(row[1], 25 + cellWidth, currentY + 7);
    currentY += cellHeight;
  });

  // Update the dealer details position
  doc.setFontSize(14);
  doc.text("Dealer Information", 20, currentY + 20);

  doc.setFontSize(12);
  doc.text(`Dealer: ${quote.dealerName}`, 20, currentY + 30);

  // Add notes if present
  if (quote.notes) {
    doc.setFontSize(14);
    doc.text("Notes:", 20, currentY + 45);

    doc.setFontSize(10);
    doc.text(quote.notes, 20, currentY + 60);
  }

  // Add disclaimer
  doc.setFontSize(8)
  doc.text(
    "Disclaimer: This quote is an estimate and may vary. Final price will be confirmed at the time of purchase.",
    20,
    270,
  )

  // Add footer
  doc.setFontSize(10)
  doc.text("Thank you for choosing Kia Motors.", 105, 280, { align: "center" })

  return doc
}

// Helper function to format price
function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}
