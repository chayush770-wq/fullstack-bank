import { useEffect, useRef, useState } from "react";

import { API_URL } from "../../services/api.config";

import axios from "axios";

import "./CustomerServiceModal.css";

/* ===== Initial Messages ===== */

const initialMessages = [
  {
    id: crypto.randomUUID(),

    sender: "bot",

    text: "Hello, welcome to Customer Service. How can I help you today?",

    actions: [],

    responseType: null,

    responseData: {},
  },
];

/* ===== Format Currency ===== */

function formatCurrency(amount, currency = "USD") {
  if (currency === "USD") {
    return `$${amount}`;
  }

  if (currency === "ILS") {
    return `₪${amount}`;
  }

  return `${amount} ${currency}`;
}

/* ===== Build Bot Text ===== */

function buildBotText(data) {
  const responseType = data.responseType;

  const responseData = data.responseData || {};

  const currency = responseData.currency || "USD";

  if (data.reply) {
    return data.reply;
  }

  /* ===== Balance ===== */

  if (responseType === "check_balance") {
    return `Your balance is ${formatCurrency(responseData.balance, currency)}.`;
  }

  /* ===== Transfer Confirmation ===== */

  if (responseType === "transfer_confirmation") {
    return `Confirm transfer of ${formatCurrency(
      responseData.amount,
      currency,
    )} to ${responseData.recipient}?`;
  }

  /* ===== Transfer Success ===== */

  if (responseType === "transfer_success") {
    return `Transfer completed. New balance: ${formatCurrency(
      responseData.newBalance,
      currency,
    )}.`;
  }

  /* ===== Transfer Failed ===== */

  if (responseType === "transfer_failed") {
    return `Transfer failed: ${responseData.error}`;
  }

  /* ===== Risk Blocked ===== */

  if (responseType === "risk_blocked") {
    return "This transfer cannot be completed.";
  }

  /* ===== No Pending Action ===== */

  if (responseType === "no_pending_action") {
    return "There is no pending action to confirm.";
  }

  /* ===== Expired ===== */

  if (responseType === "pending_action_expired") {
    return "This confirmation expired. Please start again.";
  }

  /* ===== Transactions ===== */

  if (responseType === "transactions_list") {
    return "Here are your recent transactions:";
  }

  /* ===== Default ===== */

  return "How can I help?";
}

/* ===== Customer Service Modal Component ===== */

function CustomerServiceModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState(initialMessages);

  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);

  /* ===== Auto Scroll ===== */

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  /* ===== Send Message To Backend ===== */

  async function sendMessageToBackend(messageText) {
    const response = await axios.post(
      `${API_URL}/api/chat`,

      {
        message: messageText,
      },

      {
        withCredentials: true,
      },
    );

    /* ===== Bot Message ===== */

    const botMessage = {
      id: crypto.randomUUID(),

      sender: "bot",

      text: buildBotText(response.data),

      actions: response.data.actions || [],

      responseType: response.data.responseType,

      responseData: response.data.responseData || {},
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  }

  /* ===== Handle Send Message ===== */

  async function handleSendMessage() {
    const trimmedMessage = inputValue.trim();

    if (!trimmedMessage) {
      return;
    }

    /* ===== User Message ===== */

    const userMessage = {
      id: crypto.randomUUID(),

      sender: "user",

      text: trimmedMessage,

      actions: [],
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInputValue("");

    try {
      await sendMessageToBackend(trimmedMessage);
    } catch (error) {
      console.error(error);

      /* ===== Error Message ===== */

      const errorMessage = {
        id: crypto.randomUUID(),

        sender: "bot",

        text: "Something went wrong",

        actions: [],
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  }

  /* ===== Handle Action Click ===== */

  async function handleActionClick(actionType) {
    const actionMessage = actionType === "confirm_transfer" ? "yes" : "cancel";

    /* ===== User Action Message ===== */

    const userMessage = {
      id: crypto.randomUUID(),

      sender: "user",

      text: actionMessage,

      actions: [],
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      await sendMessageToBackend(actionMessage);
    } catch (error) {
      console.error(error);
    }
  }

  /* ===== Send With Enter ===== */

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  /* ===== Do Not Render When Closed ===== */

  if (!isOpen) {
    return null;
  }

  return (
    <div className="customer-service-overlay">
      <div className="customer-service-modal">
        {/* ===== Header ===== */}

        <div className="customer-service-header">
          <div>
            <h2>Customer Service</h2>

            <p>Bank support chat</p>
          </div>

          <button className="customer-service-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* ===== Messages ===== */}

        <div className="customer-service-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`customer-service-message-row ${message.sender}`}
            >
              <div className={`customer-service-message ${message.sender}`}>
                {/* ===== Regular Text ===== */}

                <div>{message.text}</div>

                {/* ===== Transactions List ===== */}

                {message.responseType === "transactions_list" && (
                  <div className="customer-service-transactions-list">
                    {(message.responseData.transactions || [])
                      .slice(0, 3)
                      .map((transaction) => (
                        <div
                          className="customer-service-transaction-card"
                          key={transaction._id}
                        >
                          <strong>{transaction.counterpartyEmail}</strong>

                          <span>
                            {transaction.amount > 0 ? "+" : "-"}
                            {formatCurrency(
                              Math.abs(transaction.amount),
                              message.responseData.currency || "USD",
                            )}
                          </span>

                          <p>{transaction.reason || "Transfer"}</p>
                        </div>
                      ))}
                  </div>
                )}

                {/* ===== Actions ===== */}

                {message.actions?.length > 0 && (
                  <div className="customer-service-actions">
                    {message.actions.map((action) => (
                      <button
                        key={action.type}
                        onClick={() => handleActionClick(action.type)}
                      >
                        {action.type === "confirm_transfer"
                          ? "Confirm"
                          : "Cancel"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* ===== Input Area ===== */}

        <div className="customer-service-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default CustomerServiceModal;
