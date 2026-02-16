import React, { useState } from 'react';
import { apiCall } from '../../utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentPageProps {
  course: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentPage({ course, onSuccess, onCancel }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [mobileNetwork, setMobileNetwork] = useState('mtn');

  const price = 49.99; // Example price

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create payment record
      const payment = await apiCall('/payments', {
        method: 'POST',
        body: JSON.stringify({
          amount: price,
          currency: 'USD',
          provider: paymentMethod === 'card' ? 'stripe' : `momo_${mobileNetwork}`,
          course_id: course.id
        }),
      });

      // Simulate payment processing
      setTimeout(async () => {
        // Update payment status
        await apiCall(`/payments/${payment.paymentId}`, {
          method: 'PUT',
          body: JSON.stringify({
            status: 'completed',
            provider_txn_id: `txn_${Math.random().toString(36).substr(2, 9)}`
          }),
        });

        toast.success('Payment successful! You are now enrolled.');
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Button variant="ghost" onClick={onCancel} className="mb-6">
        ← Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      <span>Credit / Debit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Smartphone className="h-5 w-5" />
                      <span>Mobile Money</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                  </div>
                )}

                {paymentMethod === 'momo' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Network</Label>
                      <RadioGroup value={mobileNetwork} onValueChange={setMobileNetwork}>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="mtn" id="mtn" />
                          <Label htmlFor="mtn" className="flex-1 cursor-pointer">MTN Mobile Money</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="vodafone" id="vodafone" />
                          <Label htmlFor="vodafone" className="flex-1 cursor-pointer">Vodafone Cash</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value="airteltigo" id="airteltigo" />
                          <Label htmlFor="airteltigo" className="flex-1 cursor-pointer">AirtelTigo Money</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+233 XX XXX XXXX" required />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={processing}>
                  {processing ? 'Processing...' : `Pay $${price.toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">{course.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Price</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${price.toFixed(2)}</span>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-muted-foreground">Lifetime access to course content</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-muted-foreground">Certificate of completion</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-muted-foreground">30-day money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
