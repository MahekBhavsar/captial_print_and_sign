import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './QuotePreview.module.css';
import { Mail, Phone, MapPin, Globe, User, Landmark, FileText, Star, Download, Printer } from 'lucide-react';
import { QuoteData } from './page';

interface QuotePreviewProps {
  data: QuoteData;
  onClose: () => void;
}

export default function QuotePreview({ data, onClose }: QuotePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const content = (
    <div className={`${styles.overlay} print-container`}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Quote Preview</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => window.print()} 
              style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              <Printer size={16} /> Save / Print PDF
            </button>
            <button className={styles.closeBtn} onClick={onClose}>Close</button>
          </div>
        </div>
        
        <div className={styles.previewContainer}>
          <div className={styles.invoicePaper} id="invoice-capture">
            {/* Top Section Layout (Logo + Bill To on left, Company Info on right) */}
            <div className={styles.topSectionWrapper}>
              
              {/* Left Column */}
              <div className={styles.leftColumn}>
                <div className={styles.logoSection}>
                   <img src="/CPS-SecondaryLogo.png" alt="Logo" className={styles.logo} />
                </div>
                
                {/* Bill To */}
                <div className={styles.billToSection}>
                   <div className={styles.billToHeader}>
                      <div className={styles.billToIconWrapper}><User size={20} /></div>
                      <h3>QUOTE TO:</h3>
                   </div>
                   <div className={styles.billToDetails}>
                      <strong>{data.clientName || 'Client Company Name'}</strong>
                      <div>{data.contactName || 'Contact Person Name'}</div>
                      <div>{data.addressLine1 || 'Client Address Line 1'}</div>
                      <div>{data.addressLine2 || 'City, State, Postcode'}</div>
                      <div className={styles.clientPhone}>
                        <Phone size={18} className={styles.icon} />
                        {data.phone || 'Client Phone Number'}
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: Company Info */}
              <div className={styles.companyInfoWrapper}>
                <div className={styles.companyInfo}>
                  <h1 className={styles.taxInvoiceTitle}>QUOTE INVOICE</h1>
                  <div className={styles.invoiceMeta}>
                     <div className={styles.metaRow}>
                       <span className={styles.metaLabel}>DATE:</span>
                       <span className={styles.metaValue}>{data.quoteDate || 'DD/MM/YYYY'}</span>
                     </div>
                     <div className={styles.metaRow}>
                       <span className={styles.metaLabel}>Sr NO.:</span>
                       <span className={styles.metaValue}>{data.quoteNumber || '000'}</span>
                     </div>
                  </div>
                  
                  <h2 className={styles.companyName}>{data.companyName}</h2>
                  <div className={styles.contactItem}>
                    <MapPin size={18} className={styles.icon} />
                    <span>{data.companyAddress}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Phone size={18} className={styles.icon} />
                    <span>{data.companyPhone}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Mail size={18} className={styles.icon} />
                    <span>{data.companyEmail}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <Globe size={18} className={styles.icon} />
                    <span>{data.companyWebsite}</span>
                  </div>
                  <div className={styles.abnItem}>
                    <span className={styles.abnLabel}>ABN:</span> {data.companyABN}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th className={styles.colItem}>ITEM</th>
                  <th className={styles.colDesc}>DESCRIPTION</th>
                  <th className={styles.colUnitCost}>UNIT COST</th>
                  <th className={styles.colQty}>QUANTITY</th>
                  <th className={styles.colTotal}>LINE TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{item.details}</td>
                    <td>{formatCurrency(Number(item.unitCost) || 0)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency((Number(item.unitCost) || 0) * (Number(item.quantity) || 0))}</td>
                  </tr>
                ))}
                {/* Fill empty rows to make it look like paper */}
                {Array.from({ length: Math.max(0, 5 - data.items.length) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className={styles.totalsSection}>
              <table className={styles.totalsTable}>
                 <tbody>
                    <tr>
                      <td className={styles.totalsLabel}>SUBTOTAL (EXCL. GST)</td>
                      <td className={styles.totalsValue}>{formatCurrency(data.subtotal)}</td>
                    </tr>
                    <tr>
                      <td className={styles.totalsLabel}>GST (10%)</td>
                      <td className={styles.totalsValue}>{formatCurrency(data.taxAmount)}</td>
                    </tr>
                    <tr className={styles.totalDueRow}>
                      <td className={styles.totalsLabel}>QUOTE TOTAL</td>
                      <td className={styles.totalsValue}>{formatCurrency(data.totalDue)}</td>
                    </tr>
                 </tbody>
              </table>
            </div>

            {/* Payment Details */}
            <div className={styles.bottomSection}>
               <div className={styles.bankDetails}>
                  <div className={styles.bankHeader}>
                     <div className={styles.bankIcon}><Landmark size={28} color="white" /></div>
                     <div>PAYING VIA <strong>BANK TRANSFER:</strong></div>
                  </div>
                  <table className={styles.bankTable}>
                     <tbody>
                        <tr>
                          <td>ACCOUNT NAME</td>
                          <td>: {data.accountName}</td>
                        </tr>
                        <tr>
                          <td>BSB</td>
                          <td>: {data.bsb}</td>
                        </tr>
                        <tr>
                          <td>ACCOUNT NUMBER</td>
                          <td>: {data.accountNumber}</td>
                        </tr>
                        <tr>
                          <td>PAYMENT REFERENCE</td>
                          <td>: QUO-{data.quoteNumber || '000'}</td>
                        </tr>
                     </tbody>
                  </table>
                  <div className={styles.bankFooter}>
                    (Please use quote number as reference)
                  </div>
               </div>
               
               <div className={styles.paymentTerms}>
                  <div className={styles.termsHeader}>
                     <FileText size={28} className={styles.termsIcon} />
                     <strong>PAYMENT TERMS</strong>
                  </div>
                  <div className={styles.termsContent}>
                     {data.paymentTerms.split('\n').map((line, i) => (
                       <p key={i}>{line}</p>
                     ))}
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
               <div className={styles.footerLeft}>
                  <div className={styles.starIcon}><Star size={20} color="white" /></div>
                  <div className={styles.footerThanks}>
                    <strong>THANK YOU FOR YOUR BUSINESS!</strong>
                    <div>We look forward to working with you again.</div>
                  </div>
               </div>
               <div className={styles.footerRight}>
                  <span>We print, You shine.</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
