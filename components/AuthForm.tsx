import { useState } from 'react';

type FormType = 'login' | 'register';

interface Props {
  formType: FormType;
}

const AuthForm: React.FC<Props> = ({ formType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle form submission
  };

  const isRegisterForm = formType === 'register';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-4">
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          {isRegisterForm ? 'Register' : 'Login'}
        </button>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </a>
      </div>
      {isRegisterForm && (
        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login here
          </a>
          .
        </p>
      )}
    </form>
  );
};

export default AuthForm;
