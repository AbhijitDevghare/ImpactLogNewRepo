import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getRegisteredUsersByEvent } from "../redux/slices/EventSlice";

const RegisteredUsersPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const { registeredUsers = [], loading, error } = useSelector((state) => state.event);

  const navigate=useNavigate();

  useEffect(() => {
    if (eventId) dispatch(getRegisteredUsersByEvent(eventId));
  }, [dispatch, eventId]);

  if (loading) return <div className="text-center py-12 text-white">Loading users...</div>;
  if (error) return <div className="text-center py-12 text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Registered Users</h1>

      {registeredUsers.length === 0 ? (
        <p className="text-center text-gray-400">No registered users found.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {registeredUsers.length>0 && registeredUsers.map((reg) => (
            <div
              key={reg.id}
              className="bg-gray-800/80 rounded-xl p-5 border border-gray-700/50 flex items-center justify-between hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={reg.user?.avatarUrl}
                  alt={reg.user?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">{reg.user?.name}</p>
                  <p className="text-gray-400">{reg.user?.username}</p>
                </div>
              </div>
              <button
                onClick={() =>
                //   window.open(`http://localhost:5173/viewprofile/${reg.user?.id}`, "_blank")
                  navigate(`/viewprofile/${reg.user?.id}`)
                }
                className="py-2 px-4 bg-purple-600 hover:bg-purple-500 rounded-lg"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredUsersPage;
