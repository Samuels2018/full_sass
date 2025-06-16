import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProfileView } from '../../components/profile/ProfileView';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, updateUserProfile, signOut, deleteUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdate = async (data: any) => {
    try {
      await updateUserProfile(data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUser();
        signOut();
        navigate('/login');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting profile');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {isEditing ? (
          <ProfileForm
            user={user}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            error={error}
          />
        ) : (
          <ProfileView user={user} onEdit={() => setIsEditing(true)} />
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Danger Zone</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h4 className="text-md font-medium text-gray-900">Delete Account</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              signOut();
              navigate('/login');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};