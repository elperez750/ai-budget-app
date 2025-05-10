import { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link"; // Import type for metadata
import { PlaidApi } from "../../../utils/PlaidApi";
import { usePlaid } from "../../context/PlaidContext"; // Optional: If you want to use PlaidContext for accessToken and linkToken
import { useTransactions } from "../../context/TransactionsContext";
import { useBankAccounts } from "../../context/BankAccountContext";
import { BankAccountsApi } from "../../../utils/BankAccountsApi";
export default function PlaidLink() {
  // State to store tokens and loading status
  const {
    generateLinkToken,
    exchangePublicToken,
    linkToken,
    isLinkLoading,
    setIsLinkLoading,
    setAccessToken,
    hasAccessToken,
    setIsSynced
  } = usePlaid(); // Optional: If you want to use PlaidApi directly for exchanging tokens

  const {
    transactions,
    fetchTransactions,
    setIsTransactionLoading,
    setTransaction,
  } = useTransactions(); // Get the function to set transactions from TransactionsContext


  const {
    bankAccounts,
    setBankAccounts,
    fetchBankAccounts,
    setIsBankAccountLoading,
    isBankAccountLoading,
    
  } = useBankAccounts()


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
        await getTransactions(accessToken); // Fetch transactions if access token is available
        await simulateBankAccounts()
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
      const token = await hasAccessToken();
      if (token) {
        setIsSynced(true);
        await simulateTransactions(token)
        await simulateBankAccounts()
      }
      else{
        console.log("Access token not found after exchangePublicToken");

      }
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
  const simulateTransactions = async (token: string) => {
    try {
      setIsLinkLoading(true);
      console.log("Sending access token to backend:", token);
  
      await PlaidApi.simulateTransactions(token);
      console.log("Successfully simulated new transactions!");
  
      await getTransactions(token);
    } catch (error) {
      console.error("Error simulating transactions:", error);
      alert("Error simulating transactions");
    } finally {
      setIsLinkLoading(false);
    }
  };



  const simulateBankAccounts = async() => {
    try {
      setIsBankAccountLoading(true)
      console.log("Sending token to backend")
      
      const token = await hasAccessToken()
      console.log("Access token being used:", token)

      await fetchBankAccounts()
      console.log("bank accounts fetched successfully:", bankAccounts)
    }
    catch(error){
      console.error("Error getting bank accounts:", error)
    }
    finally{
      setIsBankAccountLoading(false)
    }
  }
  

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

    
    </div>
  );
}
