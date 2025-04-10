import { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link"; // Import type for metadata
import { PlaidApi } from "../../utils/PlaidApi";
import { usePlaid } from "../context/PlaidContext"; // Optional: If you want to use PlaidContext for accessToken and linkToken
import { useTransactions } from "../context/TransactionsContext";
export default function PlaidLink() {
  // State to store tokens and loading status
  const {
    generateLinkToken,
    exchangePublicToken,
    linkToken,
    isLinkLoading,
    setIsLinkLoading,
    accessToken,
    setAccessToken,
    hasAccessToken,
  } = usePlaid(); // Optional: If you want to use PlaidApi directly for exchanging tokens

  const {
    transactions,
    fetchTransactions,
    setIsTransactionLoading,
    setTransaction,
  } = useTransactions(); // Get the function to set transactions from TransactionsContext

  useEffect(() => {
    const initializeTokens = async () => {
      const initializeLinkToken = async () => {
        await generateLinkToken(); // Generate the link token when the component mounts
      };

      const accessToken = await hasAccessToken();
      if (accessToken == null) {
        setIsTransactionLoading(false);
        setAccessToken(null); // from context
        setTransaction([]); // from context
        console.log("No access token found, generating link token...");
        await initializeLinkToken();
      } else {
        console.log("Access token found:", accessToken);
        // Optionally fetch transactions if access token already exists
        getTransactions(accessToken); // Fetch transactions if access token is available
      }
    };

    initializeTokens();
  }, []);

  const getTransactions = async (accessToken: string) => {
    if (!accessToken) {
      alert("Please connect a bank account first");
      return;
    } else {
      try {
        setIsTransactionLoading(true);
        // Make a request to your Django backend to fetch transactions
        console.log("Fetching transactions for access token:", accessToken);

        fetchTransactions(); // Clear previous transactions before fetching new ones (optional, depending on your use case)
        console.log("Transactions received:", transactions); // Log the transactions for debugging
        
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLinkLoading(false); // Reset loading state after the request completes
      }
    }
  };

  // Handle successful link
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    try {
      await exchangePublicToken(publicToken);

      console.log("Successfully linked account:", metadata);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    } finally {
      setIsLinkLoading(false);
    }
  };

  // Configure the Plaid Link
  const config = {
    token: linkToken,
    onSuccess,
  };

  // Get the open and ready functions from the Plaid Link hook
  const { open, ready } = usePlaidLink(config);

  // Function to simulate new transactions
  const simulateTransactions = async () => {
    if (!accessToken) {
      alert("Please connect a bank account first");
      return;
    }

    try {
      setIsLinkLoading(true);
      // Make a request to your Django backend
      console.log("Sending access token to backend:", accessToken);

      await PlaidApi.simulateTransactions(accessToken);
      console.log("Successfully simulated new transactions!");
      getTransactions(accessToken);
    } catch (error) {
      console.error("Error simulating transactions:", error);
      alert("Error simulating transactions");
    } finally {
      setIsLinkLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Plaid Integration</h2>

      {/* Button to open Plaid Link */}
      <button
        onClick={() => open()}
        disabled={!ready || !linkToken || isLinkLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLinkLoading ? "Loading..." : "Connect Bank Account"}
      </button>

      {/* Show this section only after connecting an account */}
      {accessToken && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Account Connected!</h3>
          <button
            onClick={simulateTransactions}
            disabled={isLinkLoading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {isLinkLoading ? "Loading..." : "Simulate New Transactions"}
          </button>
        </div>
      )}
    </div>
  );
}
