import React, { useState } from 'react';
import { CreditCard, Smartphone, Globe, Lock, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';

interface CheckoutFlowProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseImage?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CheckoutFlow({ 
  courseId, 
  courseTitle, 
  coursePrice, 
  courseImage,
  onSuccess,
  onCancel 
}: CheckoutFlowProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>(  'payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'bank'>('card');
  const [region, setRegion] = useState<'global' | 'africa'>('global');

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      toast.success('Payment successful!');
      onSuccess?.();
    }, 2000);
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-[#395192]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600 mb-6">Please wait while we securely process your payment...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#395192] h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            You now have access to <span className="font-semibold">{courseTitle}</span>
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
            <p className="text-2xl font-bold text-gray-900">${coursePrice.toFixed(2)}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = `/courses/${courseId}`}
              className="w-full py-3 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
            >
              Start Learning
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to course
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

              {/* Region Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Region
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRegion('global')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      region === 'global'
                        ? 'border-[#395192] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <p className="font-medium text-gray-900">Global</p>
                    <p className="text-xs text-gray-500">Stripe (Cards, Wallets)</p>
                  </button>
                  <button
                    onClick={() => setRegion('africa')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      region === 'africa'
                        ? 'border-[#395192] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <p className="font-medium text-gray-900">Africa</p>
                    <p className="text-xs text-gray-500">Flutterwave (Mobile Money)</p>
                  </button>
                </div>
              </div>

              {/* Payment Method Selection */}
              {region === 'global' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#395192] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-4 h-4 text-[#395192]"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {region === 'africa' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'mobile'
                          ? 'border-[#395192] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="mobile"
                        checked={paymentMethod === 'mobile'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-4 h-4 text-[#395192]"
                      />
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Mobile Money</p>
                        <p className="text-sm text-gray-500">M-Pesa, MTN, Airtel</p>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#395192] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-4 h-4 text-[#395192]"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Card Payment</p>
                        <p className="text-sm text-gray-500">Local & International Cards</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <Input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors font-medium"
                  >
                    Pay ${coursePrice.toFixed(2)}
                  </button>
                </form>
              )}

              {/* Mobile Money Form */}
              {paymentMethod === 'mobile' && (
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Provider
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                      <option>M-Pesa (Kenya)</option>
                      <option>MTN Mobile Money</option>
                      <option>Airtel Money</option>
                      <option>Vodafone Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Money Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                      className="w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors font-medium"
                  >
                    Pay ${coursePrice.toFixed(2)}
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    You'll receive a prompt on your phone to confirm payment
                  </p>
                </form>
              )}
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Lock className="w-5 h-5 text-green-600" />
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {courseImage && (
                <img
                  src={courseImage}
                  alt={courseTitle}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              
              <h3 className="font-medium text-gray-900 mb-4">{courseTitle}</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Course Price</span>
                  <span className="text-gray-900">${coursePrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">${coursePrice.toFixed(2)}</span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Lifetime access to course</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}