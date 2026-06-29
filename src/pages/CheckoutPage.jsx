import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  if (items.length === 0 && step !== 3) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-5">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
            <CreditCard size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h2>
          <p className="text-gray-600 text-base max-w-sm">Add some items to your cart before checking out.</p>
          <Button variant="accent" onClick={() => navigate('/catalog')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const STEPS = [
    { id: 1, label: 'Shipping', icon: Truck },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Confirmed', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    if (step === 2) clearCart();
    if (step < 3) setStep(s => s + 1);
  };

  const inputCls = 'w-full px-4 py-3 text-[15px] border border-gray-200 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-1">Secure Checkout</p>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Complete Your Order</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-3 md:gap-10 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2.5 ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step > s.id ? 'border-amber-600 bg-amber-600 text-white' :
                  step === s.id ? 'border-amber-600 text-amber-600 bg-amber-50' :
                  'border-gray-200 text-gray-400'
                }`}>
                  <s.icon size={17} />
                </div>
                <span className="hidden sm:block text-sm font-semibold uppercase tracking-wider">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-[2px] w-8 md:w-16 rounded-full ${step > s.id ? 'bg-amber-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <Truck size={20} className="text-amber-600" /> Shipping Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">First Name</label><input placeholder="John" className={inputCls} /></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Last Name</label><input placeholder="Doe" className={inputCls} /></div>
                    </div>
                    <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email</label><input type="email" placeholder="john@example.com" className={inputCls} /></div>
                    <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Street Address</label><input placeholder="123 Main St, Apt 4" className={inputCls} /></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">City</label><input placeholder="San Jose" className={inputCls} /></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">State</label><input placeholder="CA" className={inputCls} /></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">ZIP</label><input placeholder="94103" className={inputCls} /></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
                    <Button variant="accent" size="lg" onClick={handleNext} className="gap-2">Continue <ChevronRight size={16} /></Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <CreditCard size={20} className="text-amber-600" /> Payment Method
                    </h3>
                    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-7 bg-gray-900 rounded flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold italic">VISA</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Credit / Debit Card</p>
                          <p className="text-[10px] text-gray-500">Secure encrypted payment</p>
                        </div>
                      </div>
                      <CheckCircle2 size={18} className="text-amber-600" />
                    </div>
                    <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Cardholder Name</label><input placeholder="John Doe" className={inputCls} /></div>
                    <div className="relative"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Card Number</label><input placeholder="**** **** **** ****" className={inputCls} /><Lock size={14} className="absolute right-3 bottom-3 text-gray-400" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Expiry</label><input placeholder="MM / YY" className={inputCls} /></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">CVV</label><input type="password" placeholder="***" className={inputCls} /></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                    <Button variant="accent" size="lg" onClick={handleNext} className="gap-2"><ShieldCheck size={16} /> Complete Purchase</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg p-10 flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Order Confirmed!</h2>
                    <p className="text-gray-600 text-base max-w-sm mx-auto">Thank you for your purchase. A confirmation email has been sent to your inbox.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-8 py-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-gray-900">#ST-9823-441</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="accent" onClick={() => navigate('/')}>Return Home</Button>
                    <Button variant="secondary" onClick={() => navigate('/profile')}>Track Order</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24 space-y-6">
                <h4 className="font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h4>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative shrink-0">
                        <img src={item.image} className="w-14 h-14 rounded object-cover bg-gray-50" alt="" />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-900">${getTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>${getTotal()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
                  <ShieldCheck size={14} className="text-amber-600" />
                  <span>Guaranteed safe &amp; secure checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
