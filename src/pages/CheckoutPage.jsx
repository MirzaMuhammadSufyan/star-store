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
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400">
           <CreditCard size={40} />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">Please add some items to your cart before proceeding to checkout.</p>
        <Button onPointerUp={() => navigate('/catalog')}>Return to Catalog</Button>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Shipping', icon: Truck },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Confirmation', icon: CheckCircle2 },
  ];

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
    if (step === 2) clearCart();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 md:gap-12">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-3 ${step >= s.id ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s.id ? 'border-orange-500 bg-orange-500/10' : 'border-gray-200 dark:border-white/10'
              }`}>
                <s.icon size={18} />
              </div>
              <span className="hidden sm:block font-bold text-sm uppercase tracking-wider">{s.name}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-[2px] w-8 md:w-20 rounded-full ${step > s.id ? 'bg-orange-500' : 'bg-gray-200 dark:border-white/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-6 glass-card p-8 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10">
                  <h3 className="text-2xl font-black dark:text-white flex items-center gap-4">
                    <Truck className="text-orange-500" /> Shipping Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="First Name" placeholder="John" />
                    <Input label="Last Name" placeholder="Doe" />
                  </div>
                  <Input label="Email Address" placeholder="john@example.com" type="email" />
                  <Input label="Street Address" placeholder="123 Main St, Apt 4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="City" placeholder="San Francisco" />
                    <Input label="State" placeholder="CA" />
                    <Input label="Zip Code" placeholder="94103" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="glass" className="dark:text-white" onPointerUp={() => navigate('/')}>Cancel</Button>
                  <Button className="px-10 h-14" onPointerUp={handleNextStep}>Continue to Payment <ChevronRight size={18} /></Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-6 glass-card p-8 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10">
                  <h3 className="text-2xl font-black dark:text-white flex items-center gap-4">
                    <CreditCard className="text-orange-500" /> Payment Method
                  </h3>
                  <div className="p-6 rounded-2xl border border-orange-500 bg-orange-500/5 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                         <span className="text-white font-bold text-xs italic">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-black dark:text-white uppercase tracking-widest">Credit / Debit Card</p>
                        <p className="text-[10px] text-gray-500 font-bold">SECURE ENCRYPTED PAYMENT</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-orange-500" size={20} />
                  </div>

                  <Input label="Cardholder Name" placeholder="John Doe" />
                  <div className="relative">
                    <Input label="Card Number" placeholder="**** **** **** ****" />
                    <div className="absolute right-4 top-[3.2rem] flex gap-2">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="Expiry Date" placeholder="MM / YY" />
                    <Input label="CVV" placeholder="***" type="password" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="glass" className="dark:text-white" onPointerUp={() => setStep(1)}>Back to Shipping</Button>
                  <Button className="px-10 h-14 gap-2" onPointerUp={handleNextStep}>
                    Complete Purchase <ShieldCheck size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 glass-card bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-center space-y-8"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                   <CheckCircle2 size={64} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black dark:text-white">Order Confirmed!</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Thank you for your purchase. We've sent a confirmation email to your inbox.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-black/20 px-8 py-4 rounded-2xl">
                   <span className="text-sm font-medium text-gray-500 block mb-1 uppercase tracking-widest">Order Number</span>
                   <span className="text-2xl font-black dark:text-white">#ST-9823-441</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="px-8 h-14" onPointerUp={() => navigate('/')}>Return Home</Button>
                  <Button variant="glass" className="px-8 h-14 dark:text-white" onPointerUp={() => navigate('/profile')}>Track Order</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 space-y-8 sticky top-24">
            <h4 className="text-xl font-bold dark:text-white">Order Summary</h4>
            
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-bold dark:text-white">${getTotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="font-bold text-green-500">FREE</span>
              </div>
              <div className="flex justify-between text-lg pt-4 border-t border-gray-200 dark:border-white/5">
                <span className="font-black dark:text-white">Total</span>
                <span className="font-black text-orange-600 dark:text-orange-400">${getTotal()}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 text-xs text-gray-400">
               <ShieldCheck size={16} />
               <span>Guaranteed safe and secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
