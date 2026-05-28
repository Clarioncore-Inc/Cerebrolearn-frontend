import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../auth/LoginForm';
import { SignupChoice } from '../auth/SignupChoice';
import { SignupForm } from '../auth/SignupForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentPageProps {
  course: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentPage({ course, onSuccess, onCancel }: PaymentPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mobileNetwork, setMobileNetwork] = useState('mtn');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup-choice' | 'signup' | 'login'>(
    'signup-choice',
  );
  const [cardholderName, setCardholderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const price = 299;
  const paymentDraftKey = useMemo(
    () => `cerebrolearn.paymentDraft.${course?.id ?? 'default'}`,
    [course?.id],
  );

  useEffect(() => {
    const rawDraft = sessionStorage.getItem(paymentDraftKey);
    if (!rawDraft) {
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as {
        paymentMethod?: string;
        mobileNetwork?: string;
        cardholderName?: string;
        phoneNumber?: string;
      };

      setPaymentMethod(draft.paymentMethod ?? 'card');
      setMobileNetwork(draft.mobileNetwork ?? 'mtn');
      setCardholderName(draft.cardholderName ?? '');
      setPhoneNumber(draft.phoneNumber ?? '');
    } catch {
      sessionStorage.removeItem(paymentDraftKey);
    }
  }, [paymentDraftKey]);

  useEffect(() => {
    sessionStorage.setItem(
      paymentDraftKey,
      JSON.stringify({
        paymentMethod,
        mobileNetwork,
        cardholderName,
        phoneNumber,
      }),
    );
  }, [
    paymentDraftKey,
    paymentMethod,
    mobileNetwork,
    cardholderName,
    phoneNumber,
  ]);

  useEffect(() => {
    if (user && authDialogOpen) {
      setAuthDialogOpen(false);
      toast.success('Signed in. You can continue from the payment page.');
    }
  }, [user, authDialogOpen]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      localStorage.setItem('cerebrolearn.user.intent', 'iq-only');
      setAuthMode('signup-choice');
      setAuthDialogOpen(true);
      return;
    }

    toast.success('Continue by choosing a psychologist for your official IQ test.');
    sessionStorage.removeItem(paymentDraftKey);
    navigate('/browse-psychologists');
  };

  return (
    <div className='container max-w-4xl py-8'>
      <Button variant='ghost' onClick={onCancel} className='mb-6'>
        ← Back
      </Button>

      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Payment Form */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className='space-y-6'>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className='flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary'>
                    <RadioGroupItem value='card' id='card' />
                    <Label
                      htmlFor='card'
                      className='flex items-center gap-2 flex-1 cursor-pointer'
                    >
                      <CreditCard className='h-5 w-5' />
                      <span>Credit / Debit Card</span>
                    </Label>
                  </div>

                  <div className='flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary'>
                    <RadioGroupItem value='momo' id='momo' />
                    <Label
                      htmlFor='momo'
                      className='flex items-center gap-2 flex-1 cursor-pointer'
                    >
                      <Smartphone className='h-5 w-5' />
                      <span>Mobile Money</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='cardNumber'>Card Number</Label>
                      <Input
                        id='cardNumber'
                        name='cc-number'
                        autoComplete='cc-number'
                        inputMode='numeric'
                        placeholder='1234 5678 9012 3456'
                        required
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='expiry'>Expiry Date</Label>
                        <Input
                          id='expiry'
                          name='cc-exp'
                          autoComplete='cc-exp'
                          inputMode='numeric'
                          placeholder='MM/YY'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='cvv'>CVV</Label>
                        <Input
                          id='cvv'
                          name='cc-csc'
                          autoComplete='cc-csc'
                          inputMode='numeric'
                          placeholder='123'
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='name'>Cardholder Name</Label>
                      <Input
                        id='name'
                        name='cc-name'
                        autoComplete='cc-name'
                        placeholder='John Doe'
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        required
                      />
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      For security, card number, expiry date, and CVV are not
                      stored if you leave this page.
                    </p>
                  </div>
                )}

                {paymentMethod === 'momo' && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label>Select Network</Label>
                      <RadioGroup
                        value={mobileNetwork}
                        onValueChange={setMobileNetwork}
                      >
                        <div className='flex items-center space-x-3 p-3 border rounded-lg'>
                          <RadioGroupItem value='mtn' id='mtn' />
                          <Label
                            htmlFor='mtn'
                            className='flex-1 cursor-pointer'
                          >
                            MTN Mobile Money
                          </Label>
                        </div>
                        <div className='flex items-center space-x-3 p-3 border rounded-lg'>
                          <RadioGroupItem value='vodafone' id='vodafone' />
                          <Label
                            htmlFor='vodafone'
                            className='flex-1 cursor-pointer'
                          >
                            Vodafone Cash
                          </Label>
                        </div>
                        <div className='flex items-center space-x-3 p-3 border rounded-lg'>
                          <RadioGroupItem value='airteltigo' id='airteltigo' />
                          <Label
                            htmlFor='airteltigo'
                            className='flex-1 cursor-pointer'
                          >
                            AirtelTigo Money
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone'>Phone Number</Label>
                      <Input
                        id='phone'
                        name='tel'
                        autoComplete='tel'
                        inputMode='tel'
                        placeholder='+233 XX XXX XXXX'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type='submit'
                  className='w-full'
                  size='lg'
                >
                  {`Pay $${price.toFixed(2)}`}
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
            <CardContent className='space-y-4'>
              <div>
                <p className='font-medium mb-2'>{course.title}</p>
                <p className='text-sm text-muted-foreground line-clamp-3'>
                  {course.description}
                </p>
              </div>

              <Separator />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Course Price</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <Separator />

              <div className='flex justify-between text-lg font-bold'>
                <span>Total</span>
                <span>${price.toFixed(2)}</span>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className='max-w-xl p-0 overflow-hidden'>
          <DialogHeader className='px-6 pt-6'>
            <DialogTitle>Continue Your Booking</DialogTitle>
            <DialogDescription>
              Log in or create an account without leaving this payment page.
            </DialogDescription>
          </DialogHeader>

          <div className='px-6 pb-6'>
            {authMode === 'login' ? (
              <LoginForm onToggleMode={() => setAuthMode('signup-choice')} />
            ) : authMode === 'signup' ? (
              <SignupForm
                onToggleMode={() => setAuthMode('login')}
                hideRoleSelection
                fixedRole='learner'
                onSignedUp={() => {
                  localStorage.setItem('cerebrolearn.user.intent', 'iq-only');
                  setAuthMode('login');
                }}
              />
            ) : (
              <SignupChoice
                onSelectRegular={() => {
                  localStorage.setItem('cerebrolearn.user.intent', 'iq-only');
                  setAuthMode('signup');
                }}
                onSelectPsychologist={() => setAuthMode('signup')}
                onToggleMode={() => setAuthMode('login')}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
