import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (error) {
      setError('Failed to fetch typing sessions');
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Typing History</h2>
        
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No typing sessions yet. Start practicing!</p>
        ) : (
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-600">WPM</p>
                    <p className="text-xl font-semibold text-blue-700">{session.wpm}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-600">Accuracy</p>
                    <p className="text-xl font-semibold text-green-700">{session.accuracy}%</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-600">Errors</p>
                    <p className="text-xl font-semibold text-red-700">{session.totalErrors}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md">
                    <p className="text-sm text-purple-600">Date</p>
                    <p className="text-xl font-semibold text-purple-700">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Psychological Insights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Typing Style</p>
                      <p className="font-medium">
                        {session.psychologicalInsights.impulsivity > 70 ? 'Impulsive' :
                         session.psychologicalInsights.impulsivity < 30 ? 'Deliberate' : 'Balanced'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pressure Handling</p>
                      <p className="font-medium">
                        {session.psychologicalInsights.anxietyLevel > 70 ? 'High Pressure' :
                         session.psychologicalInsights.anxietyLevel < 30 ? 'Calm' : 'Moderate'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cognitive Load</p>
                      <p className="font-medium">
                        {session.psychologicalInsights.cognitiveLoad > 70 ? 'High' :
                         session.psychologicalInsights.cognitiveLoad < 30 ? 'Low' : 'Moderate'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Resilience</p>
                      <p className="font-medium">
                        {session.psychologicalInsights.resilience > 70 ? 'High' :
                         session.psychologicalInsights.resilience < 30 ? 'Low' : 'Moderate'}
                      </p>
                    </div>
                  </div>
                </div>

                {session.errorWords.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Errors</h3>
                    <div className="flex flex-wrap gap-2">
                      {session.errorWords.slice(0, 5).map((error, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm"
                        >
                          {error.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 