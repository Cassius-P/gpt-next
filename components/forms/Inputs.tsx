import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

interface InputProps {
  type: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  prefix?: string;
  color?: 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  name: string;
  label?: string;
  onChange?: (...args: any) => void;
  value?: string;
}
const Input: React.FC<InputProps> = ({
    type,
    placeholder,
    name,
    value,
    label,
    color = "blue",
    prefix,
    onChange,
  }) => {
    const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.target.value);
    };
  
    return (
      <div className={`flex flex-col`}>
      {label && (
        <label htmlFor={name} className="dark:text-white text-base font-md text-gray-700 font-semibold py-2">
          {label}
        </label>
      )}
      <div
        className={`relative rounded-md group focus-within:${prefix ? 'ring-l' : 'ring'}-2 focus-within:ring-${color}-500 flex`}
      >
        {prefix && (
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 py-2">
            {prefix}
          </span>
        )}
        <input
            value = {value}
          onChange={handleInputChange}
          id={name}
          name={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
            prefix ? 'rounded-l-none flex-1' : ''
          } pl-${prefix ? '0' : '2'} p-2 border-gray-300 w-full border focus:border-${color}-500 focus:ring focus:ring-${color}-200 focus:outline-none rounded text-gray-700 ${
            prefix ? 'rounded-r block ' : ''
          }`}
        />
        {type === 'password' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {showPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(false)}
                className="focus:outline-none"
              >
                <EyeSlashIcon className={`h-5 w-5 text-${color}-500`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPassword(true)}
                className="focus:outline-none"
              >
                <EyeIcon className={`h-5 w-5 text-${color}-500`} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    );
  };
  
  export default Input;