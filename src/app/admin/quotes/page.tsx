"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import type { QuoteDocument } from "@/lib/schema";
import { Search, Eye, Trash2, FileText } from "lucide-react";
import { db } from "@/lib/firebase";
import QuoteBuilder, { LineItem } from "./QuoteBuilder";

export interface QuoteData {
  quoteDate: string;
  quoteNumber: string;
  clientName: string;
  contactName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyABN: string;
  accountName: string;
  bsb: string;
  accountNumber: string;
  paymentTerms: string;
  items: LineItem[];
  subtotal: number;
  taxAmount: number;
  totalDue: number;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteDocument | null>(null);
  const [selectedQuoteToBuild, setSelectedQuoteToBuild] = useState<QuoteDocument | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const q = query(collections.quotes, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQuotes(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: QuoteDocument["status"]) => {
    if (!id) return;
    try {
      const quoteRef = doc(db, "quotes", id);
      await updateDoc(quoteRef, { status, updatedAt: new Date() });
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!id || !confirm("Are you sure you want to delete this quote request?")) return;
    try {
      await deleteDoc(doc(db, "quotes", id));
      setQuotes(prev => prev.filter(q => q.id !== id));
      setSelectedQuote(null);
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  const filteredQuotes = quotes.filter(q =>
    `${q.firstName} ${q.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button 
            onClick={() => setSelectedQuoteToBuild({ 
              id: "new", 
              firstName: "", 
              lastName: "", 
              email: "", 
              phone: "", 
              serviceRequested: [], 
              description: "", 
              status: "Pending",
              createdAt: new Date(),
              updatedAt: new Date()
            })}
            style={{ background: "#10b981", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 500 }}
          >
            <FileText size={18} /> Create New Quote
          </button>
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", width: "200px" }}
            />
          </div>
        </div>
      </div>

      <Card className="glass-card" style={{ padding: "1.5rem" }}>
        {loading ? (
          <p>Loading requests...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Services</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 500 }}>
                      {q.firstName} {q.lastName}
                      {q.companyName && <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{q.companyName}</div>}
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>
                      {q.email}<br />{q.phone}
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>{q.serviceRequested.join(", ")}</td>
                    <td style={{ fontSize: "0.9rem", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={q.description}>
                      {q.description || "N/A"}
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>
                      {q.createdAt ? new Date((q.createdAt as any).seconds * 1000).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }) : ""}
                    </td>
                    <td>
                      <select
                        value={q.status}
                        onChange={(e) => updateStatus(q.id!, e.target.value as any)}
                        style={{
                          background: "#f1f5f9",
                          color: q.status === "Pending" ? "#E6A623" : q.status === "Completed" ? "#10b981" : "#2D9CDB",
                          border: "1px solid #e2e8f0",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          outline: "none",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button onClick={() => setSelectedQuoteToBuild(q)} style={{ background: "transparent", border: "none", color: "#10b981", cursor: "pointer", marginRight: "1rem" }} title="Create Quote PDF">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => setSelectedQuote(q)} style={{ background: "transparent", border: "none", color: "#2D9CDB", cursor: "pointer", marginRight: "1rem" }} title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => deleteQuote(q.id!)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredQuotes.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No quotes found.</p>
            )}
          </div>
        )}
      </Card>

      {/* Modal for Details */}
      {selectedQuote && (
        <div className="admin-modal-overlay" onClick={() => setSelectedQuote(null)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSelectedQuote(null)}>&times;</button>
            <h2 style={{ fontFamily: "var(--font-poppins)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>Quote Details</h2>

            <div style={{ display: "grid", gap: "1rem", color: "#1e293b" }}>
              <div><strong>Client:</strong> {selectedQuote.firstName} {selectedQuote.lastName}</div>
              <div><strong>Company:</strong> {selectedQuote.companyName || "N/A"}</div>
              <div><strong>Email:</strong> <a href={`mailto:${selectedQuote.email}`} style={{ color: "#2D9CDB" }}>{selectedQuote.email}</a></div>
              <div><strong>Phone:</strong> <a href={`tel:${selectedQuote.phone}`} style={{ color: "#2D9CDB" }}>{selectedQuote.phone}</a></div>
              <div><strong>Services Requested:</strong> {selectedQuote.serviceRequested.join(", ")}</div>
              <div><strong>Status:</strong> {selectedQuote.status}</div>
              <div>
                <strong>Description:</strong>
                <p style={{ background: "#f1f5f9", padding: "1rem", borderRadius: "8px", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                  {selectedQuote.description}
                </p>
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedQuote(null)} style={{ padding: "0.6rem 1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", color: "white", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedQuoteToBuild && (
        <QuoteBuilder 
          quoteReq={selectedQuoteToBuild} 
          onClose={() => {
            setSelectedQuoteToBuild(null);
            fetchQuotes();
          }} 
        />
      )}
    </div>
  );
}
