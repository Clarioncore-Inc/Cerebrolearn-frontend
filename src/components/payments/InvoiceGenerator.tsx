import React from 'react';
import { Download, Mail, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InvoiceGeneratorProps {
  invoiceId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  date: string;
  paymentMethod: string;
}

export function InvoiceGenerator({
  invoiceId,
  studentName,
  studentEmail,
  courseTitle,
  amount,
  date,
  paymentMethod
}: InvoiceGeneratorProps) {
  
  const handleDownload = () => {
    toast.success('Invoice downloaded!');
  };

  const handleEmail = () => {
    toast.success('Invoice sent to ' + studentEmail);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoiceId}</h1>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178]"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#395192] mb-2">CerebroLearn</h2>
              <p className="text-gray-600">learn@cerebrolearn.com</p>
              <p className="text-gray-600">www.cerebrolearn.com</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 mb-2">INVOICE</div>
              <p className="text-gray-600">#{invoiceId}</p>
              <p className="text-gray-600">{date}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">BILL TO:</p>
              <p className="text-gray-900 font-medium">{studentName}</p>
              <p className="text-gray-600">{studentEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 mb-2">PAYMENT METHOD:</p>
              <p className="text-gray-900">{paymentMethod}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-12">
            <thead className="border-b-2 border-gray-900">
              <tr>
                <th className="text-left py-3 text-sm font-semibold text-gray-900">DESCRIPTION</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-900">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-6">
                  <p className="font-medium text-gray-900">{courseTitle}</p>
                  <p className="text-sm text-gray-600">Course Purchase - Lifetime Access</p>
                </td>
                <td className="text-right py-6 font-medium text-gray-900">${amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-12">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax (0%):</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between py-4 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900">TOTAL:</span>
                <span className="font-bold text-2xl text-gray-900">${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-8">
            <p className="mb-2">Thank you for your purchase!</p>
            <p>For support, contact support@cerebrolearn.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
