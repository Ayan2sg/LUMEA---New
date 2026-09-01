import { useEffect, useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import api, { inr, apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount_percent: "", min_amount: "", active: true });

  const load = () => api.get("/coupons").then((r) => setCoupons(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      await api.post("/coupons", {
        code: form.code, discount_percent: parseFloat(form.discount_percent) || 0,
        min_amount: parseFloat(form.min_amount) || 0, active: form.active,
      });
      toast.success("Coupon created");
      setOpen(false); setForm({ code: "", discount_percent: "", min_amount: "", active: true }); load();
    } catch (err) { toast.error(apiError(err.response?.data?.detail)); }
  };

  const del = async (id) => { await api.delete(`/coupons/${id}`); toast.success("Coupon deleted"); load(); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-600 tracking-tighter">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">{coupons.length} active codes</p>
        </div>
        <Button data-testid="add-coupon-btn" onClick={() => setOpen(true)} className="gap-2 rounded-none bg-black hover:bg-accent"><Plus size={16} /> New Coupon</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="relative border border-dashed border-black/30 bg-white p-6" data-testid={`coupon-${c.id}`}>
            <Tag size={18} className="text-accent" />
            <p className="mt-3 font-display text-2xl font-600 tracking-tight">{c.code}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.discount_percent}% off {c.min_amount > 0 ? `· min ${inr(c.min_amount)}` : ""}</p>
            <button data-testid={`delete-coupon-${c.id}`} onClick={() => del(c.id)} className="absolute right-4 top-4 text-muted-foreground hover:text-accent"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display text-2xl tracking-tight">New Coupon</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Code</Label><Input data-testid="coupon-code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER25" className="mt-1 rounded-none" /></div>
            <div><Label>Discount %</Label><Input data-testid="coupon-discount" type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} className="mt-1 rounded-none" /></div>
            <div><Label>Minimum order (₹)</Label><Input data-testid="coupon-min" type="number" value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: e.target.value })} className="mt-1 rounded-none" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-none">Cancel</Button>
            <Button data-testid="save-coupon-btn" onClick={save} className="rounded-none bg-black hover:bg-accent">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
