
import { InvoiceData, BusinessProfile } from './types';

/**
 * Compresses an image file to a smaller JPEG to prevent localStorage overflow.
 * Max width: 800px, Quality: 0.6
 */
export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); 
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Generates and triggers a download of the Tax Report CSV.
 */
export const downloadTaxReport = (invoices: InvoiceData[], year: number) => {
  const filteredInvoices = invoices.filter(i => i.date.startsWith(year.toString()));
  
  const headers = ["Invoice Number", "Date", "Client", "Subtotal", "Tax Rate", "Tax Amount", "Total", "Status"];
  const rows = filteredInvoices.map(inv => {
    const subtotal = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const tax = subtotal * (inv.taxRate / 100);
    return [
      inv.number,
      inv.date,
      `"${inv.client.companyName || inv.client.name}"`, // Quote to handle commas in names
      subtotal.toFixed(2),
      `${inv.taxRate}%`,
      tax.toFixed(2),
      (subtotal + tax).toFixed(2),
      inv.status
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Tax_Report_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formats a currency amount based on locale.
 */
export const formatCurrency = (amount: number, currency: string, locale: string) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};
