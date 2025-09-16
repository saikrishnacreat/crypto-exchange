'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: object ) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.replace('/'); 
      } else {
        // If a token exists, stop loading
        setIsLoading(false);
      }
    }, [router]);

    // While loading, render nothing or a loading spinner
    if (isLoading) {
      return null; 
    }

    // If not loading and token exists, render the component
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;