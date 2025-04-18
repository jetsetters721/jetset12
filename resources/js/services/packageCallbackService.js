import supabase from '../lib/supabase';

/**
 * Service for handling package callback request operations with Supabase
 */
const packageCallbackService = {
  /**
   * Create a new package callback request in Supabase
   * @param {Object} packageData - The package callback request data
   * @returns {Promise} - The response from Supabase
   */
  createPackageCallbackRequest: async (packageData) => {
    try {
      console.log('Submitting package callback request');
      
      // Define the data structure
      const requestData = {
        name: packageData.name,
        email: packageData.email,
        phone: packageData.phone,
        travel_date: packageData.travelDate || null,
        guests: packageData.guests || '2',
        budget: packageData.budget || null,
        request: packageData.request || null,
        package_name: packageData.packageName || 'Dubai Explorer',
        status: 'pending'
      };
      
      console.log('Request data:', requestData);
      
      // Use the REST API directly with proper headers
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/packagescallback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error with direct API call:', response.status, errorData);
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }
      
      console.log('Package callback request successfully created!');
      return { success: true };
    } catch (error) {
      console.error('Unexpected error in createPackageCallbackRequest:', error);
      throw error;
    }
  },
  
  /**
   * Get all package callback requests from Supabase
   * @returns {Promise} - The response from Supabase
   */
  getAllPackageCallbackRequests: async () => {
    try {
      const { data, error } = await supabase
        .from('packagescallback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching package callback requests:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error in getAllPackageCallbackRequests:', error);
      throw error;
    }
  }
};

export default packageCallbackService;
