import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/orderService';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_FEE = 15;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, loading, clearCart } = useCart();
  const [form, setForm] = useState({
    phone: '',
    city: '',
    shipping_address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);

  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + tax + shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        total_price: Number(total.toFixed(2)),
        phone: form.phone,
        city: form.city,
        shipping_address: form.shipping_address,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.product?.price ?? 0),
        })),
      };

      await submitOrder(payload);
      await clearCart();
      setOrderComplete(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(' ')
          : null) ||
        'Order submission failed. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-cyber-cyan animate-spin" />
        <p className="font-display text-xs tracking-widest text-slate-500 uppercase">
          Loading checkout matrix...
        </p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="text-center py-24 bg-cyber-dark/20 border border-slate-900 rounded-2xl space-y-6">
        <CheckCircle2 className="h-14 w-14 text-cyber-cyan mx-auto" />
        <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-slate-100">
          Order Authorized
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Your order has been submitted to the network. Dispatch protocols are now pending.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={() => navigate('/products')}>
            CONTINUE SHOPPING
          </Button>
          <Link to="/">
            <Button variant="outline">RETURN HOME</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24 bg-cyber-dark/20 border border-slate-900 rounded-2xl space-y-4">
        <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-slate-100">
          No Items to Checkout
        </h1>
        <p className="text-slate-500 text-sm">Add hardware to your loadout before authorizing transfer.</p>
        <Link to="/products">
          <Button variant="primary">SHOP INVENTORY</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-slate-900 pb-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-slate-400 hover:text-cyber-cyan transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK TO LOADOUT
        </Link>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-wider text-slate-100 m-0">
          CHECKOUT TERMINAL
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mt-2">
          Submit shipping credentials and authorize the secure hardware transfer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <Card title="SHIPPING MANIFEST" glowColor="cyan" className="space-y-4">
            <div>
              <label htmlFor="phone" className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-cyber-bg border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-200"
                  placeholder="+1 555 0100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
                City / Sector
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="w-full bg-cyber-bg border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-200"
                  placeholder="Neo Tokyo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shipping_address" className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
                Shipping Address
              </label>
              <textarea
                id="shipping_address"
                name="shipping_address"
                required
                rows={4}
                value={form.shipping_address}
                onChange={handleChange}
                className="w-full bg-cyber-bg border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-slate-200 resize-none"
                placeholder="Block 7, Unit 42, Cyber District..."
              />
            </div>
          </Card>

          {submitError && (
            <p className="text-sm text-cyber-magenta font-display tracking-wide">{submitError}</p>
          )}

          <Button
            type="submit"
            variant="secondary"
            disabled={submitting}
            className="w-full justify-center py-3 font-display"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                SUBMITTING ORDER...
              </>
            ) : (
              'SUBMIT ORDER TO NETWORK'
            )}
          </Button>
        </form>

        <div className="lg:col-span-5">
          <Card title="ORDER SUMMARY" glowColor="magenta" className="space-y-6">
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-300 font-display uppercase truncate">
                    {item.product?.name} x{item.quantity}
                  </span>
                  <span className="text-slate-200 font-mono flex-shrink-0">
                    ${(parseFloat(item.product?.price ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 text-sm font-display text-slate-400 border-t border-slate-900 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="text-slate-200 font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-slate-200 font-mono">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-100 pt-2">
                <span>TOTAL</span>
                <span className="text-cyber-magenta font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-cyber-cyan/5 border border-cyber-cyan/15 rounded-lg text-[10px] text-slate-400 leading-normal">
              <ShieldCheck className="h-4.5 w-4.5 text-cyber-cyan flex-shrink-0" />
              <span>Order will be transmitted to the Laravel API upon submission.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
