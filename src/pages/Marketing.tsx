import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Users, 
  Upload, 
  MessageSquare, 
  Send, 
  Trash2, 
  Search, 
  CheckCircle,
  AlertCircle,
  FileText,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  mobile: string;
  source: string;
  status: string;
  created_at: string;
}

const Marketing = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [marketingMessage, setMarketingMessage] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkInput.trim()) {
      toast.error("Please enter some numbers");
      return;
    }

    // Split input by new line or comma
    const entries = bulkInput.split(/[\n,]/).filter(entry => entry.trim());
    const newLeads = entries.map(entry => {
      const parts = entry.trim().split(/\t| /); 
      const mobile = parts[0].replace(/[^0-9]/g, '');
      const name = parts.length > 1 ? parts.slice(1).join(' ') : 'Lead';
      
      return {
        name,
        mobile,
        source: 'Bulk Upload',
        status: 'pending'
      };
    }).filter(lead => lead.mobile.length >= 10);

    if (newLeads.length === 0) {
      toast.error("No valid numbers found. Make sure numbers are 10-11 digits.");
      return;
    }

    try {
      const { error } = await supabase.from('marketing_leads').insert(newLeads);
      if (error) throw error;
      
      toast.success(`${newLeads.length} leads added successfully!`);
      setBulkInput('');
      setShowBulkModal(false);
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase.from('marketing_leads').delete().eq('id', id);
      if (error) throw error;
      setLeads(leads.filter(l => l.id !== id));
      toast.success("Lead deleted");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyNumbers = () => {
    const numbers = leads.map(l => l.mobile).join('\n');
    navigator.clipboard.writeText(numbers);
    toast.success("All numbers copied! You can now paste them into your WhatsApp Sender extension.");
  };

  const openWhatsApp = (mobile: string) => {
    const msg = encodeURIComponent(marketingMessage || "Hello! Message from English Therapy.");
    window.open(`https://wa.me/${mobile}?text=${msg}`, '_blank');
  };

  const filteredLeads = leads.filter(l => 
    l.mobile.includes(searchTerm) || 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 sm:pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketing Center</h1>
            <p className="text-slate-500 font-medium">Manage leads and run bulk campaigns</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Upload className="h-5 w-5" />
              Import Leads
            </button>
            <button 
              onClick={copyNumbers}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Copy className="h-5 w-5" />
              Copy Numbers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Campaign Message</h2>
              </div>
              <textarea 
                value={marketingMessage}
                onChange={(e) => setMarketingMessage(e.target.value)}
                placeholder="Write your marketing message here... (e.g. ভর্তি চলছে! নতুন ব্যাচে ৩০% ডিসকাউন্ট...)"
                className="w-full h-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
              />
              <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700 font-bold leading-relaxed">
                    Note: To send bulk messages for FREE, use a WhatsApp Sender extension. Copy all numbers from here and paste them into the extension.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <h3 className="font-black text-xl mb-2">WhatsApp Extension Guide</h3>
              <ul className="text-sm space-y-3 font-medium text-white/80">
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">1</div>
                  Install 'WA Web Plus' or 'Prime Sender' from Chrome Store.
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">2</div>
                  Open WhatsApp Web and click the extension icon.
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">3</div>
                  Click 'Copy Numbers' in this app and paste in the extension.
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">4</div>
                  Add your message and click 'Send Campaign'.
                </li>
              </ul>
            </div>
          </div>

          {/* Leads List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads by name or mobile..."
                className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase">
                {filteredLeads.length} Total
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Lead Details</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Mobile</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading leads...</td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No leads found. Import some to get started.</td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                {lead.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{lead.name}</p>
                                <p className="text-xs text-slate-500">{lead.source}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-600">{lead.mobile}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100">
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => openWhatsApp(lead.mobile)}
                                className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                                title="Send individually"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => deleteLead(lead.id)}
                                className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowBulkModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Import Bulk Leads</h2>
              <button onClick={() => setShowBulkModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Trash2 className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 font-medium">
                Paste your numbers below. Each number on a new line or separated by commas.
                Format: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">01712345678 Name</code>
              </p>
              <textarea 
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="01711223344 John Doe&#10;01822334455 Jane Smith"
                className="w-full h-64 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
              <button 
                onClick={handleBulkUpload}
                disabled={!bulkInput.trim()}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Import Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;
