"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { MessageSquare, Users } from "lucide-react";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import type { QuoteDocument } from "@/lib/schema";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ quotes: 0, users: 0 });
  const [recentQuotes, setRecentQuotes] = useState<QuoteDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener for quotes
    const q = query(collections.quotes, orderBy("createdAt", "desc"), limit(5));
    
    const unsubscribeQuotes = onSnapshot(q, (snapshot) => {
      const quotesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentQuotes(quotesData);
      setStats(prev => ({ ...prev, quotes: snapshot.size })); // Note: this is only the size of the limited query. For full count we need a different approach, but this is ok for a simple dashboard.
      setLoading(false);
    });

    // Fetch other stats once
    const fetchStats = async () => {
      const usersSnapshot = await getDocs(collections.users);
      
      setStats(prev => ({
        ...prev,
        users: usersSnapshot.size
      }));
    };
    
    fetchStats();

    return () => unsubscribeQuotes();
  }, []);

  const statCards = [
    { title: "Total Quotes", value: stats.quotes > 4 ? "5+" : stats.quotes.toString(), icon: <MessageSquare size={24} color="#2D9CDB" />, trend: "Active" },
    { title: "Active Users", value: stats.users.toString(), icon: <Users size={24} color="#10b981" />, trend: "Active" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {statCards.map((stat, idx) => (
          <Card key={idx} className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748b", fontWeight: 500 }}>{stat.title}</span>
              <div style={{ padding: "0.5rem", background: "rgba(0,0,0,0.04)", borderRadius: "8px" }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-poppins)" }}>{stat.value}</span>
              <span style={{ color: "#10b981", fontWeight: 500, fontSize: "0.9rem" }}>
                {stat.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        <Card className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>Recent Quote Requests</h3>
          {loading ? (
            <p>Loading requests...</p>
          ) : recentQuotes.length === 0 ? (
            <p style={{ color: "#64748b" }}>No quote requests found.</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 500 }}>{row.firstName} {row.lastName}</td>
                      <td>{row.serviceRequested.join(", ")}</td>
                      <td>{row.createdAt ? new Date((row.createdAt as any).seconds * 1000).toLocaleDateString() : "Just now"}</td>
                      <td>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "999px", 
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          background: row.status === "Pending" ? "rgba(230, 166, 35, 0.1)" : row.status === "Completed" ? "rgba(16, 185, 129, 0.1)" : "rgba(45, 156, 219, 0.1)",
                          color: row.status === "Pending" ? "#E6A623" : row.status === "Completed" ? "#10b981" : "#2D9CDB"
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        

      </div>
    </div>
  );
}
