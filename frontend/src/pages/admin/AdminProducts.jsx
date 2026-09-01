import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import api, { mediaUrl, inr, apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const empty = { name: "", description: "", price: "", category: "Fashion", stock: "", images: [], featured: false, tags: [], variants: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = () => api.get("/products").then((r) => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p, price: String(p.price), stock: String(p.stock), tags: p.tags || [], variants: p.variants || [] }); setOpen(true); };

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
      toast.success("Image uploaded");
    } catch (err) { toast.error(apiError(err.response?.data?.detail)); }
    finally { setUploading(false); }
  };

  const save = async () => {
    const variants = (form.variants || [])
      .map((v) => ({ size: (v.size || "").trim(), color: (v.color || "").trim(), stock: parseInt(v.stock) || 0 }))
      .filter((v) => v.size || v.color);
    const payload = {
      ...form, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0, variants,
      tags: typeof form.tags === "string" ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
    };
    try {
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post("/products", payload);
      toast.success(editing ? "Product updated" : "Product created");
      setOpen(false); load();
    } catch (err) { toast.error(apiError(err.response?.data?.detail)); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-600 tracking-tighter">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <Button data-testid="add-product-btn" onClick={openNew} className="gap-2 rounded-none bg-black hover:bg-accent"><Plus size={16} /> Add Product</Button>
      </div>

      <div className="mt-8 border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-black/10 bg-[#f9fafb] text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Featured</th><th className="p-4"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0" data-testid={`admin-product-${p.id}`}>
                <td className="p-4"><div className="flex items-center gap-3"><img src={mediaUrl(p.images?.[0])} alt="" className="h-12 w-10 object-cover" /><span className="font-500">{p.name}</span></div></td>
                <td className="p-4 text-muted-foreground">{p.category}</td>
                <td className="p-4">{inr(p.price)}</td>
                <td className="p-4"><span className={p.stock < 10 ? "text-accent" : ""}>{p.stock}</span></td>
                <td className="p-4">{p.featured ? "Yes" : "—"}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button data-testid={`edit-${p.id}`} onClick={() => openEdit(p)} className="p-1.5 hover:text-accent"><Pencil size={15} /></button>
                    <button data-testid={`delete-${p.id}`} onClick={() => del(p.id)} className="p-1.5 hover:text-accent"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-2xl tracking-tight">{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input data-testid="form-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-none" /></div>
            <div><Label>Description</Label><Textarea data-testid="form-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 rounded-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price (₹)</Label><Input data-testid="form-price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 rounded-none" /></div>
              <div><Label>Stock</Label><Input data-testid="form-stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1 rounded-none" /></div>
            </div>
            <div><Label>Category</Label><Input data-testid="form-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 rounded-none" /></div>
            <div>
              <Label>Images</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative h-20 w-16">
                    <img src={mediaUrl(img)} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => setForm({ ...form, images: form.images.filter((_, x) => x !== i) })} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-black text-white"><X size={12} /></button>
                  </div>
                ))}
                <button data-testid="upload-image-btn" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex h-20 w-16 flex-col items-center justify-center gap-1 border border-dashed border-black/30 text-xs text-muted-foreground hover:border-accent hover:text-accent">
                  <Upload size={16} /> {uploading ? "…" : "Add"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} data-testid="file-input" />
              </div>
            </div>
            <div className="flex items-center gap-3"><Switch data-testid="form-featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Featured product</Label></div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Variants (size / color / stock)</Label>
                <button type="button" data-testid="add-variant-btn"
                  onClick={() => setForm({ ...form, variants: [...(form.variants || []), { size: "", color: "", stock: "" }] })}
                  className="flex items-center gap-1 text-xs text-accent hover:underline"><Plus size={13} /> Add variant</button>
              </div>
              {(form.variants || []).length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">Total stock auto-sums from variants ({(form.variants || []).reduce((s, v) => s + (parseInt(v.stock) || 0), 0)}).</p>
              )}
              <div className="mt-2 space-y-2">
                {(form.variants || []).map((v, i) => (
                  <div key={i} className="flex gap-2" data-testid={`variant-row-${i}`}>
                    <Input placeholder="Size (e.g. M)" value={v.size} data-testid={`variant-size-${i}`}
                      onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...nv[i], size: e.target.value }; setForm({ ...form, variants: nv }); }} className="rounded-none" />
                    <Input placeholder="Color (e.g. Black)" value={v.color} data-testid={`variant-color-${i}`}
                      onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...nv[i], color: e.target.value }; setForm({ ...form, variants: nv }); }} className="rounded-none" />
                    <Input placeholder="Stock" type="number" value={v.stock} data-testid={`variant-stock-${i}`}
                      onChange={(e) => { const nv = [...form.variants]; nv[i] = { ...nv[i], stock: e.target.value }; setForm({ ...form, variants: nv }); }} className="w-24 rounded-none" />
                    <button type="button" data-testid={`remove-variant-${i}`} onClick={() => setForm({ ...form, variants: form.variants.filter((_, x) => x !== i) })} className="px-2 text-muted-foreground hover:text-accent"><X size={15} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-none">Cancel</Button>
            <Button data-testid="save-product-btn" onClick={save} className="rounded-none bg-black hover:bg-accent">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
