'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { useProductsStore } from '@/store/productsStore';
import { useToastStore } from '@/store/toastStore';
import { slugify } from '@/lib/utils';
import Button from '@/components/ui/Button';

type FormData = Omit<Product, 'id' | 'createdAt'>;

const CATEGORIES = [
  'Headphones', 'Laptops', 'Smartphones', 'Tablets', 'Cameras',
  'Wearables', 'TVs & Displays', 'Audio', 'Accessories', 'Gaming',
];

interface ProductFormProps {
  product?: Product;
  mode: 'new' | 'edit';
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct } = useProductsStore();
  const addToast = useToastStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>(product?.images?.slice(1) ?? []);
  const [extraInput, setExtraInput] = useState('');

  const [form, setForm] = useState<FormData>({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category: product?.category ?? CATEGORIES[0],
    price: product?.price ?? 0,
    originalPrice: product?.originalPrice ?? undefined,
    description: product?.description ?? '',
    longDescription: product?.longDescription ?? '',
    image: product?.image ?? '',
    images: product?.images ?? [],
    stock: product?.stock ?? 0,
    sku: product?.sku ?? '',
    rating: product?.rating ?? 4.5,
    featured: product?.featured ?? false,
    status: product?.status ?? 'active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-slug on name change
      if (key === 'name' && mode === 'new') {
        next.slug = slugify(value as string);
      }
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  }

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.slug.trim()) e.slug = 'Slug is required';
    if (form.price <= 0) e.price = 'Price must be greater than 0';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.image.trim()) e.image = 'Image URL is required';
    if (form.stock < 0) e.stock = 'Stock cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const finalImages = [form.image, ...extraImages.filter(Boolean)];
    const data = { ...form, images: finalImages };

    if (mode === 'new') {
      addProduct(data);
      addToast('Product created successfully');
    } else if (product) {
      updateProduct(product.id, data);
      addToast('Product updated successfully');
    }

    setLoading(false);
    router.push('/admin/products');
  }

  function addExtraImage() {
    if (extraInput.trim()) {
      setExtraImages((imgs) => [...imgs, extraInput.trim()]);
      setExtraInput('');
    }
  }

  function removeExtraImage(i: number) {
    setExtraImages((imgs) => imgs.filter((_, idx) => idx !== i));
  }

  const Field = ({
    label, field, type = 'text', placeholder, required = false,
    className = '', min, step, as: As = 'input',
  }: {
    label: string; field: keyof FormData; type?: string; placeholder?: string;
    required?: boolean; className?: string; min?: number; step?: number;
    as?: 'input' | 'textarea';
  }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {As === 'textarea' ? (
        <textarea
          value={form[field] as string}
          onChange={(e) => update(field, e.target.value as any)}
          placeholder={placeholder}
          rows={4}
          className={`bg-white border px-4 py-3 text-sm text-[#171717] placeholder-[#6F6F68] focus:outline-none resize-none transition-colors ${
            errors[field] ? 'border-red-400' : 'border-[#E5E3DC] focus:border-[#315C45]'
          }`}
        />
      ) : (
        <input
          type={type}
          value={form[field] as string | number}
          onChange={(e) =>
            update(field, (type === 'number' ? parseFloat(e.target.value) : e.target.value) as any)
          }
          placeholder={placeholder}
          min={min}
          step={step}
          className={`bg-white border px-4 py-3 text-sm text-[#171717] placeholder-[#6F6F68] focus:outline-none transition-colors ${
            errors[field] ? 'border-red-400' : 'border-[#E5E3DC] focus:border-[#315C45]'
          }`}
        />
      )}
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-sm text-[#6F6F68] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Products
        </Link>
        <span className="text-[#E5E3DC]">/</span>
        <h1 className="font-serif text-3xl text-[#171717]">
          {mode === 'new' ? 'Add Product' : 'Edit Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        {/* Basic Info */}
        <section className="bg-white border border-[#E5E3DC] p-6">
          <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-5">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name" field="name" required className="sm:col-span-2" placeholder="e.g. Sony WH-1000XM5" />
            <Field label="Slug" field="slug" required placeholder="e.g. sony-wh-1000xm5" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#315C45] appearance-none transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Field label="Description" field="description" as="textarea" required className="sm:col-span-2" placeholder="Short product description" />
            <Field label="Long Description" field="longDescription" as="textarea" className="sm:col-span-2" placeholder="Detailed product information…" />
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white border border-[#E5E3DC] p-6">
          <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-5">
            Pricing & Inventory
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Price ($)" field="price" type="number" required min={0} step={0.01} />
            <Field label="Original Price ($)" field="originalPrice" type="number" min={0} step={0.01} />
            <Field label="Stock" field="stock" type="number" required min={0} />
            <Field label="SKU" field="sku" placeholder="ABC-123" />
          </div>
        </section>

        {/* Images */}
        <section className="bg-white border border-[#E5E3DC] p-6">
          <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-5">
            Images
          </h2>
          <Field label="Main Image URL" field="image" required placeholder="https://…" />

          {/* Preview */}
          {form.image && (
            <div className="mt-3 h-32 w-32 overflow-hidden bg-[#F7F6F1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Additional images */}
          <div className="mt-4">
            <label className="text-xs font-medium text-[#171717] uppercase tracking-wide block mb-2">
              Additional Images
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={extraInput}
                onChange={(e) => setExtraInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExtraImage())}
                placeholder="https://…"
                className="flex-1 bg-white border border-[#E5E3DC] px-4 py-2.5 text-sm text-[#171717] placeholder-[#6F6F68] focus:outline-none focus:border-[#315C45] transition-colors"
              />
              <button
                type="button"
                onClick={addExtraImage}
                className="h-10 w-10 flex items-center justify-center bg-[#F7F6F1] border border-[#E5E3DC] text-[#6F6F68] hover:text-[#171717] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {extraImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {extraImages.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden bg-[#F7F6F1]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(i)}
                      className="absolute top-0.5 right-0.5 h-4 w-4 bg-white/90 flex items-center justify-center text-red-500"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Meta */}
        <section className="bg-white border border-[#E5E3DC] p-6">
          <h2 className="text-xs font-semibold tracking-widest text-[#6F6F68] uppercase mb-5">
            Settings
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Rating" field="rating" type="number" min={0} step={0.1} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#171717] uppercase tracking-wide">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as 'active' | 'draft')}
                className="bg-white border border-[#E5E3DC] px-4 py-3 text-sm text-[#171717] focus:outline-none focus:border-[#315C45] appearance-none"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="h-4 w-4 accent-[#315C45]"
              />
              <label htmlFor="featured" className="text-sm text-[#171717] cursor-pointer">
                Featured Product
              </label>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" loading={loading} variant="primary" size="lg">
            {mode === 'new' ? 'Create Product' : 'Save Changes'}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
