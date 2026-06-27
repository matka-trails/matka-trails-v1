"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  Inbox,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

const COLORS = ["#ff6600", "#111111", "#999999"];

export default function DashboardConsole() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-border rounded-2xl p-6 h-32 space-y-3">
              <div className="h-4 bg-gray-bg rounded w-1/3" />
              <div className="h-8 bg-gray-bg rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="h-80 bg-white border border-gray-border rounded-2xl p-6" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-gray-border rounded-2xl p-10 text-center">
        <h3 className="font-sans font-extrabold text-lg text-black">Failed to load statistics</h3>
        <p className="text-xs text-gray-light font-semibold mt-1">Please try again later.</p>
      </div>
    );
  }

  const {
    totalLeads,
    newLeadsThisWeek,
    confirmedBookings,
    publishedPackages,
    revenuePipeline,
    leadsByDay = [],
    leadsBySource = [],
    recentLeads = [],
  } = data;

  const statCards = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: <Users className="w-5 h-5 text-primary" />,
      desc: "All-time submissions",
    },
    {
      title: "New Leads",
      value: newLeadsThisWeek,
      icon: <Inbox className="w-5 h-5 text-primary" />,
      desc: "Received this week",
      glow: newLeadsThisWeek > 0,
    },
    {
      title: "Confirmed Trails",
      value: confirmedBookings,
      icon: <Award className="w-5 h-5 text-primary" />,
      desc: "Travelers locked in",
    },
    {
      title: "Revenue Pipeline",
      value: formatPrice(revenuePipeline),
      icon: <DollarSign className="w-5 h-5 text-primary" />,
      desc: "Confirmed booking volume",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Dynamic welcome header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
          Executive Summary
        </h1>
      </div>

      {/* Grid: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={cn(
              "bg-white border rounded-2xl p-5 flex items-center justify-between shadow-card hover:shadow-hover transition-all duration-200",
              card.glow ? "border-primary ring-1 ring-primary/20 bg-primary-light/10" : "border-gray-border"
            )}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-light uppercase tracking-wider block">
                {card.title}
              </span>
              <span className="font-sans font-black text-2xl text-black block leading-tight">
                {card.value}
              </span>
              <span className="text-[9px] text-gray-mid font-medium block">
                {card.desc}
              </span>
            </div>
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp className="w-4.5 h-4.5 text-primary shrink-0" />
            <span>Lead Volume Trend (Last 30 Days)</span>
          </h3>
          <div className="h-64 w-full">
            {leadsByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6600" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ff6600" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickFormatter={(str) => {
                    const d = new Date(str);
                    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                  }} style={{ fontSize: "10px", fontWeight: "600", fill: "#999" }} />
                  <YAxis style={{ fontSize: "10px", fontWeight: "600", fill: "#999" }} />
                  <Tooltip labelFormatter={(str) => {
                    const d = new Date(str);
                    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
                  }} contentStyle={{ fontFamily: "var(--font-main)", fontSize: "12px", borderRadius: "10px" }} />
                  <Area type="monotone" dataKey="count" name="Submissions" stroke="#ff6600" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-light italic font-semibold">
                No trend data logged.
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart: Sources */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
            <Users className="w-4.5 h-4.5 text-primary shrink-0" />
            <span>Lead Sources</span>
          </h3>
          <div className="h-64 w-full flex flex-col items-center justify-center">
            {leadsBySource.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="source"
                  >
                    {leadsBySource.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: "var(--font-main)", fontSize: "12px", borderRadius: "10px" }} />
                  <Legend verticalAlign="bottom" style={{ fontSize: "10px", fontWeight: "bold" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-light italic font-semibold">
                No source metrics logged.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Leads Table */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-border flex items-center justify-between">
          <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wide">
            Recent Leads Activity
          </h3>
          <Link
            href="/admin/leads"
            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
          >
            View All Pipeline
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-dark border-collapse">
            <thead>
              <tr className="bg-gray-bg border-b border-gray-border uppercase text-[10px] font-bold tracking-wider text-gray-light">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Package Inquiry</th>
                <th className="p-4">Status</th>
                <th className="p-4">Received</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length > 0 ? (
                recentLeads.map((lead: any) => {
                  const statusColors = {
                    NEW: "bg-primary-light text-primary border-primary/20",
                    CONTACTED: "bg-blue-50 text-blue-600 border-blue-200",
                    CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-200",
                    REJECTED: "bg-gray-bg text-gray-mid border-gray-border",
                  }[lead.status as "NEW" | "CONTACTED" | "CONFIRMED" | "REJECTED"];

                  return (
                    <tr key={lead.id} className="border-b border-gray-border hover:bg-gray-bg/25">
                      <td className="p-4 font-bold text-black">{lead.name}</td>
                      <td className="p-4">{lead.phone}</td>
                      <td className="p-4 truncate max-w-[200px]">
                        {lead.package?.title || "General Inquiry / Custom"}
                      </td>
                      <td className="p-4">
                        <span className={cn("text-[9px] font-extrabold px-2.5 py-1 rounded border uppercase tracking-wider", statusColors)}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-light">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-xs text-gray-light italic font-semibold">
                    No recent leads received.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
