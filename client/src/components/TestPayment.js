// Simple Test Payment Component
import React from 'react';

const TestPayment = () => {
  const handleMockPayment = async () => {
    try {
      // Simulate successful payment
      const mockPaymentData = {
        success: true,
        message: 'Payment successful!',
        orderId: `order_mock_${Date.now()}`,
        amount: 2950,
        currency: 'INR'
      };
      
      alert('Payment Successful! (Mock Mode)\n\nOrder ID: ' + mockPaymentData.orderId);
      
    } catch (error) {
      alert('Payment Failed: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Test Payment System</h3>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="font-medium text-blue-800">Mock Mode Active</span>
          </div>
          <p className="text-blue-700 text-sm">
            No real money will be charged. Perfect for testing!
          </p>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Premium Plan:</span>
            <span>₹2,500</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>GST (18%):</span>
            <span>₹450</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-red-600">₹2,950</span>
          </div>
        </div>
        
        <button 
          onClick={handleMockPayment}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Test Pay ₹2,950
        </button>
      </div>
    </div>
  );
};

export default TestPayment;