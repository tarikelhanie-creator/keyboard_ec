import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Card from "../components/Card";
import Button from "../components/Button";
import { Cpu, Terminal, Filter, ShoppingCart, Info, AlertTriangle, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

// Premium Mock Products Database
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "CYBER-60 COBALT",
    description: "60% Layout ultra-compact terminal board. Polycarbonate frosted black housing, high-speed linear switches, custom foam sound insulation.",
    price: 189.00,
    brand: "CyberKeys",
    category_id: 1,
    layout: "60% Compact",
    case_material: "Polycarbonate",
    status: "IN STOCK"
  },
  {
    id: 2,
    name: "SYNTH-75 MATRIX",
    description: "75% Form factor with rotary encoder knob. Anodized matte black space aluminum casing, tactile creamy switches, solid brass plates.",
    price: 249.00,
    brand: "CyberKeys",
    category_id: 1,
    layout: "75% Encoder",
    case_material: "Anodized Aluminum",
    status: "LOW SUPPLY"
  },
  {
    id: 3,
    name: "NEON GLITCH TKL",
    description: "Tenkeyless layout designed for maximum input efficiency. Hot-swappable gasket plate, translucent pink keycap profile, solid steel plate weight.",
    price: 299.00,
    brand: "NeonSys",
    category_id: 1,
    layout: "Tenkeyless",
    case_material: "Polycarbonate & Steel",
    status: "IN STOCK"
  },
  {
    id: 4,
    name: "VIRTUAL LOGIC NUMPAD",
    description: "Mechanical numeric addon deck. Designed for secondary macro profiling. Cream linear switch, reactive amber LED matrix.",
    price: 99.00,
    brand: "LogicGlow",
    category_id: 2,
    layout: "Numeric Deck",
    case_material: "Acrylic",
    status: "OUT OF STOCK"
  },
  {
    id: 5,
    name: "FROSTBYTE KEYCAP SET",
    description: "Translucent polycarbonate double-shot keycaps. Deep indigo and neon cyan color scheme with futuristic cyber-engraved legends.",
    price: 49.00,
    brand: "CyberKeys",
    category_id: 3,
    layout: "Cherry Profile",
    case_material: "Polycarbonate",
    status: "IN STOCK"
  },
  {
    id: 6,
    name: "CHROME LINEAR SWITCHES",
    description: "5-pin hot-swap high-lubricity linear switches. 45g actuation force with copper contact points and ultra-smooth POM stems. Pack of 90.",
    price: 35.00,
    brand: "SwitchSys",
    category_id: 4,
    layout: "Linear 5-Pin",
    case_material: "Nylon & POM",
    status: "IN STOCK"
  }
];

