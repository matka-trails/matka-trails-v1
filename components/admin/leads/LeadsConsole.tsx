"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  Users,
  Search,
  Download,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  Inbox,
  User,
  X,
  FileText,
  Clock,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";

type LeadStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "REJECTED";

export default function LeadsConsole() {
  const queryClient = useQueryClient();
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Fetch leads
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => adminApi.getLeads(),
  });

  // Mutate lead status/notes
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; adminNotes?: string } }) =>
      adminApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Lead updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update lead.");
    },
  });

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const handleNotesSave = (id: string, notes: string) => {
    updateMutation.mutate({ id, data: { status: activeLead?.status || "NEW", adminNotes: notes } });
  };

  // Filter logic
  const filteredLeads = leads.filter((lead: any) => {
    const statusMatch = selectedStatusTab === "ALL" || lead.status === selectedStatusTab;
    const searchMatch =
      !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && searchMatch;
  });

  // Selected Lead details drawer target
  const activeLead = leads.find((l: any) => l.id === selectedLeadId);

  // CSV download helper
  const handleExportCSV = () => {
    // Only export filtered lists
    const confirmedLeads = filteredLeads.filter((l: any) => l.status === "CONFIRMED");
    const targets = confirmedLeads.length > 0 ? confirmedLeads : filteredLeads;

    const headers = ["Name", "Phone", "Email", "Package", "Group Size", "Travel Date", "Status", "Received Date"];
    const rows = targets.map((l: any) => [
      l.name,
      l.phone,
      l.email || "",
      l.package?.title || "General Inquiry",
      l.groupSize || 1,
      l.preferredDate || "",
      l.status,
      new Date(l.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e: any) => e.map((val: any) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `matka_trails_leads_${selectedStatusTab.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export complete!");
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Dynamic console header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            Leads Pipeline
          </h1>
        </div>

        {/* Action triggers */}
        <button
          onClick={handleExportCSV}
          disabled={filteredLeads.length === 0}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter tab bar & search grid */}
      <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs row */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["ALL", "NEW", "CONTACTED", "CONFIRMED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatusTab(tab)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap",
                  selectedStatusTab === tab
                    ? "bg-[#111111] border-[#111111] text-white"
                    : "bg-gray-bg border-gray-border text-gray-dark hover:bg-gray-border"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-light" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white transition-all"
            />
          </div>

        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-dark border-collapse">
            <thead>
              <tr className="bg-gray-bg border-b border-gray-border uppercase text-[10px] font-bold tracking-wider text-gray-light">
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Package</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-border">
                    <td colSpan={7} className="p-8">
                      <div className="h-4 bg-gray-bg rounded w-3/4" />
                    </td>
                  </tr>
                ))
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead: any) => {
                  const statusColors = {
                    NEW: "bg-primary-light text-primary border-primary/20",
                    CONTACTED: "bg-blue-50 text-blue-600 border-blue-200",
                    CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-200",
                    REJECTED: "bg-gray-bg text-gray-mid border-gray-border",
                  }[lead.status as LeadStatus];

                  return (
                    <tr
                      key={lead.id}
                      className={cn(
                        "border-b border-gray-border hover:bg-gray-bg/25 transition-colors cursor-pointer",
                        selectedLeadId === lead.id ? "bg-primary-light/10" : ""
                      )}
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <td className="p-4">
                        <div className="font-bold text-black">{lead.name}</div>
                        <div className="text-[10px] text-gray-light font-bold truncate max-w-[120px]">
                          {lead.email || "No email"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-primary shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 truncate max-w-[180px]">
                        {lead.package?.title || "General Inquiry"}
                      </td>
                      <td className="p-4">
                        <div className="text-[10px] space-y-0.5">
                          <div>Size: {lead.groupSize || 1} pax</div>
                          <div className="text-gray-light">Date: {lead.preferredDate || "N/A"}</div>
                        </div>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={cn(
                            "text-[9px] font-extrabold px-2 py-1 rounded border uppercase tracking-wider focus:outline-none",
                            statusColors
                          )}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-light">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit" })}
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-xs text-gray-light italic font-semibold">
                    No leads found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-in Task Detail Panel ── */}
      {activeLead && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-border shadow-float flex flex-col justify-between animate-slideIn">
          {/* Header */}
          <div className="bg-[#111111] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-primary">
                {activeLead.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-base truncate max-w-[200px]">
                  {activeLead.name}
                </h3>
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold block mt-0.5">
                  Lead Details Console
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedLeadId(null)}
              className="p-1 rounded-lg border border-white/10 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs font-semibold text-gray-dark">
            {/* Quick overview */}
            <div className="grid grid-cols-2 gap-4 border-b border-gray-border pb-5">
              <div>
                <span className="text-[9px] text-gray-light uppercase tracking-wider block mb-1">Phone Number</span>
                <span className="text-black text-sm font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{activeLead.phone}</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-light uppercase tracking-wider block mb-1">Email Address</span>
                <span className="text-black text-sm font-bold break-all">
                  {activeLead.email || "—"}
                </span>
              </div>
            </div>

            {/* Travel metrics */}
            <div className="space-y-3.5 border-b border-gray-border pb-5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-light uppercase tracking-wider">Requested Trail</span>
                <span className="text-black font-bold text-right truncate max-w-[200px]">
                  {activeLead.package?.title || "General / Custom"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-light uppercase tracking-wider">Preferred Month</span>
                <span className="text-black font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{activeLead.preferredDate || "Not set"}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-light uppercase tracking-wider">Group size</span>
                <span className="text-black font-bold">
                  {activeLead.groupSize || 1} Pax
                </span>
              </div>
            </div>

            {/* Message notes */}
            <div className="space-y-2 border-b border-gray-border pb-5">
              <span className="text-[9px] text-gray-light uppercase tracking-wider block">Customer Travel Notes</span>
              <div className="bg-gray-bg border border-gray-border rounded-xl p-4 italic text-gray-mid font-medium leading-relaxed">
                {activeLead.message ? `"${activeLead.message}"` : "No specific notes provided."}
              </div>
            </div>

            {/* Status Selector dropdown in detail panel */}
            <div className="space-y-2">
              <span className="text-[9px] text-gray-light uppercase tracking-wider block">Change Pipeline Status</span>
              <select
                value={activeLead.status}
                onChange={(e) => handleStatusChange(activeLead.id, e.target.value as LeadStatus)}
                className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl font-bold uppercase tracking-wider text-xs focus:outline-none"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            {/* Admin Internal notes text area */}
            <div className="space-y-2">
              <span className="text-[9px] text-gray-light uppercase tracking-wider block">Internal Coordinator Notes</span>
              <textarea
                rows={3}
                defaultValue={activeLead.adminNotes || ""}
                onBlur={(e) => handleNotesSave(activeLead.id, e.target.value)}
                placeholder="Write private details, logs of callbacks, customer demographics matching notes..."
                className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl focus:outline-none focus:bg-white resize-none text-xs font-semibold"
              />
              <span className="text-[9px] text-gray-light font-medium block">
                ✦ Focus out of text area to save notes automatically.
              </span>
            </div>
          </div>

          {/* Footer close button */}
          <div className="p-5 border-t border-gray-border bg-gray-bg flex items-center justify-end">
            <button
              onClick={() => setSelectedLeadId(null)}
              className="bg-[#111111] hover:bg-[#222] text-white font-bold text-xs uppercase tracking-wide px-5 py-3 rounded-xl cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
