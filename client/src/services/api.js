const API_BASE_URL = 'http://localhost:5000';

/**
 * Check if the Mule Detection Express backend is running.
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/detection`);

    if (!response.ok) {
      throw new Error('Server returned an error status');
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend server not currently reachable:', error.message);
    return null;
  }
}

/**
 * Get mule detection results from the backend.
 */
export async function detectMuleTransactions() {
  const response = await fetch(`${API_BASE_URL}/api/detection`);

  if (!response.ok) {
    throw new Error(
      `Detection request failed with status: ${response.status}`
    );
  }

  return await response.json();
}