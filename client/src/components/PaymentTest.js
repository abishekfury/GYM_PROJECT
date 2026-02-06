import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

const PaymentTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const testPlan = {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 2500,
    duration: '1 Month',
    description: 'Most popular choice for serious fitness enthusiasts',
    features: [
      'Full Gym Access (6 AM - 11 PM)',
      'Personal Trainer (2 sessions)',
      'Nutrition Guidance',
      'Group Classes Access',
      'Priority Booking',
      'Guest Pass (2 per month)'
    ],
    popular: true
  };

  const testCustomer = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Payment Integration Test</h1>
        <p className="text-gray-600 mb-6">Click the button below to test the payment modal:</p>
        
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Test Payment Modal
        </button>

        <PaymentModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          membershipPlan={testPlan}
          customerInfo={testCustomer}
          onPaymentSuccess={(data) => {
            console.log('Payment successful:', data);
            alert('Payment successful! Check console for details.');
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default PaymentTest;