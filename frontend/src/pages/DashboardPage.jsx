/* ===== REACT ===== */

import { useCallback, useEffect, useState } from "react";

/* ===== ROUTER ===== */

import { useNavigate } from "react-router-dom";

/* ===== ICONS ===== */

import {
  FiCheck,
  FiDollarSign,
  FiGlobe,
} from "react-icons/fi";

/* ===== COMPONENTS ===== */

import CustomerServiceModal from "../components/customer-service/CustomerServiceModal";

/* ===== SERVICES ===== */

import { getMyAccount } from "../services/accounts.service";

import {
  getTransactions,
  createTransaction,
} from "../services/transactions.service";

import { logoutUser, updateUserPreferences } from "../services/auth.service";

import { socket } from "../services/socket.service";

/* ===== DASHBOARD PAGE ===== */

function DashboardPage() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [showTransfer, setShowTransfer] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const [transactionSearch, setTransactionSearch] = useState("");

  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [transferMessage, setTransferMessage] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const [error, setError] = useState("");

  const [preferredLanguage, setPreferredLanguage] = useState("he");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");

  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);

  const navigate = useNavigate();

  /* ===== LOAD DASHBOARD DATA ===== */

  const loadDashboardData = useCallback(async () => {
    try {
      const accountResponse = await getMyAccount();

      if (accountResponse.status === 401) {
        navigate("/");
        return;
      }

      if (!accountResponse.ok) {
        throw new Error("Failed to load account");
      }

      const accountData = await accountResponse.json();

      setPreferredLanguage(accountData.preferredLanguage || "he");
      setPreferredCurrency(accountData.preferredCurrency || "USD");

      const transactionsResponse = await getTransactions();

      if (!transactionsResponse.ok) {
        throw new Error("Failed to load transactions");
      }

      const transactionsData = await transactionsResponse.json();

      setAccount(accountData);
      setTransactions(transactionsData.transactions || []);
    } catch (error) {
      setError(error.message);
    }
  }, [navigate]);

  /* ===== PAGE LOAD ===== */

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /* ===== REALTIME SOCKET UPDATE ===== */

  useEffect(() => {
    socket.on("transactions-updated", async (data) => {
      console.log("transactions-updated received", data);
      await loadDashboardData();
    });

    return () => {
      socket.off("transactions-updated");
    };
  }, [loadDashboardData]);

  /* ===== TRANSFER ===== */

  async function handleTransfer(event) {
    event.preventDefault();

    setTransferMessage("");
    setIsTransferring(true);

    try {
      const response = await createTransaction({
        recipientEmail,
        amount,
        reason,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Transfer failed");
      }

      setRecipientEmail("");
      setAmount("");
      setReason("");
      setShowTransfer(false);

      await loadDashboardData();
    } catch (error) {
      setTransferMessage(error.message);
    } finally {
      setIsTransferring(false);
    }
  }

  /* ===== LOGOUT ===== */

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/");
    } catch {
      setError("Logout failed");
    }
  }

  /* ===== SAVE PREFERENCES ===== */

  async function handleSavePreferences(
    preferredLanguageValue,
    preferredCurrencyValue,
  ) {
    setPreferencesMessage("");
    setIsSavingPreferences(true);

    try {
      const response = await updateUserPreferences(
        preferredLanguageValue,
        preferredCurrencyValue,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save preferences");
      }

      setPreferredLanguage(preferredLanguageValue);
      setPreferredCurrency(preferredCurrencyValue);

      setPreferencesMessage(
        preferredLanguageValue === "he"
          ? "העדפות שמורות בהצלחה."
          : "Preferences saved successfully.",
      );

      await loadDashboardData();
    } catch (saveError) {
      setPreferencesMessage(saveError.message);
    } finally {
      setIsSavingPreferences(false);
      setShowLanguageMenu(false);
      setShowCurrencyMenu(false);
    }
  }

  /* ===== TRANSACTIONS MODAL ===== */

  async function handleOpenTransactions() {
    await loadDashboardData();
    setShowTransactions(true);
  }

  function handleCloseTransactions() {
    setTransactionSearch("");
    setShowTransactions(false);
  }

  /* ===== FILTER TRANSACTIONS ===== */

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.counterpartyEmail
      ?.toLowerCase()
      .includes(transactionSearch.toLowerCase()),
  );

  /* ===== CURRENCY ===== */

  const displayCurrency =
    account?.preferredCurrency || preferredCurrency || "USD";

  const currencySymbols = {
    USD: "$",
    ILS: "₪",
    EUR: "€",
  };

  const displayCurrencySymbol =
    currencySymbols[displayCurrency] || displayCurrency;

  const displayName = account
    ? account.fullName && !account.fullName.includes("@")
      ? account.fullName.split(" ")[0]
      : account.email.split("@")[0]
    : "";

  /* ===== LOADING / ERROR ===== */

  if (error) {
    return (
      <main className="bank-page">
        <h1>Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="bank-page">
        <h1>Loading dashboard...</h1>
      </main>
    );
  }

  return (
    <div className="bank-page">
      <header className="bank-topbar">
        <div>
          <h1 className="bank-logo">SmartBank</h1>
          <p className="bank-subtitle">Digital Banking Platform</p>
        </div>

        <div className="topbar-actions">
          <span>שלום, {displayName}</span>

          <div className="preference-icons">
            <div className="preference-dropdown">
              <button
                type="button"
                className={`icon-button ${showLanguageMenu ? "active" : ""}`}
                aria-expanded={showLanguageMenu}
                aria-label={
                  preferredLanguage === "he" ? "בחר שפה" : "Choose language"
                }
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu);
                  setShowCurrencyMenu(false);
                }}
              >
                <span className="button-icon">
                  <FiGlobe />
                </span>
              </button>

              {showLanguageMenu && (
                <div className="preference-menu">
                  <button
                    type="button"
                    className={preferredLanguage === "he" ? "selected" : ""}
                    onClick={() => handleSavePreferences("he", displayCurrency)}
                  >
                    <span>
                      עברית
                      <small>HE</small>
                    </span>
                    {preferredLanguage === "he" && <FiCheck />}
                  </button>

                  <button
                    type="button"
                    className={preferredLanguage === "en" ? "selected" : ""}
                    onClick={() => handleSavePreferences("en", displayCurrency)}
                  >
                    <span>
                      English
                      <small>EN</small>
                    </span>
                    {preferredLanguage === "en" && <FiCheck />}
                  </button>
                </div>
              )}
            </div>

            <div className="preference-dropdown">
              <button
                type="button"
                className={`icon-button ${showCurrencyMenu ? "active" : ""}`}
                aria-expanded={showCurrencyMenu}
                aria-label={
                  preferredLanguage === "he" ? "בחר מטבע" : "Choose currency"
                }
                onClick={() => {
                  setShowCurrencyMenu(!showCurrencyMenu);
                  setShowLanguageMenu(false);
                }}
              >
                <span className="button-icon">
                  <FiDollarSign />
                </span>
              </button>

              {showCurrencyMenu && (
                <div className="preference-menu">
                  <button
                    type="button"
                    className={preferredCurrency === "USD" ? "selected" : ""}
                    onClick={() =>
                      handleSavePreferences(preferredLanguage, "USD")
                    }
                  >
                    <span>
                      USD
                      <small>USD</small>
                    </span>
                    {preferredCurrency === "USD" && <FiCheck />}
                  </button>

                  <button
                    type="button"
                    className={preferredCurrency === "ILS" ? "selected" : ""}
                    onClick={() =>
                      handleSavePreferences(preferredLanguage, "ILS")
                    }
                  >
                    <span>
                      ILS
                      <small>ILS</small>
                    </span>
                    {preferredCurrency === "ILS" && <FiCheck />}
                  </button>

                  <button
                    type="button"
                    className={preferredCurrency === "EUR" ? "selected" : ""}
                    onClick={() =>
                      handleSavePreferences(preferredLanguage, "EUR")
                    }
                  >
                    <span>
                      EUR
                      <small>EUR</small>
                    </span>
                    {preferredCurrency === "EUR" && <FiCheck />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            {preferredLanguage === "he" ? "התנתק" : "Sign out"}
          </button>
        </div>

        {preferencesMessage && (
          <div className="preferences-notice">{preferencesMessage}</div>
        )}
      </header>

      <main className="bank-shell">
        <section className="bank-main">
          <section className="account-summary">
            <div>
              <p className="section-label">
                {preferredLanguage === "he" ? "החשבון שלי" : "My account"}
              </p>

              <h2>
                {preferredLanguage === "he"
                  ? "יתרה זמינה"
                  : "Available balance"}
              </h2>
            </div>

            <div className="balance-row">
              <strong>
                {displayCurrencySymbol}
                {account.balance}
              </strong>

              <button onClick={() => setShowTransfer(true)}>
                {preferredLanguage === "he" ? "העברת כסף" : "Transfer money"}
              </button>
            </div>
          </section>

          <section className="transactions-panel">
            <div className="panel-header">
              <h2>
                {preferredLanguage === "he"
                  ? "עסקאות אחרונות"
                  : "Recent transactions"}
              </h2>

              <button type="button" onClick={handleOpenTransactions}>
                {preferredLanguage === "he" ? "הצג הכל" : "View all"}
              </button>
            </div>

            <div className="transactions-table">
              {transactions.length === 0 ? (
                <p className="empty-text">
                  {preferredLanguage === "he"
                    ? "אין עסקאות עדיין"
                    : "No transactions yet"}
                </p>
              ) : (
                transactions.slice(0, 5).map((transaction) => (
                  <div
                    className="transaction-row"
                    key={transaction.id || transaction._id}
                  >
                    <div>
                      <strong>{transaction.counterpartyEmail}</strong>
                      <p>{transaction.reason || "Transfer"}</p>
                    </div>

                    <span
                      className={
                        transaction.amount > 0
                          ? "amount-positive"
                          : "amount-negative"
                      }
                    >
                      {transaction.amount > 0 ? "+" : "-"}
                      {displayCurrencySymbol}
                      {Math.abs(transaction.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>

        <aside className="quick-panel">
          <h2>
            {preferredLanguage === "he" ? "פעולות מהירות" : "Quick actions"}
          </h2>

          <button onClick={() => setShowTransfer(true)}>
            {preferredLanguage === "he" ? "העברת כסף" : "Transfer money"}
          </button>

          <button type="button" onClick={handleOpenTransactions}>
            {preferredLanguage === "he" ? "הצג עסקאות" : "View transactions"}
          </button>

          <button type="button" onClick={() => setIsCustomerServiceOpen(true)}>
            {preferredLanguage === "he" ? "שירות לקוח" : "Customer service"}
          </button>

          <button
            type="button"
            className="signout-action"
            onClick={handleLogout}
          >
            {preferredLanguage === "he" ? "התנתק" : "Sign out"}
          </button>

          <div className="profile-mini">
            <p className="section-label">
              {preferredLanguage === "he" ? "שלום שוב" : "Welcome back"}
            </p>

            <p>{account.fullName}</p>
            <small>{account.email}</small>
          </div>
        </aside>
      </main>

      {/* ===== TRANSACTIONS MODAL ===== */}

      {showTransactions && (
        <div className="modal-overlay">
          <section className="transactions-modal">
            <div className="modal-header">
              <div>
                <p className="section-label">
                  {preferredLanguage === "he"
                    ? "פעילות חשבון"
                    : "Account activity"}
                </p>

                <h2>
                  {preferredLanguage === "he"
                    ? "כל העסקאות"
                    : "All transactions"}
                </h2>

                <input
                  type="text"
                  placeholder={
                    preferredLanguage === "he"
                      ? "חפש לפי דואר אימייל..."
                      : "Search by email..."
                  }
                  value={transactionSearch}
                  onChange={(event) => setTransactionSearch(event.target.value)}
                />
              </div>

              <button className="modal-close" onClick={handleCloseTransactions}>
                ×
              </button>
            </div>

            <div className="transactions-modal-body">
              <div className="transactions-table">
                {transactions.length === 0 ? (
                  <p className="empty-text">
                    {preferredLanguage === "he"
                      ? "אין עסקאות עדיין"
                      : "No transactions yet"}
                  </p>
                ) : filteredTransactions.length === 0 ? (
                  <p className="empty-text">
                    {preferredLanguage === "he"
                      ? "אין עסקאות תואמות"
                      : "No matching transactions"}
                  </p>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      className="transaction-row"
                      key={transaction.id || transaction._id}
                    >
                      <div>
                        <strong>{transaction.counterpartyEmail}</strong>
                        <p>{transaction.reason || "Transfer"}</p>
                      </div>

                      <span
                        className={
                          transaction.amount > 0
                            ? "amount-positive"
                            : "amount-negative"
                        }
                      >
                        {transaction.amount > 0 ? "+" : "-"}
                        {displayCurrencySymbol}
                        {Math.abs(transaction.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===== TRANSFER MODAL ===== */}

      {showTransfer && (
        <div className="modal-overlay">
          <section className="transfer-modal">
            <div className="modal-header">
              <div>
                <p className="section-label">
                  {preferredLanguage === "he"
                    ? "העברה בטוחה"
                    : "Secure transfer"}
                </p>

                <h2>
                  {preferredLanguage === "he" ? "העברת כסף" : "Transfer money"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowTransfer(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleTransfer}>
              <label>
                {preferredLanguage === "he" ? "דואר המעביר" : "Recipient email"}
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
              />

              <label>{preferredLanguage === "he" ? "סכום" : "Amount"}</label>

              <input
                type="number"
                placeholder="100"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />

              <label>{preferredLanguage === "he" ? "סיבה" : "Reason"}</label>

              <input
                type="text"
                placeholder={
                  preferredLanguage === "he" ? "סיבה להעברה" : "Payment reason"
                }
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />

              {transferMessage && (
                <p className="transfer-message">{transferMessage}</p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowTransfer(false)}
                  disabled={isTransferring}
                >
                  {preferredLanguage === "he" ? "בטל" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isTransferring}
                >
                  {isTransferring
                    ? preferredLanguage === "he"
                      ? "שולח רשיות..."
                      : "Sending..."
                    : preferredLanguage === "he"
                      ? "שלח כסף"
                      : "Send money"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* ===== CUSTOMER SERVICE ===== */}

      <CustomerServiceModal
        isOpen={isCustomerServiceOpen}
        onClose={() => setIsCustomerServiceOpen(false)}
      />
    </div>
  );
}

/* ===== EXPORT ===== */

export default DashboardPage;
