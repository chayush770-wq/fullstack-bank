/* ===== IMPORTS ===== */

const { StateGraph, START, END } = require("@langchain/langgraph");

const { BankingState } = require("./banking.state");

const { findIntentNode } = require("./nodes/find-intent.node");

const { evaluateAccountNode } = require("./nodes/evaluate-account.node");

const { riskAssessmentNode } = require("./nodes/risk-assessment.node");

const {
  requestConfirmationNode,
} = require("./nodes/request-confirmation.node");

const {
  confirmPendingActionNode,
} = require("./nodes/confirm-pending-action.node");

const { runTransactionNode } = require("./nodes/run-transaction.node");

const { returnResponseNode } = require("./nodes/return-response.node");

const { getTransactionsNode } = require("./nodes/get-transactions.node");

const { routeByIntent } = require("./routes/route-by-intent");

/* ===== GRAPH ===== */

const graph = new StateGraph(BankingState);

/* ===== NODES ===== */

graph.addNode("find_intent", findIntentNode);

graph.addNode("evaluate_account", evaluateAccountNode);

graph.addNode("risk_assessment", riskAssessmentNode);

graph.addNode("request_confirmation", requestConfirmationNode);

graph.addNode("confirm_pending_action", confirmPendingActionNode);

graph.addNode("run_transaction", runTransactionNode);

graph.addNode("get_transactions", getTransactionsNode);

graph.addNode("return_response", returnResponseNode);

/* ===== START ===== */

graph.addEdge(START, "find_intent");

/* ===== CONDITIONAL ROUTING ===== */

graph.addConditionalEdges("find_intent", routeByIntent);

/* ===== AFTER ACCOUNT EVALUATION ===== */

graph.addConditionalEdges("evaluate_account", (state) => {
  if (state.intent === "transfer_money") {
    return "risk_assessment";
  }

  return "return_response";
});

/* ===== VIEW TRANSACTIONS ===== */

graph.addEdge("get_transactions", "return_response");

/* ===== TRANSFER MONEY ===== */

graph.addEdge("risk_assessment", "request_confirmation");

graph.addEdge("request_confirmation", "return_response");

/* ===== CONFIRM TRANSFER ===== */

graph.addEdge("confirm_pending_action", "run_transaction");

graph.addEdge("run_transaction", "return_response");

/* ===== END ===== */

graph.addEdge("return_response", END);

/* ===== COMPILE ===== */

const bankingGraph = graph.compile();

/* ===== EXPORTS ===== */

module.exports = {
  bankingGraph,
};