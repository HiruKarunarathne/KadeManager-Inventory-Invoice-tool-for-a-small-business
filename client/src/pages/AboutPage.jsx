// ═══════════════════════════════════════════════════════
//  ABOUT & PROBLEM FRAMING PAGE  —  Member 1
// ═══════════════════════════════════════════════════════
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.tag}>
          <span className={styles.kadeEmoji}>🏪</span>
          <span>Perera Stores • Case Study & Problem Framing</span>
        </div>
        <h1 className={styles.heroTitle}>
          Transforming the Traditional Sri Lankan Kade
        </h1>
        <p className={styles.heroSubtitle}>
          How moving from a worn-out paper notebook (<strong>"Potha"</strong>) to{' '}
          <strong>Kade Manager</strong> saved Kamal Perera’s neighborhood shop from daily stockouts,
          calculation disputes, and lost revenue.
        </p>

        <div className={styles.heroActions}>
          <Link to="/" className={styles.heroPrimaryBtn}>
            ← Back to Dashboard
          </Link>
          <Link to="/invoices/new" className={styles.heroSecondaryBtn}>
            Try POS Billing Demo →
          </Link>
        </div>
      </section>

      {/* ── The Story of Perera Stores ─────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.storyCard}>
          <div className={styles.storyHeader}>
            <span className={styles.storyIcon}>🏮</span>
            <div>
              <h2 className={styles.sectionTitle}>The Story of Perera Stores</h2>
              <p className={styles.storySub}>A community cornerstone for over 22 years</p>
            </div>
          </div>
          <div className={styles.storyBody}>
            <p>
              Located on a busy junction in Sri Lanka, <strong>Perera Stores</strong> is the
              heartbeat of its neighborhood. Managed by <strong>Kamal Perera (Owner)</strong> alongside
              his trusted shop assistant <strong>Nimali Silva (Staff)</strong>, the kade supplies
              hundreds of households daily with kitchen essentials: Anchor milk powder, Samba rice,
              Mlesna tea, dhal, and cold Elephant House soft drinks.
            </p>
            <p>
              For over two decades, the entire operation — stock records, supplier deliveries, customer
              invoices, and credit purchases — was tracked across five dog-eared paper notebooks.
            </p>
          </div>
        </div>
      </section>

      {/* ── The "Paper Notebook" Problem ──────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            📉 The "Potha" (Paper Ledger) Crisis
          </h2>
          <span className={styles.crisisBadge}>Core Bottlenecks</span>
        </div>

        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.cardTop}>
              <span className={styles.probIcon}>💥</span>
              <span className={styles.probLabel}>Frequent Stockouts</span>
            </div>
            <h3>Sudden "Aiyyo, Badu Iwarai!" Moments</h3>
            <p>
              Without automated stock decrement, Kamal only noticed he had run out of Samba rice or
              Anchor milk when a customer stood disappointed at the counter. Lost inventory meant lost
              sales and frustrated neighbors.
            </p>
          </div>

          <div className={styles.problemCard}>
            <div className={styles.cardTop}>
              <span className={styles.probIcon}>☕</span>
              <span className={styles.probLabel}>Illegible & Damaged Ledgers</span>
            </div>
            <h3>Spills, Torn Pages & Scribbles</h3>
            <p>
              Rainwater leaks, tea spills, and hasty handwriting created constant disputes over whether
              a customer paid LKR 1,800 or LKR 1,200. Calculating daily totals required hours of manual
              arithmetic after closing the shutters at 9:30 PM.
            </p>
          </div>

          <div className={styles.problemCard}>
            <div className={styles.cardTop}>
              <span className={styles.probIcon}>🔒</span>
              <span className={styles.probLabel}>Zero Privacy / Role Separation</span>
            </div>
            <h3>Sensitive Business Figures Exposed</h3>
            <p>
              A shared paper book exposed total daily takings and supplier wholesale margins to anyone
              standing behind the counter. Kamal needed staff to bill freely without exposing confidential
              profit margins and bank deposit numbers.
            </p>
          </div>

          <div className={styles.problemCard}>
            <div className={styles.cardTop}>
              <span className={styles.probIcon}>⏳</span>
              <span className={styles.probLabel}>Rush-Hour Delays</span>
            </div>
            <h3>Long Counter Queues in the Evening</h3>
            <p>
              Manually writing out paper chits during the 6:00 PM rush created long lines. Customers
              often walked away to rival supermarkets because writing receipts took too long.
            </p>
          </div>
        </div>
      </section>

      {/* ── How Kade Manager Solves It ────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            ✨ How Kade Manager Solves It
          </h2>
          <span className={styles.solutionBadge}>Tailored Solution</span>
        </div>

        <div className={styles.solutionGrid}>
          <div className={styles.solutionCard}>
            <span className={styles.solNumber}>01</span>
            <h3>Real-Time Automated Stock Deduction</h3>
            <p>
              Every time an invoice is issued, the inventory quantity decrements atomically. When stock
              hits the safety limit (e.g., 10 packs of milk powder), warning badges appear instantly on
              the dashboard.
            </p>
          </div>

          <div className={styles.solutionCard}>
            <span className={styles.solNumber}>02</span>
            <h3>Strict Role-Based Confidentiality</h3>
            <p>
              <strong>Owner (Kamal)</strong> gets complete business analytics: daily revenue, monthly
              turnover, profit tracking, and product management.
              <br />
              <strong>Staff (Nimali)</strong> enjoys a lightning-fast billing POS and stock check
              without seeing confidential revenue figures.
            </p>
          </div>

          <div className={styles.solutionCard}>
            <span className={styles.solNumber}>03</span>
            <h3>Lightning-Fast Digital Invoicing</h3>
            <p>
              Search items in milliseconds, auto-calculate subtotals in LKR, and record walk-in or named
              customer bills in under 15 seconds. No mental math, no calculation errors.
            </p>
          </div>

          <div className={styles.solutionCard}>
            <span className={styles.solNumber}>04</span>
            <h3>Single-Tenant Simplicity</h3>
            <p>
              No complicated multi-store SaaS onboarding, no monthly SaaS tiers. Crafted specifically for
              Perera Stores to be clean, reliable, and usable on any shop tablet, laptop, or phone.
            </p>
          </div>
        </div>
      </section>

      {/* ── Interactive Role Matrix ───────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.matrixCard}>
          <h2 className={styles.sectionTitle}>👥 Role Matrix: Kamal vs. Nimali</h2>
          <p className={styles.matrixSub}>
            Currently logged in as: <strong>{user?.name} ({user?.role?.toUpperCase()})</strong>
          </p>

          <div className={styles.matrixTableWrapper}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th>Capability / View</th>
                  <th>
                    👨‍💼 Kamal Perera <br />
                    <span className={styles.colRole}>Owner</span>
                  </th>
                  <th>
                    👩‍💼 Nimali Silva <br />
                    <span className={styles.colRole}>Staff</span>
                  </th>
                  <th>Why This Matters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Today's Total Sales & Revenue</td>
                  <td className={styles.allowed}>✅ Full Visibility</td>
                  <td className={styles.denied}>❌ Gated (Hidden)</td>
                  <td>Keeps financial margins and daily banking confidential</td>
                </tr>
                <tr>
                  <td>Issue Invoices & Billing (POS)</td>
                  <td className={styles.allowed}>✅ Full Access</td>
                  <td className={styles.allowed}>✅ Full Access</td>
                  <td>Enables both counter attendants to serve customers instantly</td>
                </tr>
                <tr>
                  <td>Low-Stock Warning Alerts</td>
                  <td className={styles.allowed}>✅ Full Visibility</td>
                  <td className={styles.allowed}>✅ Full Visibility</td>
                  <td>Ensures Nimali and Kamal both know which items need shelf restocking</td>
                </tr>
                <tr>
                  <td>Add / Edit / Delete Products</td>
                  <td className={styles.allowed}>✅ Full Access</td>
                  <td className={styles.denied}>❌ Gated (Owner Only)</td>
                  <td>Prevents accidental price tampering or catalog modifications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInfo}>
          <strong>Ready to inspect the live system?</strong>
          <span>Explore the dashboard metrics or generate a test invoice now.</span>
        </div>
        <div className={styles.bottomButtons}>
          <Link to="/" className={styles.bottomPrimaryBtn}>
            View Live Dashboard
          </Link>
          <Link to="/inventory" className={styles.bottomSecondaryBtn}>
            Check Stock Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
