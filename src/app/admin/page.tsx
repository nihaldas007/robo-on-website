"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Wrench, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "৳0", icon: DollarSign, trend: "0%", trendUp: true },
    { label: "Active Students", value: "0", icon: Users, trend: "0%", trendUp: true },
    { label: "Courses Published", value: "0", icon: BookOpen, trend: "0", trendUp: true },
    { label: "Active Projects", value: "0", icon: Wrench, trend: "0", trendUp: false },
  ];

  const recentOrders: any[] = [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 transition-all transform-gpu" style={{ background: 'radial-gradient(circle, rgba(60,179,150,0.1) 0%, rgba(60,179,150,0) 70%)' }}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/30 transition-colors">
                <stat.icon size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Course Sales</h2>
            <Link href="/admin/sales" className="text-sm text-primary hover:text-white transition-colors">View All →</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order, i) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-mono text-gray-400">{order.id}</td>
                    <td className="py-4 font-medium text-white">{order.user}</td>
                    <td className="py-4 text-gray-300 group-hover:text-primary transition-colors">{order.course}</td>
                    <td className="py-4 text-gray-500">{order.date}</td>
                    <td className="py-4 font-bold text-white text-right">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4 flex-1">
            <Link href="/admin/courses/new" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 group transition-all">
              <div className="p-2 bg-black/40 rounded-lg group-hover:bg-primary/20 transition-colors">
                <BookOpen size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">Publish Course</h4>
                <p className="text-xs text-gray-500">Upload new video content</p>
              </div>
            </Link>

            <Link href="/admin/projects/new" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 group transition-all">
              <div className="p-2 bg-black/40 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Wrench size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">Add Project</h4>
                <p className="text-xs text-gray-500">Showcase a new client build</p>
              </div>
            </Link>

            <Link href="/admin/users/invite" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 group transition-all">
              <div className="p-2 bg-black/40 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Users size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">Invite Team</h4>
                <p className="text-xs text-gray-500">Manage administrator access</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
