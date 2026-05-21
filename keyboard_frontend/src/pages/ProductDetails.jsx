import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Cpu, ShieldAlert, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import QuantitySelector from '../components/QuantitySelector';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Hardcoded details database for the mock fallbacks (synchronized with Products list)
const MOCK_DETAILS_DB = {
  1: {
    name: "CYBER-60 COBALT",
    price: 189.00,
    brand: "CyberKeys",
    layout: "60% Compact Layout",
    case_material: "Polycarbonate Frosted Black",
    switches: "Gateron Oil King (Lubed)",
    stabilizers: "Durock V2 Screw-in",
    conn: "USB-C wired isolated link",
    description: "The Cyber-60 Cobalt is a dense, high-frequency physical typing array optimized for minimal finger travel and heavy deskspace savings. Features a premium polycarbonate casing that scatters reactive LEDs into a smooth ambient underglow. Pre-fitted with premium heavy linears.",
    category: { name: "Mechanical Decks" }
  },
  2: {
    name: "SYNTH-75 MATRIX",
    price: 249.00,
    brand: "CyberKeys",
    layout: "75% Layout with Encoder Dial",
    case_material: "Space Anodized Aluminium",
    switches: "NovelKeys Cream Linear",
    stabilizers: "Steel Plate Mount GMK",
    conn: "USB-C + 2.4G Low Latency Wireless",
    description: "Engraved from aircraft grade anodized aluminum blocks, the Synth-75 features an active physical rotary encoder knob linked directly to core OS volume matrices. Inside, a solid brass weight plate dampens resonance frequencies into a deep, pleasant thock signature.",
    category: { name: "Mechanical Decks" }
  },
  3: {
    name: "NEON GLITCH TKL",
    price: 299.00,
    brand: "NeonSys",
    layout: "Tenkeyless (80%) Layout",
    case_material: "Tempered Glass & Polycarbonate",
    switches: "Cherry MX Ultra-blue Tactile",
    stabilizers: "Durock V2 Gold Plated",
    conn: "USB-C hyper-conductive cable",
    description: "The premium TKL flagship designed for maximum command inputs. Translucent custom-molded pink keycaps allow complete visibility into the high-precision hot-swap gold sockets underneath. Features a dual-stage isolation gasket suspension array.",
    category: { name: "Mechanical Decks" }
  },
  4: {
    name: "VIRTUAL LOGIC NUMPAD",
    price: 99.00,
    brand: "LogicGlow",
    layout: "Numeric Addon Grid (20-key)",
    case_material: "Laser-cut Stacked Acrylic",
    switches: "Gateron Yellow Pro Linear",
    stabilizers: "OEM Plate Mount",
    conn: "Secondary modular bridge link",
    description: "A compact numeric calculator companion deck built to sit alongside your core cyberdeck. Program custom hex macro values, control software shortcuts, or use it as a dedicated digital numpad. Reactive neon amber backlight setup.",
    category: { name: "Modular Addons" }
  },
  5: {
    name: "FROSTBYTE KEYCAP SET",
    price: 49.00,
    brand: "CyberKeys",
    layout: "Cherry Profile, MX Compatible",
    case_material: "Double-Shot Polycarbonate",
    switches: "Keycaps Only (No switches)",
    stabilizers: "Stabilizers not included",
    conn: "Fits standard mechanical decks",
    description: "Frosted double-shot keycaps highlighting custom cybernetic glyph sub-legends. Perfect for scattering keyboard switch lighting arrays into a glowing workspace backdrop.",
    category: { name: "Keycap Sets" }
  },
  6: {
    name: "CHROME LINEAR SWITCHES",
    price: 35.00,
    brand: "SwitchSys",
    layout: "5-pin Hot-swap Mount",
    case_material: "POM Stem & Nylon Housing",
    switches: "POM Stem Linear (Lubed)",
    stabilizers: "Switches Only",
    conn: "Compatible with hot-swap sockets",
    description: "Hyper-smooth linear key switches with 45g actuation rating. Gold alloy contact leaves deliver zero debounce latency and immediate keyboard triggers.",
    category: { name: "Key Switches" }
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, actionLoading } = useCart();
  const [product, setProduct] = useState(null);
  
  const [selectedSwitch, setSelectedSwitch] = useState('Default Linear');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setIsUsingFallback(false);
      } catch (error) {
        console.warn(`Product API details error. Loading local matrix data index ${id}.`, error);
        
        // Find in mock database
        const mockProduct = MOCK_DETAILS_DB[id] || MOCK_DETAILS_DB[1];
        setProduct({
          id: parseInt(id) || 1,
          ...mockProduct
        });
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    setAddError(null);

    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (message) {
      setAddError(typeof message === 'string' ? message : 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyber-cyan/10 border-t-cyber-cyan rounded-full animate-spin" />
          <Cpu className="h-6 w-6 text-cyber-cyan absolute animate-pulse" />
        </div>
        <div className="font-display text-xs tracking-widest text-slate-500 uppercase animate-pulse">
          Opening hardware data block...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 border border-slate-900 rounded-2xl bg-cyber-dark/20 text-slate-400">
        <ShieldAlert className="h-12 w-12 text-cyber-magenta mx-auto mb-4 animate-bounce" />
        <h3 className="font-display font-bold text-lg uppercase tracking-wider">HARDWARE IDENTIFIER NOT FOUND</h3>
        <p className="text-sm text-slate-600 mt-2 mb-6">The database partition requested does not reference any active components.</p>
        <Link to="/products">
          <Button variant="primary">STORE DIRECTORY</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Back link and warning alert */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-slate-400 hover:text-cyber-cyan transition-colors">
          <ArrowLeft className="h-4 w-4" />
          RETURN TO MAIN HARDWARE DATABASE
        </Link>
        
        {isUsingFallback && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 font-display text-[10px] tracking-widest uppercase">
            <AlertTriangle className="h-3.5 w-3.5" />
            OFFLINE EMULATOR DATA MOUNTED
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Product Showcase Visualizer */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative border border-slate-900 rounded-2xl bg-cyber-dark/40 p-8 flex justify-center items-center overflow-hidden min-h-[400px]">
            {/* Ambient visual overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.02),transparent_70%)]" />
            <div className="absolute top-4 left-4 bg-cyber-bg/85 border border-slate-800 rounded px-3 py-1 text-[10px] font-mono text-slate-500">
              MODULE ID: CK-{product.id}-SPEC
            </div>
            
            {/* Keyboard graphic mock */}
            <div className="text-center space-y-8">
              <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-tr from-cyber-cyan/10 via-transparent to-cyber-magenta/5 border border-slate-800/50 flex items-center justify-center relative animate-pulse">
                <Cpu className="h-20 w-20 text-cyber-cyan/40" />
                <div className="absolute inset-4 rounded-full border border-dashed border-cyber-magenta/10" />
              </div>
              <div className="font-display tracking-widest text-xs text-slate-400">
                AWAITING CUSTOMER DECK INTEGRATION
              </div>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyber-dark/60 border border-slate-900 rounded-xl p-4">
              <span className="text-[10px] text-slate-500 font-display tracking-widest uppercase">PLATE WEIGHT</span>
              <p className="font-display text-base font-bold text-slate-200 mt-1">1.84 KG (SOLID BRASS)</p>
            </div>
            <div className="bg-cyber-dark/60 border border-slate-900 rounded-xl p-4">
              <span className="text-[10px] text-slate-500 font-display tracking-widest uppercase">POLLING INTERFACE</span>
              <p className="font-display text-base font-bold text-slate-200 mt-1">USB-C / 1000HZ RATE</p>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Header Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyber-cyan/15 border border-cyber-cyan/20 rounded text-[10px] font-display tracking-widest text-cyber-cyan uppercase">
              {product.category?.name || "HARDWARE MODULE"}
            </div>
            
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-widest text-slate-100 uppercase">
              {product.name}
            </h2>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Configuration Selection */}
          <Card title="INTERFACE SPECS" glowColor="cyan" className="space-y-4">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
              <div>
                <span className="text-slate-500">Brand Manufacturer</span>
                <div className="font-bold text-slate-200 mt-0.5">{product.brand || "CYBERKEYS"}</div>
              </div>
              <div>
                <span className="text-slate-500">Form Layout</span>
                <div className="font-bold text-slate-200 mt-0.5">{product.layout || "Custom Spec"}</div>
              </div>
              <div>
                <span className="text-slate-500">Material Casing</span>
                <div className="font-bold text-slate-200 mt-0.5">{product.case_material || "Composite Matrix"}</div>
              </div>
              <div>
                <span className="text-slate-500">Standard Switch</span>
                <div className="font-bold text-slate-200 mt-0.5">{product.switches || "Cherry MX Switches"}</div>
              </div>
              {product.stabilizers && (
                <div>
                  <span className="text-slate-500">Stabilizer Type</span>
                  <div className="font-bold text-slate-200 mt-0.5">{product.stabilizers}</div>
                </div>
              )}
              {product.conn && (
                <div>
                  <span className="text-slate-500">Connection Link</span>
                  <div className="font-bold text-slate-200 mt-0.5">{product.conn}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Switch customization selection */}
          <div className="space-y-3">
            <label className="block font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
              CALIBRATE SWITCH MATRIX:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Default Linear', 'Laser Clicky', 'Ghost Silent'].map(sw => (
                <button
                  key={sw}
                  onClick={() => setSelectedSwitch(sw)}
                  className={`
                    px-3 py-2 border rounded font-display text-xs font-semibold tracking-wider cursor-pointer text-center transition-all
                    ${selectedSwitch === sw 
                      ? 'border-cyber-cyan bg-cyber-cyan/5 text-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.15)]' 
                      : 'border-slate-800 hover:border-slate-700 text-slate-400'}
                  `}
                >
                  {sw.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-cyber-dark/40 border border-slate-900 rounded-2xl">
            <div>
              <span className="text-[10px] text-slate-500 font-display tracking-widest uppercase">SECURE TRANSFER TOTAL</span>
              <div className="text-3xl font-display font-extrabold text-slate-100 tracking-wider">
                ${(parseFloat(product.price) * quantity).toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} disabled={actionLoading} />
              <Button 
                variant="primary" 
                onClick={handleAddToCart}
                disabled={actionLoading}
                className="py-3 px-8 font-display"
              >
                <ShoppingCart className="h-4.5 w-4.5 mr-2" />
                {added ? 'INTEGRATED' : actionLoading ? 'ADDING...' : 'INSTALL HARDWARE'}
              </Button>
              {addError && (
                <p className="text-xs text-cyber-magenta font-display">{addError}</p>
              )}
            </div>
          </div>

          {/* Technical warning warning */}
          <div className="flex gap-3 p-4 bg-cyber-magenta/5 border border-cyber-magenta/15 rounded-xl text-xs text-slate-400">
            <ShieldAlert className="h-5 w-5 text-cyber-magenta flex-shrink-0" />
            <p className="leading-relaxed">
              WARNING: Mechanical deck modules are high-precision electronics. Ensure system terminal power is offline before matrix socket hot-swaps.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
