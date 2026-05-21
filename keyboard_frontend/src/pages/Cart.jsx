import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight, CornerDownRight, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import QuantitySelector from '../components/QuantitySelector';
import { useCart } from '../context/CartContext';

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_FEE = 15;

const Cart = () => {
  const {
    items,
    loading,
    actionLoading,
    error,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = async (cartItemId, nextQuantity) => {
    try {
      await updateQuantity(cartItemId, nextQuantity);
    } catch {
      // Error surfaced via context
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
    } catch {
      // Error surfaced via context
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
    } catch {
      // Error surfaced via context
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-cyber-cyan animate-spin" />
        <p className="font-display text-xs tracking-widest text-slate-500 uppercase">
          Syncing loadout from network...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-slate-900 pb-6">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-wider text-slate-100 m-0">
          YOUR LOADOUT HARNESS
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mt-2">
          Verify and configure your terminal array hardware before network authorization.
        </p>
      </div>

      {error && (
        <p className="text-sm text-cyber-magenta font-display tracking-wide">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="text-center py-24 bg-cyber-dark/20 border border-slate-900 rounded-2xl">
          <ShoppingBag className="h-12 w-12 text-slate-700 mx-auto mb-4 animate-bounce" />
          <h3 className="font-display font-bold text-lg text-slate-400 uppercase tracking-widest">Loadout Empty</h3>
          <p className="text-slate-600 text-sm mt-1 mb-6">No mechanical deck units registered to this workstation.</p>
          <Link to="/products">
            <Button variant="primary">SHOP INVENTORY</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => {
              const product = item.product;
              const linePrice = parseFloat(product?.price ?? 0) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-cyber-dark/45 border border-slate-900 rounded-xl gap-4 hover:border-slate-800 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-slate-100 tracking-wide uppercase">
                      {product?.name ?? 'Unknown Product'}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
                      {product?.brand && (
                        <span className="flex items-center gap-1">
                          <CornerDownRight className="h-3 w-3" /> Brand: {product.brand}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CornerDownRight className="h-3 w-3" /> Unit: ${parseFloat(product?.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(qty) => handleQuantityChange(item.id, qty)}
                      disabled={actionLoading}
                    />

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-display tracking-widest uppercase block">
                        SUBTOTAL
                      </span>
                      <span className="font-display font-bold text-slate-200">${linePrice.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={actionLoading}
                      className="p-2 text-slate-500 hover:text-cyber-magenta hover:bg-cyber-magenta/5 border border-transparent hover:border-cyber-magenta/20 rounded cursor-pointer transition-all disabled:opacity-50"
                      aria-label={`Remove ${product?.name} from loadout`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 font-display">
              <span>ALL SYSTEMS VERIFIED</span>
              <button
                onClick={handleClear}
                disabled={actionLoading}
                className="text-slate-500 hover:text-cyber-magenta transition-colors cursor-pointer disabled:opacity-50"
              >
                PURGE ALL ITEMS FROM LOG
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <Card title="ORDER TOTALS" glowColor="magenta" className="space-y-6">
              <div className="space-y-3.5 text-sm font-display text-slate-400">
                <div className="flex justify-between">
                  <span>Hardware Subtotal</span>
                  <span className="text-slate-200 font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Import Matrix Tax (8%)</span>
                  <span className="text-slate-200 font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hyperlink Delivery</span>
                  <span className="text-slate-200 font-mono">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-slate-900 pt-4 mt-2 flex justify-between text-base font-bold text-slate-100">
                  <span>TOTAL ESTIMATED</span>
                  <span className="text-cyber-magenta font-mono font-extrabold">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2.5 p-3 bg-cyber-cyan/5 border border-cyber-cyan/15 rounded-lg text-[10px] text-slate-400 leading-normal">
                <ShieldCheck className="h-4.5 w-4.5 text-cyber-cyan flex-shrink-0" />
                <span>SECURE CRYPTO-TRANSFER INTERFACE ACTIVE. PGP SIGNATURE ATTACHED.</span>
              </div>

              <div className="space-y-3 pt-2">
                <Link to="/checkout">
                  <Button variant="secondary" className="w-full justify-center py-3 font-display">
                    PROCEED TO CHECKOUT <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link to="/products" className="block text-center text-xs text-slate-500 hover:text-cyber-cyan transition-colors">
                  SECURE MORE HARDWARE
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
