import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../features/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeliveryList from '../../components/servicesApi/DeliveryForm'; //DeliveryList
import DeliveryForm from '../../components/servicesApi/DeliveryForm'; // DeliveryForm

const Suscriptions: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Delivery Management System</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<DeliveryList />} />
              <Route path="/deliveries/new" element={<DeliveryForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};



export default Suscriptions;