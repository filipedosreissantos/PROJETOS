import { Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function SuccessPage() {
  const orderNumber = `NE${Date.now().toString().slice(-8)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-neon-cyan blur-3xl opacity-30 animate-pulse-neon" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-dark-900" />
        </div>
      </div>

      {/* Title */}
      <h1 className="font-['Orbitron'] text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Order Confirmed!
      </h1>

      <p className="text-gray-400 text-center max-w-md mb-8">
        Thank you for your purchase. Your order has been successfully placed and is being processed.
      </p>

      {/* Order Number */}
      <div className="glass rounded-2xl p-6 mb-8 text-center">
        <p className="text-gray-500 text-sm mb-2">Order Number</p>
        <p className="font-['Orbitron'] text-2xl font-bold text-neon-cyan tracking-wider">
          #{orderNumber}
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <p className="font-medium text-white">Confirmation Sent</p>
            <p className="text-sm text-gray-500">Check your email inbox</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neon-pink/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-neon-pink" />
          </div>
          <div>
            <p className="font-medium text-white">Shipping Soon</p>
            <p className="text-sm text-gray-500">Estimated 3-5 days</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link to="/">
        <Button size="lg">
          Continue Shopping
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
