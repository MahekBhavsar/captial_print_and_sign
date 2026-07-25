"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoteSchema, type QuoteDocument } from "@/lib/schema";
import { collections, db } from "@/lib/firebase";
import { addDoc, doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, CheckCircle2, ChevronRight, ChevronLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";
import { useEffect } from "react";
import type { SettingsDocument } from "@/lib/schema";

const servicesList = [
  "Flyers & Brochures", "Shopfront Signs", "Business Cards",
  "Posters", "Stickers & Labels", "Graphic Design"
];

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [settings, setSettings] = useState<SettingsDocument | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SettingsDocument);
      }
    });
    return () => unsub();
  }, []);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      serviceRequested: [],
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["firstName", "lastName", "email", "phone"];
    if (step === 2) fieldsToValidate = ["serviceRequested", "description"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      data.createdAt = new Date();
      data.updatedAt = new Date();
      await addDoc(collections.quotes, data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting quote", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroContent}
        >
          <span className={styles.badge}>Get in Touch</span>
          <h1>Let's Create Something Extraordinary</h1>
          <p>Ready to make your business impossible to ignore? Request a free quote today and our expert team will get back to you within 24 hours.</p>
        </motion.div>
      </section>

      {/* Main Content Overlapping Hero */}
      <div className={styles.container}>
        {/* Left Info Section */}
        <section className={styles.infoSection}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.contactDetails}
          >
            <div className={styles.contactCard}>
              <div className={styles.iconWrapper}><MapPin size={22} /></div>
              <div className={styles.detailText}>
                <h3>Our Office</h3>
                <p>{settings?.address || "21 Huddart Court, Mitchell ACT 2911"}</p>
                <p>Servicing Canberra &amp; Surrounding Regions</p>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.iconWrapper}><Phone size={22} /></div>
              <div className={styles.detailText}>
                <h3>Call Us</h3>
                <p><a href={`tel:${settings?.phone?.replace(/\s/g, '') || "0481369018"}`}>{settings?.phone || "0481 369 018"}</a></p>
                <p>Mon – Fri, 8am – 5pm AEST</p>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.iconWrapper}><Mail size={22} /></div>
              <div className={styles.detailText}>
                <h3>Email Us</h3>
                <p><a href={`mailto:${settings?.email || "sales@capitalprintandsign.com.au"}`}>{settings?.email || "sales@capitalprintandsign.com.au"}</a></p>
                <p>We reply within 24 hours</p>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.iconWrapper}><Globe size={22} /></div>
              <div className={styles.detailText}>
                <h3>Website</h3>
                <p><a href="https://www.capitalprintandsign.com.au" target="_blank" rel="noopener noreferrer">www.capitalprintandsign.com.au</a></p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right Form Section */}
        <section className={styles.formSection}>
          {isSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.successMessage}>
              <div className={styles.successIcon}><CheckCircle2 size={40} /></div>
              <h2>Request Submitted!</h2>
              <p style={{ color: "#64748b", marginTop: "1rem" }}>Thank you for reaching out. Our team will review your requirements and get back to you with a custom quote shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Progress Wizard */}
              <div className={styles.progressWrapper}>
                <div className={styles.progress}>
                  {[1, 2].map((num) => (
                    <div key={num} className={`${styles.step} ${step === num ? styles.active : ""} ${step > num ? styles.completed : ""}`}>
                      {step > num ? <CheckCircle2 size={16} /> : num}
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContent}>
                    <h2 className={styles.stepTitle}>Your Details</h2>
                    <div className={styles.nameGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>First Name *</label>
                        <input className={styles.input} {...register("firstName")} placeholder="John" />
                        {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Last Name *</label>
                        <input className={styles.input} {...register("lastName")} placeholder="Doe" />
                        {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email Address *</label>
                      <input type="email" className={styles.input} {...register("email")} placeholder="john@company.com" />
                      {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Phone Number *</label>
                      <input type="tel" className={styles.input} {...register("phone")} placeholder="0400 000 000" />
                      {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Company Name (Optional)</label>
                      <input className={styles.input} {...register("companyName")} placeholder="Acme Corp" />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.stepContent}>
                    <h2 className={styles.stepTitle}>Project Requirements</h2>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Services Required *</label>
                      <div className={styles.checkboxGrid}>
                        {servicesList.map((service) => (
                          <label key={service} className={styles.checkboxLabel}>
                            <input type="checkbox" value={service} {...register("serviceRequested")} />
                            {service}
                          </label>
                        ))}
                      </div>
                      {errors.serviceRequested && <span className={styles.error}>{errors.serviceRequested.message}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Project Description (Optional)</label>
                      <textarea className={`${styles.input} ${styles.textarea}`} {...register("description")} placeholder="Tell us about your project, dimensions, materials preferred, etc..." />
                      {errors.description && <span className={styles.error}>{errors.description.message as string}</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.buttonRow}>
                {step > 1 ? (
                  <Button type="button" variant="secondary" onClick={prevStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ChevronLeft size={16} /> Back
                  </Button>
                ) : <div></div>}

                {step === 1 ? (
                  <Button type="button" variant="primary" onClick={nextStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Next <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Request Quote"}
                  </Button>
                )}
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
