"use client";

import { useState } from "react";
import styles from "./InvoiceGenerator.module.css";
import { Eye, Plus, Trash2, Save, Download } from "lucide-react";
import InvoicePreview from "./InvoicePreview";

export type LineItem = {
  id: string;
  description: string;
  unitCost: number;
  quantity: number;
};

export interface InvoiceData {
  invoiceDate: string;
  invoiceNumber: string;
  clientName: string;
  contactName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
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

export default function InvoiceGenerator() {
  // Invoice Details
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Bill To Details
  const [clientName, setClientName] = useState("");
  const [contactName, setContactName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [phone, setPhone] = useState("");

  // Line Items
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", unitCost: 0, quantity: 1 }
  ]);

  // Company Details (Pre-filled)
  const [companyName, setCompanyName] = useState("Capital Print and Sign");
  const [companyAddress, setCompanyAddress] = useState("21 Huddart Court, Mitchell ACT 2911");
  const [companyPhone, setCompanyPhone] = useState("0481 369 018");
  const [companyEmail, setCompanyEmail] = useState("Sales@capitalprintandsign.com.au");
  const [companyWebsite, setCompanyWebsite] = useState("www.capitalprintandsign.com.au");
  const [companyABN, setCompanyABN] = useState("30 699 226 849");

  // Payment Details (Pre-filled)
  const [accountName, setAccountName] = useState("Eternal Pty Ltd");
  const [bsb, setBsb] = useState("062 915");
  const [accountNumber, setAccountNumber] = useState("10508894");
  const [paymentTerms, setPaymentTerms] = useState("Payment is due within 7 days from the invoice date.\n\nThank you for your business!\nWe appreciate your support.");

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

  const invoiceData: InvoiceData = {
    invoiceDate, invoiceNumber,
    clientName, contactName, addressLine1, addressLine2, phone,
    companyName, companyAddress, companyPhone, companyEmail, companyWebsite, companyABN,
    accountName, bsb, accountNumber, paymentTerms,
    items, subtotal, taxAmount, totalDue
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invoice Generator</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => setShowPreview(true)}>
            <Eye size={18} /> Preview
          </button>
          <button className={styles.btnSecondary}>
            <Save size={18} /> Save Draft
          </button>
          <button className={styles.btnPrimary} onClick={() => setShowPreview(true)}>
            <Download size={18} /> Generate PDF
          </button>
        </div>
      </div>

      <div className={styles.formGrid}>
        {/* Invoice Details */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Invoice Details</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Invoice Date</label>
              <input 
                type="date" 
                className={styles.input} 
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Invoice Number</label>
              <input 
                type="text" 
                className={styles.input} 
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. 339"
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Bill To</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Company Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Company"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Contact Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Person Name"
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
              placeholder="Street Address"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Address Line 2</label>
            <input 
              type="text" 
              className={styles.input} 
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="City, State, Postcode"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input 
              type="text" 
              className={styles.input} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Company Settings (Sender) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sender Details (Your Info)</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Company Name</label>
              <input type="text" className={styles.input} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>ABN</label>
              <input type="text" className={styles.input} value={companyABN} onChange={(e) => setCompanyABN(e.target.value)} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Address</label>
            <input type="text" className={styles.input} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Phone</label>
              <input type="text" className={styles.input} value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="text" className={styles.input} value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment Details (Bank Transfer)</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Account Name</label>
              <input type="text" className={styles.input} value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>BSB</label>
              <input type="text" className={styles.input} value={bsb} onChange={(e) => setBsb(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Account Number</label>
              <input type="text" className={styles.input} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Payment Terms & Notes</label>
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
        <h2 className={styles.sectionTitle}>Line Items</h2>
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
            <span>Total Due</span>
            <span className={styles.summaryValue}>{formatCurrency(totalDue)}</span>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <InvoicePreview 
          data={invoiceData} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}
