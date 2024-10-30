import axios from 'axios';

interface UserDetails {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({ name, email, password }: UserDetails) => {
  if (!name || !email || !password) {
    throw new Error('Missing required fields');
  }

  try {
    const response = await axios.post('/api/register', {
      name,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: status => status < 500
    });

    if (response.status !== 200) {
      throw new Error(response.data.error || 'Registration failed');
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};
