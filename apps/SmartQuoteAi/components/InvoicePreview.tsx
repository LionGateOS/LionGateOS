import React, { useRef, useState } from 'react';
import { BusinessProfile, InvoiceData } from '../types';
import { PenTool, Eraser, Save } from 'lucide-react';

interface InvoicePreviewProps {
  business: BusinessProfile;
  invoice: InvoiceData;
  onSign?: (signatureData: string) => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ business, invoice, onSign }) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const amountPaid = (invoice.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  
  const taxableAmount = invoice.items
    .filter(item => item.taxable !== false)
    .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const taxAmount = taxableAmount * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;
  const balanceDue = Math.max(0, total - amountPaid);


  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(business.locale, {
      style: 'currency',
      currency: invoice.currency || business.currency
    }).format(amount);
  };

  const font = business.design?.font || 'Inter';
  const logoSize = business.design?.logoSize || 80;
  const align = business.design?.alignment || 'left';
  const headerColor = business.design?.headerColor || '#1e293b';

  const getFontClass = (fontName: string) => {
    switch(fontName) {
      case 'Roboto Slab': return 'font-roboto-slab';
      case 'Playfair Display': return 'font-playfair';
      case 'Montserrat': return 'font-montserrat';
      case 'Oswald': return 'font-oswald';
      case 'Dancing Script': return 'font-dancing';
      default: return 'font-sans';
    }
  };

  // Signature Canvas Logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as React.MouseEvent).clientX ? (e as React.MouseEvent).clientX - rect.left : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = (e as React.MouseEvent).clientY ? (e as React.MouseEvent).clientY - rect.top : (e as React.TouchEvent).touches[0].clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as React.MouseEvent).clientX ? (e as React.MouseEvent).clientX - rect.left : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = (e as React.MouseEvent).clientY ? (e as React.MouseEvent).clientY - rect.top : (e as React.TouchEvent).touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveSignature = () => {
     if (canvasRef.current && onSign) {
        onSign(canvasRef.current.toDataURL());
        setIsSigning(false);
     }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-white shadow-lg print-shadow-none min-h-[29.7cm] w-full md:w-[21cm] mx-auto p-4 md:p-12 text-slate-800 relative flex flex-col">
      
      {/* Header */}
      <div className={`flex justify-between items-start mb-6 md:mb-12 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className={`${align === 'center' ? 'w-full text-center flex flex-col items-center' : 'max-w-[60%] text-left'}`}>
          {business.logoUrl ? (
            <img 
              src={business.logoUrl} 
              alt="Business Logo" 
              className="object-contain mb-4"
              style={{ height: `${logoSize}px` }}
            />
          ) : (
            <div className="h-12"></div>
          )}
          
          <h1 
            className={`text-2xl md:text-3xl font-bold mb-2 uppercase tracking-tight ${getFontClass(font)}`}
            style={{ color: headerColor }}
          >
            {business.name || 'Your Company'}
          </h1>
          
          <div className="text-xs md:text-sm text-slate-600 space-y-1">
            <p>{business.address}</p>
            <p>{business.email}</p>
            <p>{business.phone}</p>
            <p>{business.website}</p>
          </div>
        </div>

        {align !== 'center' && (
          <div className={`text-right ${align === 'right' ? 'text-left' : ''}`}>
            <h2 className="text-2xl md:text-4xl font-light text-slate-300 uppercase tracking-widest mb-4">Invoice</h2>
            <div className="text-xs md:text-sm space-y-1">
              <p><span className="font-semibold text-slate-900">Invoice #:</span> {invoice.number}</p>
              <p><span className="font-semibold text-slate-900">Date:</span> {invoice.date}</p>
              <p><span className="font-semibold text-slate-900">Due Date:</span> {invoice.dueDate}</p>
              <div className="mt-4 inline-block border-2 border-slate-200 text-slate-400 px-3 py-1 text-xs font-bold uppercase rounded tracking-widest no-print">
                Status: {invoice.status}
              </div>
            </div>
          </div>
        )}
      </div>

      {align === 'center' && (
        <div className="flex justify-between items-end border-b border-slate-100 pb-6 mb-8">
          <div className="text-left">
            <h2 className="text-2xl font-light text-slate-400 uppercase tracking-widest">Invoice</h2>
          </div>
          <div className="text-right text-sm space-y-1">
            <p><span className="font-semibold text-slate-900">Invoice #:</span> {invoice.number}</p>
            <p><span className="font-semibold text-slate-900">Date:</span> {invoice.date}</p>
            <p><span className="font-semibold text-slate-900">Due Date:</span> {invoice.dueDate}</p>
          </div>
        </div>
      )}

      {/* Bill To */}
      <div className="mb-8 md:mb-12">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b pb-1">Bill To</h3>
        {invoice.client.companyName && (
          <div className="text-slate-900 font-bold text-lg mb-0.5">{invoice.client.companyName}</div>
        )}
        <div className={`${invoice.client.companyName ? 'text-slate-700 font-medium text-base' : 'text-slate-900 font-bold text-lg'} mb-1`}>
          {invoice.client.companyName ? `Attn: ${invoice.client.name}` : invoice.client.name || 'Client Name'}
        </div>
        <div className="text-slate-600 text-sm whitespace-pre-line">{invoice.client.address}</div>
        <div className="text-slate-600 text-sm mt-1">{invoice.client.email}</div>
        {invoice.client.phone && <div className="text-slate-600 text-sm">{invoice.client.phone}</div>}
      </div>

      {/* Items Table */}
      <div className="mb-8 flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider w-[50%]">Description</th>
              <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">Qty</th>
              <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">Price</th>
              <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {invoice.items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 italic">No items added yet.</td>
              </tr>
            )}
            {invoice.items.map((item) => {
              const isHeader = item.description.startsWith('---');
              return (
                <tr key={item.id} className={`border-b ${isHeader ? 'border-slate-200 bg-slate-50/50' : 'border-slate-50'}`}>
                  <td className="py-3 px-2 align-top" colSpan={isHeader ? 4 : 1}>
                    <span className={`font-medium text-slate-900 whitespace-pre-line ${isHeader ? 'font-bold text-slate-600 uppercase tracking-widest text-xs block pt-1' : ''}`}>
                      {isHeader 
                        ? item.description.replace(/---/g, '').replace(/ESTIMATE:/, '').trim() 
                        : item.description
                      }
                    </span>
                    {!isHeader && <span className="block text-xs text-slate-500">Unit: {item.unit}</span>}
                  </td>
                  {!isHeader && (
                    <>
                      <td className="py-3 px-2 text-right align-top text-slate-600">{item.quantity}</td>
                      <td className="py-3 px-2 text-right align-top text-slate-600">{formatPrice(item.unitPrice)}</td>
                      <td className="py-3 px-2 text-right align-top font-medium text-slate-900">
                        {formatPrice(item.quantity * item.unitPrice)}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12 break-inside-avoid">
        <div className="w-full sm:w-1/2 md:w-1/2">
          <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-50">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-50">
            <span>Tax ({invoice.taxRate}%)</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          {amountPaid > 0 && (
            <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-50">
              <span>Amount Paid</span>
              <span className="font-medium">{formatPrice(amountPaid)}</span>
            </div>
          )}
          {amountPaid > 0 && (
            <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-50">
              <span>Balance Due</span>
              <span className="font-medium">{formatPrice(balanceDue)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 text-lg font-bold text-slate-900 border-b-2 border-slate-900">
            <span>Total</span>
            <span className="whitespace-nowrap">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-slate-100 text-sm text-slate-500">
        {invoice.notes && (
          <div className="mb-6">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
            <p className="italic">{invoice.notes}</p>
          </div>
        )}

        {invoice.terms && (
          <div className="mb-8">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions / Contract</h4>
            <p className="text-[10px] text-slate-600 whitespace-pre-line text-justify leading-relaxed">{invoice.terms}</p>
          </div>
        )}

        {/* Signature Block */}
        <div className="grid grid-cols-2 gap-12 mt-12 break-inside-avoid">
            <div>
                {invoice.signature ? (
                  <div className="relative h-20 border-b border-slate-300">
                     <img src={invoice.signature} alt="Signature" className="h-full object-contain" />
                  </div>
                ) : (
                  isSigning ? (
                    <div className="no-print bg-white border-2 border-brand-500 rounded shadow-lg p-2 absolute z-10 bottom-10 left-0">
                       <canvas 
                         ref={canvasRef} width={300} height={150} 
                         className="border border-slate-200 cursor-crosshair bg-slate-50"
                         onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                         onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                       />
                       <div className="flex gap-2 mt-2">
                          <button onClick={saveSignature} className="flex-1 bg-brand-600 text-white text-xs py-1 rounded flex items-center justify-center gap-1"><Save size={12}/> Save</button>
                          <button onClick={clearSignature} className="flex-1 bg-slate-200 text-slate-600 text-xs py-1 rounded flex items-center justify-center gap-1"><Eraser size={12}/> Clear</button>
                          <button onClick={() => setIsSigning(false)} className="flex-1 border border-slate-300 text-xs py-1 rounded">Cancel</button>
                       </div>
                    </div>
                  ) : (
                    <div 
                      className="border-b border-slate-300 h-8 cursor-pointer hover:bg-brand-50 transition-colors flex items-end pb-1"
                      onClick={() => onSign && setIsSigning(true)}
                    >
                       <span className="text-[10px] text-brand-500 no-print flex items-center gap-1 opacity-0 hover:opacity-100"><PenTool size={10}/> Click to Sign Digitally</span>
                    </div>
                  )
                )}
                <p className="text-xs font-bold text-slate-500 mt-2 uppercase">Authorized Signature</p>
            </div>
            <div>
                <div className="border-b border-slate-300 h-8 flex items-end">
                  <span className="text-sm">{invoice.date}</span>
                </div>
                <p className="text-xs font-bold text-slate-500 mt-2 uppercase">Date</p>
            </div>
        </div>

        
        {/* Trust & Scope Summary (Read-Only) */}
        { (invoice as any).trustSummary && (
          <div className="mt-8 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Trust & Scope Summary</h3>
            <ul className="text-xs text-slate-600 space-y-1">
              {((invoice as any).trustSummary.scope || []).map((line: string, idx: number) => (
                <li key={idx}>• {line}</li>
              ))}
              {((invoice as any).trustSummary.assumptions || []).map((line: string, idx: number) => (
                <li key={idx}>• Assumption: {line}</li>
              ))}
              {((invoice as any).trustSummary.priceChanges || []).map((line: string, idx: number) => (
                <li key={idx}>• Price may change if: {line}</li>
              ))}
              {((invoice as any).trustSummary.responsibilities || []).map((line: string, idx: number) => (
                <li key={idx}>• Responsibility: {line}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-6 pt-6">Thank you for your business!</p>
      </div>

    </div>
  );
};