const MOCK_CATEGORIES = [
  { id: 1, name: "Mechanical Decks" },
  { id: 2, name: "Modular Addons" },
  { id: 3, name: "Keycap Sets" },
  { id: 4, name: "Key Switches" }
];

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Fetch Categories on Mount
  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
      })
      .catch((err) => {
        console.warn("Backend categories unavailable, mounting fallback catalogs.", err);
        setCategories(MOCK_CATEGORIES);
      });
  }, []);

  // Fetch Products based on current filters and pages
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    
    // Construct parameters
    const params = {
      page: currentPage,
    };
    if (selectedCategory) {
      params.category_id = selectedCategory;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }

    try {
      const response = await api.get("/products", { params });
      const responseData = response.data;
      
      // Determine if Laravel pagination object
      if (responseData && responseData.data) {
        setProducts(responseData.data);
        setCurrentPage(responseData.current_page || 1);
        setLastPage(responseData.last_page || 1);
      } else if (Array.isArray(responseData)) {
        setProducts(responseData);
        setCurrentPage(1);
        setLastPage(1);
      } else {
        throw new Error("Invalid response format");
      }
      setIsUsingFallback(false);
    } catch (error) {
      console.warn("Products API unreachable. Running client-side simulation matrix.", error);
      
      // Filter mock database locally
      let filtered = [...MOCK_PRODUCTS];
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category_id === selectedCategory);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
        );
      }

      // Simple mock pagination (3 items per page for fallback visualization)
      const itemsPerPage = 4;
      const totalItems = filtered.length;
      const computedLastPage = Math.ceil(totalItems / itemsPerPage) || 1;
      
      // Adjust current page if out of bounds
      const activePage = Math.min(currentPage, computedLastPage);
      const startIdx = (activePage - 1) * itemsPerPage;
      const paginatedMock = filtered.slice(startIdx, startIdx + itemsPerPage);

      setProducts(paginatedMock);
      setCurrentPage(activePage);
      setLastPage(computedLastPage);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  // Trigger fetch when parameters update
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-12">
      {/* Title Header */}
      <div className="text-left space-y-4 border-b border-slate-900 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-wider text-slate-100 m-0">
              AVAILABLE HARDWARE STACKS
            </h1>
            <p className="text-slate-400 text-sm max-w-xl font-sans mt-2">
              Browse our inventory of premium mechanical decks, numeric layouts, keycaps, and hot-swap switch modules.
            </p>
          </div>
          
          {isUsingFallback && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 font-display text-xs tracking-widest uppercase h-fit animate-pulse">
              <AlertTriangle className="h-4 w-4" />
              SIMULATED DATABASE CONNECTIVITY ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Filters and search panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-cyber-dark/40 border border-slate-900 rounded-2xl p-6">
        
        {/* Category Filters: Left side */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-3 text-left">
          <span className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-cyber-cyan" />
            CATEGORY SELECT MATRIX
          </span>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`
                px-4 py-1.5 font-display text-xs font-bold tracking-wider rounded border cursor-pointer transition-all
                ${selectedCategory === null 
                  ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.25)]' 
                  : 'border-slate-800 hover:border-slate-700 text-slate-400'}
              `}
            >
              ALL HARDWARE
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`
                  px-4 py-1.5 font-display text-xs font-bold tracking-wider rounded border cursor-pointer transition-all
                  ${selectedCategory === cat.id 
                    ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.25)]' 
                    : 'border-slate-800 hover:border-slate-700 text-slate-400'}
                `}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input: Right side */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-3 text-left">
          <span className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase">
            QUERY REGISTER
          </span>
          <form onSubmit={handleSearchSubmit} className="relative flex">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="SEARCH HARDWARE..."
              className="w-full bg-cyber-bg border border-slate-800 focus:border-cyber-cyan/50 focus:outline-none rounded px-3 py-2 pl-9 pr-8 text-xs text-slate-300 font-display tracking-widest placeholder:text-slate-700 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-600" />
            
            {searchInput && (
              <button 
                type="button" 
                onClick={handleClearSearch}
                className="absolute right-2 top-2.5 p-0.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>

      </div>

      {/* Main Grid View */}
      {isLoading ? (
        /* Cyber loading screen */
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyber-cyan/10 border-t-cyber-cyan rounded-full animate-spin" />
            <Cpu className="h-6 w-6 text-cyber-cyan absolute animate-pulse" />
          </div>
          <div className="font-display text-xs tracking-widest text-slate-500 uppercase animate-pulse">
            Querying node database arrays...
          </div>
        </div>
      ) : products.length === 0 ? (
        /* Empty Matches State */
        <div className="text-center py-24 border border-dashed border-slate-900 rounded-2xl bg-cyber-dark/10">
          <Terminal className="h-10 w-10 text-slate-700 mx-auto mb-4 animate-pulse" />
          <h3 className="font-display font-bold text-lg text-slate-400 uppercase tracking-widest">QUERY RETURNED NULL</h3>
          <p className="text-slate-600 text-sm mt-1 mb-4">No matching records registered in this parameters bracket.</p>
          {(selectedCategory || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setSearchInput('');
                setCurrentPage(1);
              }}
            >
              PURGE FILTER PARAMS
            </Button>
          )}
        </div>
      ) : (
        /* Product Cards Grid */
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {products.map((product) => {
              const cardGlow = product.id % 3 === 0 ? 'purple' : product.id % 2 === 0 ? 'magenta' : 'cyan';
              const isOutOfStock = product.stock === 0 || product.status === 'OUT OF STOCK';
              
              return (
                <Card
                  key={product.id}
                  title={product.name}
                  glowColor={cardGlow}
                  tag={isOutOfStock ? "OUT OF STOCK" : product.status || "IN STOCK"}
                  className="flex flex-col justify-between min-h-[320px]"
                >
                  <div className="space-y-6 flex flex-col justify-between h-full text-left">
                    <div className="space-y-4">
                      {/* Description */}
                      <p className="text-slate-400 text-sm leading-relaxed min-h-[72px]">
                        {product.description}
                      </p>

                      {/* Hardware details tag */}
                      <div className="flex flex-wrap gap-2 text-[10px] font-display text-slate-400">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded uppercase">
                          Brand: {product.brand || "CYBERKEYS"}
                        </span>
                        {product.layout && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded uppercase">
                            LAYOUT: {product.layout}
                          </span>
                        )}
                        {product.case_material && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded uppercase">
                            CASE: {product.case_material}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div>
                        <div className="text-[10px] text-slate-500 font-display tracking-widest uppercase">CREDITS VALUE</div>
                        <div className="text-2xl font-display font-extrabold text-slate-100 tracking-wide">
                          ${parseFloat(product.price).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/products/${product.id}`}>
                          <Button variant="outline" className="px-3.5 py-2" aria-label={`Inspect ${product.name}`}>
                            <Info className="h-4.5 w-4.5" />
                          </Button>
                        </Link>
                        
                        <Button 
                          variant={isOutOfStock ? 'outline' : 'primary'} 
                          disabled={isOutOfStock}
                          className="px-5 py-2 text-xs"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1.5" />
                          {isOutOfStock ? 'RESTOCKING' : 'ACQUIRE'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-6 pt-4 font-display">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={`
                  p-2 border rounded cursor-pointer transition-all flex items-center gap-1 text-xs font-bold tracking-widest uppercase
                  ${currentPage <= 1 
                    ? 'border-slate-900 text-slate-600 pointer-events-none' 
                    : 'border-slate-800 hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan hover:shadow-[0_0_8px_rgba(0,240,255,0.25)]'}
                `}
              >
                <ChevronLeft className="h-4 w-4" />
                PREV PAGE
              </button>

              <div className="text-xs text-slate-500 tracking-widest uppercase">
                SECTOR MATRIX: <span className="text-slate-300 font-mono font-bold">{currentPage}</span> / <span className="text-slate-300 font-mono">{lastPage}</span>
              </div>

              <button
                disabled={currentPage >= lastPage}
                onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                className={`
                  p-2 border rounded cursor-pointer transition-all flex items-center gap-1 text-xs font-bold tracking-widest uppercase
                  ${currentPage >= lastPage 
                    ? 'border-slate-900 text-slate-600 pointer-events-none' 
                    : 'border-slate-800 hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan hover:shadow-[0_0_8px_rgba(0,240,255,0.25)]'}
                `}
              >
                NEXT PAGE
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;