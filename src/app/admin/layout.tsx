"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, Settings, LogOut, Users, Briefcase, Receipt } from "lucide-react";
import styles from "./AdminLayout.module.css";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/quotes", label: "Quote Requests", icon: <MessageSquare size={20} /> },
    { href: "/admin/services", label: "Services", icon: <Briefcase size={20} /> },

    { href: "/admin/invoice-generator", label: "Invoice Generator", icon: <Receipt size={20} /> },

    { href: "/admin/users", label: "Users & Roles", icon: <Users size={20} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Admin Panel...</div>;
  }

  if (!user) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a192f" }}>
        <div style={{ background: "#f8fafc", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-poppins)", color: "black", marginBottom: "0.5rem" }}>Admin Login</h1>
            <p style={{ color: "#94a3b8" }}>Capital Print & Sign</p>
          </div>
          
          <form onSubmit={handleLogin} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.75rem", borderRadius: "8px", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}
            
            <div>
              <label style={{ display: "block", color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Email</label>
              <input type="email" required autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "0.75rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", color: "black" }} />
            </div>
            
            <div>
              <label style={{ display: "block", color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Password</label>
              <input type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "0.75rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", color: "black" }} />
            </div>
            
            <button type="submit" style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.layout} admin-theme`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <LayoutDashboard size={24} />
          <span>Admin Panel</span>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className={`${styles.navLink} ${styles.logout}`} style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left", marginTop: "auto" }}>
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {links.find(l => l.href === pathname)?.label || "Dashboard Overview"}
          </h1>
          <div className={styles.user}>
            <span>Welcome, {user.email?.split('@')[0]}</span>
            <div className={styles.avatar}>{user.email?.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
