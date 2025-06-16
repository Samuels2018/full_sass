import React from 'react';
import RouteForm  from '../../components/servicesApi/RouteForm';


const RoutePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Create New Route</h1>
        <RouteForm />
      </div>
    </div>
  );
}

export default RoutePage;