import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogleCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (!token || !userParam) {
          throw new Error('Missing OAuth callback parameters');
        }

        const user = JSON.parse(decodeURIComponent(userParam));
        const result = await loginWithGoogleCallback(token, user);
        
        if (result.success) {
          navigate('/', { replace: true });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login', { 
          replace: true,
          state: { error: 'Google login failed. Please try again.' }
        });
      }
    };

    handleCallback();
  }, [searchParams, loginWithGoogleCallback, navigate]);

  return null;
};

export default GoogleOAuthCallback;
