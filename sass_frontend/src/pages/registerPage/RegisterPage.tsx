import { Link } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage = () => {

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative">
          <Link
            to="/login"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
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
              className="mr-1 h-4 w-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Volver al login
          </Link>
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Crear cuenta</h1>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-950 py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-800">
          <RegisterForm />
        </div>
      </div>
    </div>
  )


  /*return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );*/
};