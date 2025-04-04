import { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link'; // Import type for metadata
import { useAuth } from '../context/AuthContext';
import { PlaidApi } from '../../utils/PlaidApi';
export default function PlaidLink() {


  // State to store tokens and loading status
  const [linkToken, setLinkToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Get the current user from AuthContext  
  // Get a link token when the component loads
  useEffect(() => {
    async function fetchLinkToken() {
        console.log(user?.id)
        // Ensure user is authenticated before fetching the link token
        if (!user) {
          console.error('User is not authenticated or user ID is missing');
          return;
        }

      try {
        setIsLoading(true);
        // Make a request to your Django backend
        const { linkToken } = await PlaidApi.createLinkToken(user.id)
        // Store the link token
        setLinkToken(linkToken);
        console.log('Link token fetched successfully:', linkToken);
      } catch (error) {
        console.error('Error fetching link token:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLinkToken();
  }, []);
  
  // Handle successful link
  const onSuccess = async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    try {
      setIsLoading(true);
      // Exchange the public token for an access token
      const { access_token } = await PlaidApi.exchangePublicToken(publicToken);
      // Store the access token
      console.log('Access token received:', access_token); // Log the access token for debugging
      setAccessToken(access_token);
      console.log('Successfully linked account:', metadata);


    } catch (error) {
      console.error('Error exchanging public token:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Configure the Plaid Link
  const config = {
    token: linkToken,
    onSuccess
  };
  
  // Get the open and ready functions from the Plaid Link hook
  const { open, ready } = usePlaidLink(config);
  
  // Function to simulate new transactions
  const simulateTransactions = async () => {
    if (!accessToken) {
      alert('Please connect a bank account first');
      return;
    }
    
    try {
      setIsLoading(true);
      // Make a request to your Django backend
      console.log("Sending access token to backend:", accessToken);

      await PlaidApi.simulateTransactions(accessToken);
      alert('Successfully simulated new transactions!');
    } catch (error) {
      console.error('Error simulating transactions:', error);
      alert('Error simulating transactions');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Plaid Integration</h2>
      
      {/* Button to open Plaid Link */}
      <button
        onClick={() => open()}
        disabled={!ready || !linkToken || isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? 'Loading...' : 'Connect Bank Account'}
      </button>
      
      {/* Show this section only after connecting an account */}
      {accessToken && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Account Connected!</h3>
          <button
            onClick={simulateTransactions}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {isLoading ? 'Loading...' : 'Simulate New Transactions'}
          </button>
        </div>
      )}
    </div>
  );
}