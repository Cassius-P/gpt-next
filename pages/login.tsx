import AuthForm from '@/components/AuthForm';
import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      // Redirect the user to the messaging page
      window.location.href = '/messaging';
    } else {
      // Display an error message
      console.error('Login failed');
    }
  };

  return (
    <AuthForm formType='login'/>
  );
};

export default LoginPage;