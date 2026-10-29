import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Sun, 
  Camera, 
  FileText, 
  HeartHandshake,
  Layers
} from 'lucide-react';
import { ChecklistCategory, ChecklistItem } from '../types';
import { DESTINATIONS } from '../data/destinations';
import { exportChecklistPdf } from '../utils/pdfExport';

const DEFAULT_CATEGORIES: ChecklistCategory[] = [
  {
    name: 'Travel Documents & Money',
    items: [
      { id: 'c1', label: 'Valid Passport / Philippine Government ID', category: 'Travel Documents & Money', isChecked: true, isEssential: true },
      { id: 'c2', label: 'Printed or Offline E-Tickets & Boarding Passes', category: 'Travel Documents & Money', isChecked: true, isEssential: true },
      { id: 'c3', label: 'Cash in Philippine Peso (₱) for island tricycles & boat fees', category: 'Travel Documents & Money', isChecked: false, isEssential: true },
      { id: 'c4', label: 'Digital Wallet Apps (GCash / Maya) loaded with funds', category: 'Travel Documents & Money', isChecked: false, isEssential: true },
      { id: 'c5', label: 'Hotel Booking Confirmations & Vouchers', category: 'Travel Documents & Money', isChecked: false, isEssential: false },
    ]
  },
  {
    name: 'Island Gear & Ocean Protection',
    items: [
      { id: 'c6', label: 'Reef-safe Sunscreen (Oxybenzone-free)', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
      { id: 'c7', label: 'Dry Bag (10L–20L) for boat transfers & island hopping', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
      { id: 'c8', label: 'Snorkel Mask & Aqua Shoes for rocky reefs', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
      { id: 'c9', label: 'Quick-dry Microfiber Towels & Rashguard', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: false },
      { id: 'c10', label: 'Waterproof Phone Pouch with lanyard', category: 'Island Gear & Ocean Protection', isChecked: false, isEssential: true },
    ]
  },
  {
    name: 'Electronics & Power',
    items: [
      { id: 'c11', label: 'High-capacity Power Bank (10,000–20,000 mAh)', category: 'Electronics & Power', isChecked: false, isEssential: true },
      { id: 'c12', label: 'Universal Plug Adapter (Type A/B 220V)', category: 'Electronics & Power', isChecked: false, isEssential: false },
      { id: 'c13', label: 'Action Camera / GoPro with floating handgrip', category: 'Electronics & Power', isChecked: false, isEssential: false },
      { id: 'c14', label: 'Extra Charging Cables & SD Cards', category: 'Electronics & Power', isChecked: false, isEssential: false },
    ]
  },
  {
    name: 'Health, Medicine & Hygiene',
    items: [
      { id: 'c15', label: 'Anti-motion Sickness tablets (Bonamine/Dimenhydrinate)', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true },
      { id: 'c16', label: 'DEET / Citronella Mosquito Repellent', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true },
      { id: 'c17', label: 'Personal Prescription Meds & Rehydration Salts (Oralite)', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: true },
      { id: 'c18', label: 'First Aid Bandages & Antiseptic Wipes', category: 'Health, Medicine & Hygiene', isChecked: false, isEssential: false },
    ]
  }
];

export const TravelChecklistView: React.FC = () => {
  const [categories, setCategories] = useState<ChecklistCategory[]>(() => {
    const saved = localStorage.getItem('byahedor_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CATEGORIES;
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const [destName, setDestName] = useState('Siargao');
  const [tripDuration, setTripDuration] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCatForNew, setSelectedCatForNew] = useState(DEFAULT_CATEGORIES[0].name);

  useEffect(() => {
    localStorage.setItem('byahedor_checklist', JSON.stringify(categories));
  }, [categories]);

  // Calculate completion
  const allItems = categories.flatMap(c => c.items);
  const checkedItems = allItems.filter(i => i.isChecked);
  const percentComplete = allItems.length > 0 ? Math.round((checkedItems.length / allItems.length) * 100) : 0;

  const toggleItem = (id: string) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      items: cat.items.map(item => item.id === id ? { ...item, isChecked: !item.isChecked } : item)
    })));
  };

  const removeItem = (id: string) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.id !== id)
    })));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      label: newItemText.trim(),
      category: selectedCatForNew,
      isChecked: false,
      isEssential: false
    };

    setCategories(prev => prev.map(cat => {
      if (cat.name === selectedCatForNew) {
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    }));

    setNewItemText('');
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset checklist back to standard Philippine travel essentials?')) {
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  const handleAiSmartGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/smart-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destName,
          durationDays: tripDuration,
          activities: ['Island Hopping', 'Snorkeling', 'Beach', 'Dining'],
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          return;
        }
      }
      throw new Error('API unavailable, using destination smart checklist template');
    } catch (e) {
      console.warn('Using offline checklist generator fallback:', e);
      setCategories([
        {
          name: `Tropical Beach & Island Hopping (${destName})`,
          items: [
            { id: 'off-1', label: 'Eco-friendly reef-safe sunscreen (Oxybenzone-free)', category: `Tropical Beach & Island Hopping (${destName})`, isChecked: false, isEssential: true },
            { id: 'off-2', label: 'Waterproof dry bag (15L–20L) for boat transfers', category: `Tropical Beach & Island Hopping (${destName})`, isChecked: false, isEssential: true },
            { id: 'off-3', label: 'Snorkel mask and anti-fog spray', category: `Tropical Beach & Island Hopping (${destName})`, isChecked: false, isEssential: false },
            { id: 'off-4', label: 'Sturdy aqua shoes for coral and sea urchin protection', category: `Tropical Beach & Island Hopping (${destName})`, isChecked: false, isEssential: true },
            { id: 'off-5', label: 'Quick-dry microfiber beach towel', category: `Tropical Beach & Island Hopping (${destName})`, isChecked: false, isEssential: false },
          ]
        },
        {
          name: 'Philippine Travel Docs & Money',
          items: [
            { id: 'off-6', label: 'Valid Government ID / Passport', category: 'Philippine Travel Docs & Money', isChecked: false, isEssential: true },
            { id: 'off-7', label: 'Emergency cash in Philippine Pesos (₱500/₱100/₱50/₱20 bills)', category: 'Philippine Travel Docs & Money', isChecked: false, isEssential: true },
            { id: 'off-8', label: 'eTravel QR Code & airline boarding passes', category: 'Philippine Travel Docs & Money', isChecked: false, isEssential: true },
            { id: 'off-9', label: 'Hotel & island ferry booking confirmations (digital or printed)', category: 'Philippine Travel Docs & Money', isChecked: false, isEssential: false },
          ]
        },
        {
          name: 'Health & Island First Aid',
          items: [
            { id: 'off-10', label: 'Bonamine (Meclizine) for boat transfers and rough sea waves', category: 'Health & Island First Aid', isChecked: false, isEssential: true },
            { id: 'off-11', label: 'DEET or citronella mosquito repellent lotion/spray', category: 'Health & Island First Aid', isChecked: false, isEssential: true },
            { id: 'off-12', label: 'Oral rehydration salts (Hydrite) and paracetamol', category: 'Health & Island First Aid', isChecked: false, isEssential: false },
            { id: 'off-13', label: 'Waterproof band-aids and antiseptic wipes', category: 'Health & Island First Aid', isChecked: false, isEssential: false },
          ]
        },
        {
          name: 'Electronics & Island Gear',
          items: [
            { id: 'off-14', label: 'High-capacity power bank (10,000mAh–20,000mAh)', category: 'Electronics & Island Gear', isChecked: false, isEssential: true },
            { id: 'off-15', label: 'Waterproof phone pouch with neck lanyard', category: 'Electronics & Island Gear', isChecked: false, isEssential: true },
            { id: 'off-16', label: 'Universal travel adapter and fast charge cables', category: 'Electronics & Island Gear', isChecked: false, isEssential: false },
          ]
        }
      ]);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPdf = () => {
    exportChecklistPdf(categories, percentComplete, destName);
  };

  return (
    <div id="byahedor-checklist-view" className="space-y-5 pb-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#087EA4]/10 dark:bg-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8] text-[11px] font-bold mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Smart Packing Assistant</span>
          </div>
          <h1 className="text-fluid-title font-bold text-[#102A43] dark:text-white font-heading">
            Philippine Travel Checklist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Never forget reef-safe sunscreen, dry bags, or emergency Bonamine before boarding island boats.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-white dark:bg-[#0f233a] p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Packed Progress</span>
            <span className="text-base font-black text-[#39A96B]">
              {checkedItems.length} / {allItems.length} ({percentComplete}%)
            </span>
          </div>
          <div className="w-20 sm:w-24 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${percentComplete}%` }}
              className="h-full bg-gradient-to-r from-[#087EA4] to-[#39A96B] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* AI Tailoring Bar */}
      <div className="bg-gradient-to-r from-[#087EA4]/10 via-[#4DB8E8]/10 to-[#39A96B]/10 dark:from-[#087EA4]/20 dark:to-[#39A96B]/20 p-4 sm:p-5 rounded-2xl border border-[#087EA4]/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#087EA4] text-white shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4 text-[#FFB84D]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white font-heading">
              AI Destination Customizer
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Tailor this packing list for island conditions, ferry transfers, and hiking terrains.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <select
            value={destName}
            onChange={(e) => setDestName(e.target.value)}
            className="flex-1 sm:flex-initial py-2 px-2.5 rounded-xl bg-white dark:bg-[#0f233a] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#102A43] dark:text-white focus:outline-none min-h-[38px]"
          >
            {DESTINATIONS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <button
            onClick={handleAiSmartGenerate}
            disabled={generating}
            className="flex-1 sm:flex-initial min-h-[38px] py-2 px-3.5 rounded-xl bg-[#087EA4] hover:bg-[#076c8c] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {generating ? (
              <span>Generating...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
                <span>Tailor for {destName}</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportPdf}
            className="min-h-[38px] py-2 px-3 rounded-xl bg-white dark:bg-[#0f233a] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
            title="Export Packing Checklist as PDF Document"
          >
            <FileText className="w-3.5 h-3.5 text-[#087EA4]" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleResetChecklist}
            className="min-h-[38px] p-2 rounded-xl bg-white dark:bg-[#0f233a] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center active:scale-95"
            title="Reset Checklist"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-[#0f233a] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item (e.g. Drone batteries, Dive computer)..."
          className="flex-1 bg-transparent px-2.5 py-1.5 text-xs font-medium text-[#102A43] dark:text-white placeholder-slate-400 outline-none min-h-[38px]"
        />

        <div className="flex items-center gap-2">
          <select
            value={selectedCatForNew}
            onChange={(e) => setSelectedCatForNew(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border-none outline-none min-h-[38px]"
          >
            {categories.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#39A96B] hover:bg-[#2e8856] text-white font-bold text-xs flex items-center justify-center gap-1 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </form>

      {/* Categorized Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white dark:bg-[#0f233a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  {cat.items.filter(i => i.isChecked).length} / {cat.items.length}
                </span>
              </div>

              <div className="space-y-2 pt-3">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-2xl transition-all ${
                      item.isChecked
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-400 dark:text-slate-500'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="flex items-start gap-2.5 text-left flex-1"
                    >
                      {item.isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#39A96B] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs font-semibold leading-snug ${item.isChecked ? 'line-through' : ''}`}>
                        {item.label}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.isEssential && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold uppercase">
                          Essential
                        </span>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
