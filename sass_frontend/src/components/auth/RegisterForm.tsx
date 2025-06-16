import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData } from '../../types/authTypes';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';


interface FieldError {
  message: string
  hasError: boolean
}

export function RegisterForm() {
  const { signUp, error } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    re_password: "",
    first_name: "",
    last_name: "",
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, FieldError>>({
    username: { message: "", hasError: false },
    email: { message: "", hasError: false },
    password: { message: "", hasError: false },
    re_password: { message: "", hasError: false },
  })

  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field error when user types
    if (fieldErrors[name]?.hasError) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: { message: "", hasError: false },
      }))
    }

    // Password strength check
    if (name === "password") {
      let strength = 0
      if (value.length >= 8) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)

      // Check if passwords match when changing password
      if (formData.re_password && value !== formData.re_password) {
        setFieldErrors((prev) => ({
          ...prev,
          re_password: {
            message: "Las contraseñas no coinciden",
            hasError: true,
          },
        }))
      } else if (formData.re_password) {
        setFieldErrors((prev) => ({
          ...prev,
          re_password: { message: "", hasError: false },
        }))
      }
    }

    // Check if passwords match when changing confirm password
    if (name === "re_password" && formData.password && value !== formData.password) {
      setFieldErrors((prev) => ({
        ...prev,
        re_password: {
          message: "Las contraseñas no coinciden",
          hasError: true,
        },
      }))
    } else if (name === "re_password" && formData.password && value === formData.password) {
      setFieldErrors((prev) => ({
        ...prev,
        re_password: { message: "", hasError: false },
      }))
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = { ...fieldErrors }

    // Validate username
    if (formData.username.length < 3) {
      newErrors.username = {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
        hasError: true,
      }
      isValid = false
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = {
        message: "Introduce un email válido",
        hasError: true,
      }
      isValid = false
    }

    // Validate password
    if (formData.password.length < 8) {
      newErrors.password = {
        message: "La contraseña debe tener al menos 8 caracteres",
        hasError: true,
      }
      isValid = false
    }

    // Validate password confirmation
    if (formData.password !== formData.re_password) {
      newErrors.re_password = {
        message: "Las contraseñas no coinciden",
        hasError: true,
      }
      isValid = false
    }

    setFieldErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await signUp(formData)
    } catch (err) {
      // Error handling is done by useAuth hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 bg-red-900/20 border border-red-200 border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-red-500 dark:text-red-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Apellido
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="username"
          className={`block text-sm font-medium ${fieldErrors.username.hasError ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          Nombre de usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            fieldErrors.username.hasError
              ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 dark:focus:ring-emerald-600"
          }`}
          aria-invalid={fieldErrors.username.hasError}
          aria-describedby={fieldErrors.username.hasError ? "username-error" : undefined}
        />
        {fieldErrors.username.hasError && (
          <p id="username-error" className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
            {fieldErrors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className={`block text-sm font-medium ${fieldErrors.email.hasError ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            fieldErrors.email.hasError
              ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 dark:focus:ring-emerald-600"
          }`}
          aria-invalid={fieldErrors.email.hasError}
          aria-describedby={fieldErrors.email.hasError ? "email-error" : undefined}
        />
        {fieldErrors.email.hasError && (
          <p id="email-error" className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
            {fieldErrors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className={`block text-sm font-medium ${fieldErrors.password.hasError ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            fieldErrors.password.hasError
              ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 dark:focus:ring-emerald-600"
          }`}
          aria-invalid={fieldErrors.password.hasError}
          aria-describedby={fieldErrors.password.hasError ? "password-error" : undefined}
        />
        {fieldErrors.password.hasError ? (
          <p id="password-error" className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
            {fieldErrors.password.message}
          </p>
        ) : (
          formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Seguridad de la contraseña:</span>
                <span className="text-xs font-medium">
                  {passwordStrength === 0 && "Débil"}
                  {passwordStrength === 1 && "Regular"}
                  {passwordStrength === 2 && "Buena"}
                  {passwordStrength === 3 && "Fuerte"}
                  {passwordStrength === 4 && "Excelente"}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === 0
                      ? "w-1/4 bg-red-500"
                      : passwordStrength === 1
                        ? "w-2/4 bg-orange-500"
                        : passwordStrength === 2
                          ? "w-3/4 bg-yellow-500"
                          : passwordStrength === 3
                            ? "w-full bg-emerald-500"
                            : "w-full bg-green-500"
                  }`}
                />
              </div>
            </div>
          )
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="re_password"
          className={`block text-sm font-medium ${fieldErrors.re_password.hasError ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          Confirmar contraseña
        </label>
        <input
          id="re_password"
          name="re_password"
          type="password"
          required
          value={formData.re_password}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            fieldErrors.re_password.hasError
              ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500 dark:focus:ring-emerald-600"
          }`}
          aria-invalid={fieldErrors.re_password.hasError}
          aria-describedby={fieldErrors.re_password.hasError ? "re-password-error" : undefined}
        />
        {fieldErrors.re_password.hasError && (
          <p id="re-password-error" className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
            {fieldErrors.re_password.message}
          </p>
        )}
        {!fieldErrors.re_password.hasError && formData.re_password && formData.password === formData.re_password && (
          <div className="flex items-center mt-1 text-green-600 dark:text-green-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-1"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Las contraseñas coinciden</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 h-11 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Registrando...
          </div>
        ) : (
          "Crear cuenta"
        )}
      </button>
    </form>
  )
}


/*export const RegisterForm = () => {
  const { signUp, error } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    re_password: '',
    first_name: '',
    last_name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="first_name"
              id="first_name"
              autoComplete="given-name"
              value={formData.first_name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="last_name"
              id="last_name"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="re_password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="re_password"
              name="re_password"
              type="password"
              required
              value={formData.re_password}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Register
        </button>
      </div>
    </form>
  );
};*/