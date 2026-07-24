"use client";

import { useState } from "react";
import styles from "../invoice-generator/InvoiceGenerator.module.css";
import { Eye, Plus, Trash2, X, Save } from "lucide-react";
import QuotePreview from "@/app/admin/quotes/QuotePreview";
import type { QuoteDocument } from "@/lib/schema";
import { QuoteData } from "./page";

export type LineItem = {
  id: string;
  description: string;
  unitCost: number;
  quantity: number;
};

interface QuoteBuilderProps {
  quoteReq: QuoteDocument;
  onClose: () => void;
}

export default function QuoteBuilder({ quoteReq, onClose }: QuoteBuilderProps) {
  const existingQuoteData = quoteReq.quoteData as QuoteData | undefined;

  // Quote Details
  const [quoteDate, setQuoteDate] = useState(existingQuoteData?.quoteDate || new Date().toISOString().split('T')[0]);
  const [quoteNumber, setQuoteNumber] = useState(existingQuoteData?.quoteNumber || "");

  // Bill To Details
  const [clientName, setClientName] = useState(existingQuoteData?.clientName || quoteReq.companyName || `${quoteReq.firstName} ${quoteReq.lastName}`.trim());
  const [contactName, setContactName] = useState(existingQuoteData?.contactName || `${quoteReq.firstName} ${quoteReq.lastName}`.trim());
  const [addressLine1, setAddressLine1] = useState(existingQuoteData?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(existingQuoteData?.addressLine2 || "");
  const [phone, setPhone] = useState(existingQuoteData?.phone || quoteReq.phone || "");

  // Line Items (prefill from services)
  const [items, setItems] = useState<LineItem[]>(
    existingQuoteData?.items || 
    (quoteReq.serviceRequested && quoteReq.serviceRequested.length > 0 
      ? quoteReq.serviceRequested.map((service, index) => ({
          id: index.toString(),
          description: service,
          unitCost: 0,
          quantity: 1
        }))
      : [{ id: "1", description: "", unitCost: 0, quantity: 1 }])
  );

  // Company Details (Pre-filled)
  const [companyName, setCompanyName] = useState("Capital Print and Sign");
  const [companyAddress, setCompanyAddress] = useState("21 Huddart Court, Mitchell ACT 2911");
  const [companyPhone, setCompanyPhone] = useState("0481 369 018");
  const [companyEmail, setCompanyEmail] = useState("Sales@capitalprintandsign.com.au");
  const [companyWebsite, setCompanyWebsite] = useState("www.capitalprintandsign.com.au");
  const [companyABN, setCompanyABN] = useState("30 699 226 849");

  // Payment Details (Pre-filled)
  const [accountName, setAccountName] = useState("Capital Print and Sign");
  const [bsb, setBsb] = useState("062 915");
  const [accountNumber, setAccountNumber] = useState("10508894");
  const [paymentTerms, setPaymentTerms] = useState("This quote is valid for 30 days.\n\nThank you for considering us!\nWe look forward to working with you.");

  // Modal State
  const [showPreview, setShowPreview] = useState(false);

  // Calculations
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const taxRate = 0.10; // 10% GST
  const taxAmount = subtotal * taxRate;
  const totalDue = subtotal + taxAmount;

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", unitCost: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

  const quoteData: QuoteData = {
    quoteDate, quoteNumber,
    clientName, contactName, addressLine1, addressLine2, phone, email: quoteReq.email,
    companyName, companyAddress, companyPhone, companyEmail, companyWebsite, companyABN,
    accountName, bsb, accountNumber, paymentTerms,
    items, subtotal, taxAmount, totalDue
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveQuote = async () => {
    setIsSaving(true);
    try {
      if (quoteReq.id === "new") {
        const { collection, addDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await addDoc(collection(db, "quotes"), {
          firstName: contactName.split(' ')[0] || clientName || "Unknown",
          lastName: contactName.split(' ').slice(1).join(' ') || "",
          email: quoteReq.email || "",
          phone: phone || "",
          companyName: clientName,
          serviceRequested: items.map(i => i.description).filter(Boolean),
          status: "Reviewed",
          createdAt: new Date(),
          updatedAt: new Date(),
          quoteData
        });
      } else {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const quoteRef = doc(db, "quotes", quoteReq.id!);
        await updateDoc(quoteRef, { quoteData, updatedAt: new Date() });
      }
      alert("Quote saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving quote:", error);
      alert("Failed to save quote.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <div style={{ background: "white", borderRadius: "12px", width: "100%", maxWidth: "1200px", height: "90vh", overflowY: "auto", position: "relative" }}>
        
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", cursor: "pointer", zIndex: 10 }} title="Close Quote Builder">
          <X size={24} color="#64748b" />
        </button>

        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Quote Builder</h1>
            <div className={styles.actions}>
              <button 
                className={styles.btnSecondary} 
                onClick={handleSaveQuote}
                disabled={isSaving}
              >
                <Save size={18} /> {isSaving ? "Saving..." : "Save Quote"}
              </button>
              <button className={styles.btnSecondary} onClick={() => setShowPreview(true)}>
                <Eye size={18} /> Preview Quote
              </button>
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Quote Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Quote Details</h2>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Quote Date</label>
                  <input 
                    type="date" 
                    className={styles.input} 
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Sr NO.</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={quoteNumber}
                    onChange={(e) => setQuoteNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Client Details</h2>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Contact Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Address Line 1</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Address Line 2</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Quote Terms</h2>
              <div className={styles.inputGroup}>
                <label>Terms & Notes</label>
                <textarea 
                  className={styles.textarea} 
                  value={paymentTerms} 
                  onChange={(e) => setPaymentTerms(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className={styles.itemsSection}>
            <h2 className={styles.sectionTitle}>Services Requested</h2>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th className={styles.itemDesc}>Item Description</th>
                  <th className={styles.itemNumber}>Unit Cost ($)</th>
                  <th className={styles.itemNumber}>Quantity</th>
                  <th className={styles.itemTotal}>Line Total</th>
                  <th className={styles.itemActions}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input 
                        type="text" 
                        className={styles.input} 
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Item description..."
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className={styles.input} 
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className={styles.input} 
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </td>
                    <td className={styles.itemTotal}>
                      {formatCurrency(item.unitCost * item.quantity)}
                    </td>
                    <td>
                      <button 
                        className={styles.btnRemove} 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button className={styles.btnAddItem} onClick={handleAddItem}>
              <Plus size={18} /> Add New Item
            </button>
          </div>

          {/* Totals Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Subtotal (excl. GST)</span>
                <span className={styles.summaryValue}>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (10%)</span>
                <span className={styles.summaryValue}>{formatCurrency(taxAmount)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Quote Total</span>
                <span className={styles.summaryValue}>{formatCurrency(totalDue)}</span>
              </div>
            </div>
          </div>

          {/* Preview Modal */}
          {showPreview && (
            <QuotePreview 
              data={quoteData} 
              onClose={() => setShowPreview(false)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
