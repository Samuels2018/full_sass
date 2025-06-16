import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDelivery } from '../../features/servicesApi/thunks';
import { DeliveryFormData } from '../../types/deliveriesTypes';
import { resetState } from '../../features/servicesApi/deliveriesSlice';
import { RootState, AppDispatch } from '../../features/store';

const DeliveryForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error, success } = useSelector((state: RootState) => state.deliveries);
  
  const [formData, setFormData] = useState<DeliveryFormData>({
    route_id: 0,
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    package_weight: 0.1,
    package_description: '',
    scheduled_at: new Date().toISOString().slice(0, 16),
    status_code: 'PROCESSING',
  });

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'package_weight' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addDelivery(formData));
  };

  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Success! </strong>
        <span className="block sm:inline">Delivery created successfully.</span>
        <button 
          onClick={() => dispatch(resetState())}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
        >
          Create another delivery
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New Delivery</h2>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="route_id">
              Route ID*
            </label>
            <input
              type="number"
              id="route_id"
              name="route_id"
              value={formData.route_id}
              onChange={handleChange}
              required
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status_code">
              Status
            </label>
            <select
              id="status_code"
              name="status_code"
              value={formData.status_code}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="PROCESSING">Processing</option>
              <option value="IN_TRANSIT">In Transit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient_name">
              Recipient Name*
            </label>
            <input
              type="text"
              id="recipient_name"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient_phone">
              Recipient Phone*
            </label>
            <input
              type="text"
              id="recipient_phone"
              name="recipient_phone"
              value={formData.recipient_phone}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient_address">
            Recipient Address*
          </label>
          <input
            type="text"
            id="recipient_address"
            name="recipient_address"
            value={formData.recipient_address}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="package_weight">
              Package Weight (kg)*
            </label>
            <input
              type="number"
              id="package_weight"
              name="package_weight"
              value={formData.package_weight}
              onChange={handleChange}
              required
              min="0.1"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduled_at">
              Scheduled At*
            </label>
            <input
              type="datetime-local"
              id="scheduled_at"
              name="scheduled_at"
              value={formData.scheduled_at}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="package_description">
            Package Description*
          </label>
          <textarea
            id="package_description"
            name="package_description"
            value={formData.package_description}
            onChange={handleChange}
            required
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="delivery_instructions">
            Delivery Instructions
          </label>
          <textarea
            id="delivery_instructions"
            name="delivery_instructions"
            value={formData.delivery_instructions || ''}
            onChange={handleChange}
            rows={2}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Register Delivery'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;