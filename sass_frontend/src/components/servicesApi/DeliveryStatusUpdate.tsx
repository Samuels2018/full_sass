import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDelivery } from '../../features/servicesApi/thunks';
import { StatusUpdateData } from '../../types/deliveriesTypes';
import { RootState, AppDispatch } from '../../features/store';

interface DeliveryStatusUpdateProps {
  deliveryId: number;
  currentStatus: string;
  onClose: () => void;
}

const DeliveryStatusUpdate: React.FC<DeliveryStatusUpdateProps> = ({ 
  deliveryId, 
  currentStatus,
  onClose 
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [statusData, setStatusData] = useState<StatusUpdateData>({
    status_code: currentStatus,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStatusData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateDelivery({ id: deliveryId, statusData }))
      .then(() => onClose());
  };

  const nextStatusOptions = {
    PROCESSING: ['IN_TRANSIT', 'CANCELLED'],
    IN_TRANSIT: ['DELIVERED', 'FAILED'],
    FAILED: ['IN_TRANSIT', 'RETURNED'],
  }[currentStatus] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Update Delivery Status</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
            <select
              name="status_code"
              value={statusData.status_code}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {nextStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={statusData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryStatusUpdate;