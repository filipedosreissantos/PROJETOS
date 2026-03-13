import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, User, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19, 'Card number too long'),
  cardName: z.string().min(2, 'Name on card is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits').max(4, 'CVV must be 3-4 digits'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log('Order submitted:', { ...data, items, total: totalPrice * 1.1 });
    
    clearCart();
    addToast('Order placed successfully!', 'success');
    navigate('/success');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some products before checking out</p>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="font-['Orbitron'] text-3xl font-bold text-white mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-neon-cyan" />
                </div>
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-neon-purple" />
                </div>
                <h2 className="text-xl font-semibold text-white">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    placeholder="123 Main St, Apt 4"
                    {...register('address')}
                    error={errors.address?.message}
                  />
                </div>
                <Input
                  label="City"
                  placeholder="New York"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="State"
                    placeholder="NY"
                    {...register('state')}
                    error={errors.state?.message}
                  />
                  <Input
                    label="ZIP Code"
                    placeholder="10001"
                    {...register('zipCode')}
                    error={errors.zipCode?.message}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-neon-pink/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-neon-pink" />
                </div>
                <h2 className="text-xl font-semibold text-white">Payment Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    {...register('cardNumber')}
                    error={errors.cardNumber?.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Name on Card"
                    placeholder="John Doe"
                    {...register('cardName')}
                    error={errors.cardName?.message}
                  />
                </div>
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                  {...register('expiryDate')}
                  error={errors.expiryDate?.message}
                />
                <Input
                  label="CVV"
                  type="password"
                  placeholder="123"
                  {...register('cvv')}
                  error={errors.cvv?.message}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="font-['Orbitron'] text-xl font-bold text-white mb-6">
                Order Summary
              </h2>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.product.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-neon-cyan">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-glass-border pt-4 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-neon-cyan">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="text-white">${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-glass-border pt-4 mt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-neon-cyan">
                    ${(totalPrice * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
