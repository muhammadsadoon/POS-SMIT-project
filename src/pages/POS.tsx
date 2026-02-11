import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface CartItem {
  product: Tables<"products">;
  quantity: number;
}

const POS = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("products").select("*").eq("user_id", user.id).gt("stock", 0).order("name").then(({ data }) => {
      setProducts(data || []);
    });
  }, [user]);

  const addToCart = (product: Tables<"products">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast({ title: "Out of stock", variant: "destructive" });
          return prev;
        }
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const newQty = i.quantity + delta;
        if (newQty <= 0) return i;
        if (newQty > i.product.stock) return i;
        return { ...i, quantity: newQty };
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const total = cart.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  const checkout = async (paymentMethod: string) => {
    if (!user || cart.length === 0) return;
    setProcessing(true);

    try {
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({ total, payment_method: paymentMethod, user_id: user.id })
        .select()
        .single();
      if (saleError) throw saleError;

      const items = cart.map((i) => ({
        sale_id: sale.id,
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        price: Number(i.product.price),
        subtotal: Number(i.product.price) * i.quantity,
      }));

      const { error: itemsError } = await supabase.from("sale_items").insert(items);
      if (itemsError) throw itemsError;

      // Update stock
      for (const item of cart) {
        await supabase.from("products").update({ stock: item.product.stock - item.quantity }).eq("id", item.product.id);
      }

      toast({ title: "Sale completed!", description: `Total: Rs ${total.toLocaleString()}` });
      setCart([]);

      // Refresh products
      const { data } = await supabase.from("products").select("*").eq("user_id", user.id).gt("stock", 0).order("name");
      setProducts(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* Products Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <div className="relative mt-3 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-min">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => addToCart(p)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                <p className="text-primary font-bold mt-1">Rs {Number(p.price).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Stock: {p.stock}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <Card className="w-80 xl:w-96 border-0 shadow-lg flex flex-col shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5" /> Cart ({cart.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 pt-0">
          <div className="flex-1 overflow-auto space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Rs {Number(item.product.price).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateQty(item.product.id, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => updateQty(item.product.id, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button className="gap-2" onClick={() => checkout("cash")} disabled={cart.length === 0 || processing}>
                <Banknote className="w-4 h-4" /> Cash
              </Button>
              <Button variant="secondary" className="gap-2" onClick={() => checkout("card")} disabled={cart.length === 0 || processing}>
                <CreditCard className="w-4 h-4" /> Card
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POS;
