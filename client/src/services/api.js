const API_BASE_URL = 'http://localhost:5000';

/**
 * Check if the Mule Detection Express backend is running.
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('Server returned an error status');
    return await response.json();
  } catch (error) {
    console.warn('Backend server not currently reachable:', error.message);
    return null;
  }
}

/**
 * Send transactions to the backend detection engine.
 * @param {Array} transactions
 */
export async function detectMuleTransactions(transactions) {
  const response = await fetch(`${API_BASE_URL}/api/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactions),
  });

  if (!response.ok) {
    throw new Error(`Detection request failed with status: ${response.status}`);
  }

  return await response.json();
}
