import axios from 'axios';

const API_URL = '/parkingList.json';

export const fetchParkings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data['@graph']; 
  } catch (error) {
    console.error('Error fetching parkings:', error);
    throw error;
  }
};
