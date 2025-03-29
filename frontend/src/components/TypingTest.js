// import React, { useState, useEffect, useRef } from 'react';
// //import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const TypingTest = () => {
//   const { user } = useAuth();
//   //const navigate = useNavigate();
//   const textAreaRef = useRef(null);
  
//   const [text, setText] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [isActive, setIsActive] = useState(false);
//   const [stats, setStats] = useState({
//     wpm: 0,
//     accuracy: 100,
//     totalErrors: 0,
//     errorWords: [],
//     typingDurations: []
//   });
//   const [showResults, setShowResults] = useState(false);

//   // Sample text for typing test
//   const sampleText = "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the English alphabet. Typing tests help improve your speed and accuracy. Practice makes perfect, so keep typing!";

//   useEffect(() => {
//     setText(sampleText);
//   }, []);

//   useEffect(() => {
//     let interval = null;
//     if (isActive && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft(time => time - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       endTest();
//     }
//     return () => clearInterval(interval);
//   }, [isActive, timeLeft]);

//   const startTest = () => {
//     setIsActive(true);
//     setTimeLeft(30);
//     setUserInput('');
//     setShowResults(false);
//     textAreaRef.current?.focus();
//   };

//   const endTest = () => {
//     setIsActive(false);
//     calculateStats();
//     setShowResults(true);
//     if (user) {
//       saveSession();
//     }
//   };

//   const calculateStats = () => {
//     const words = text.split(' ');
//     const userWords = userInput.split(' ');
//     const errors = words.reduce((acc, word, index) => {
//       if (word !== userWords[index]) {
//         acc.push({ word, count: 1 });
//       }
//       return acc;
//     }, []);

//     const accuracy = ((text.length - errors.length) / text.length) * 100;
//     const wpm = (userInput.length / 5) * (60 / (30 - timeLeft));

//     setStats({
//       wpm: Math.round(wpm),
//       accuracy: Math.round(accuracy),
//       totalErrors: errors.length,
//       errorWords: errors,
//       typingDurations: [] // This would be populated with actual timing data
//     });
//   };

//   const saveSession = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No authentication token found');
//         return;
//       }

//       const sessionData = {
//         ...stats,
//         psychologicalInsights: {
//           impulsivity: calculateImpulsivity(),
//           cognitiveLoad: calculateCognitiveLoad(),
//           resilience: calculateResilience(),
//           anxietyLevel: calculateAnxietyLevel()
//         }
//       };

//       console.log('Saving session data:', sessionData);
//       const response = await axios.post(
//         `${API_URL}/api/sessions`,
//         sessionData,
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       console.log('Session saved successfully:', response.data);
//     } catch (error) {
//       console.error('Error saving session:', error.response?.data || error.message);
//       // You might want to show an error message to the user here
//     }
//   };

//   // Psychological insight calculations
//   const calculateImpulsivity = () => {
//     return Math.min(100, (stats.totalErrors / stats.wpm) * 50);
//   };

//   const calculateCognitiveLoad = () => {
//     return Math.min(100, (stats.errorWords.length / stats.wpm) * 30);
//   };

//   const calculateResilience = () => {
//     return Math.max(0, 100 - (stats.totalErrors * 10));
//   };

//   const calculateAnxietyLevel = () => {
//     return Math.min(100, (stats.totalErrors / timeLeft) * 20);
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Typing Test</h2>
//           <div className="text-xl font-semibold text-blue-600">
//             Time: {timeLeft}s
//           </div>
//         </div>

//         {!isActive && !showResults && (
//           <button
//             onClick={startTest}
//             className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Start Test
//           </button>
//         )}

//         {isActive && (
//           <div className="space-y-4">
//             <div className="bg-gray-50 p-4 rounded-md">
//               <p className="text-lg text-gray-700">{text}</p>
//             </div>
//             <textarea
//               ref={textAreaRef}
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//               className="w-full h-32 p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Start typing..."
//             />
//           </div>
//         )}

//         {showResults && (
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-gray-900">Your Results</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-50 p-4 rounded-md">
//                 <p className="text-sm text-gray-500">WPM</p>
//                 <p className="text-2xl font-bold text-blue-600">{stats.wpm}</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-md">
//                 <p className="text-sm text-gray-500">Accuracy</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.accuracy}%</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-md">
//                 <p className="text-sm text-gray-500">Errors</p>
//                 <p className="text-2xl font-bold text-red-600">{stats.totalErrors}</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-md">
//                 <p className="text-sm text-gray-500">Time</p>
//                 <p className="text-2xl font-bold text-purple-600">{30 - timeLeft}s</p>
//               </div>
//             </div>
//             <button
//               onClick={startTest}
//               className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-4"
//             >
//               Try Again
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TypingTest; 

import React, { useState, useEffect, useRef, useCallback } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TypingTest = () => {
  const { user } = useAuth();
  //const navigate = useNavigate();
  const textAreaRef = useRef(null);

  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    totalErrors: 0,
    errorWords: [],
    typingDurations: []
  });
  const [showResults, setShowResults] = useState(false);

  // Sample text for typing test
  const sampleText = "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the English alphabet. Typing tests help improve your speed and accuracy. Practice makes perfect, so keep typing!";

  useEffect(() => {
    setText(sampleText);
  }, []);

  // Use useCallback for functions used in useEffect dependencies

    // Psychological insight calculations
    const calculateImpulsivity = useCallback(() => {
        return Math.min(100, (stats.totalErrors / stats.wpm) * 50);
    }, [stats.totalErrors, stats.wpm]);

    const calculateCognitiveLoad = useCallback(() => {
        return Math.min(100, (stats.errorWords.length / stats.wpm) * 30);
    }, [stats.errorWords.length, stats.wpm]);

    const calculateResilience = useCallback(() => {
        return Math.max(0, 100 - (stats.totalErrors * 10));
    }, [stats.totalErrors]);

    const calculateAnxietyLevel = useCallback(() => {
        return Math.min(100, (stats.totalErrors / timeLeft) * 20);
    }, [stats.totalErrors, timeLeft]);

  const calculateStats = useCallback(() => {
    const words = text.split(' ');
    const userWords = userInput.split(' ');
    const errors = words.reduce((acc, word, index) => {
      if (word !== userWords[index]) {
        acc.push({ word, count: 1 });
      }
      return acc;
    }, []);

    const accuracy = ((text.length - errors.length) / text.length) * 100;
    const wpm = (userInput.length / 5) * (60 / (30 - timeLeft));

    setStats({
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      totalErrors: errors.length,
      errorWords: errors,
      typingDurations: [] // This would be populated with actual timing data
    });
  }, [text, userInput, timeLeft]);

  const saveSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const sessionData = {
        ...stats,
        psychologicalInsights: {
          impulsivity: calculateImpulsivity(),
          cognitiveLoad: calculateCognitiveLoad(),
          resilience: calculateResilience(),
          anxietyLevel: calculateAnxietyLevel()
        }
      };

      console.log('Saving session data:', sessionData);
      const response = await axios.post(
        `${API_URL}/api/sessions`,
        sessionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Session saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving session:', error.response?.data || error.message);
      // You might want to show an error message to the user here
    }
  }, [stats, calculateImpulsivity, calculateCognitiveLoad, calculateResilience, calculateAnxietyLevel]);


  const endTest = useCallback(() => {
    setIsActive(false);
    calculateStats();
    setShowResults(true);
    if (user) {
      saveSession();
    }
  }, [calculateStats, saveSession, user]); // Add calculateStats and saveSession as dependencies

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, endTest]); // Add endTest to the dependency array

  const startTest = () => {
    setIsActive(true);
    setTimeLeft(30);
    setUserInput('');
    setShowResults(false);
    textAreaRef.current?.focus();
  };



  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Typing Test</h2>
          <div className="text-xl font-semibold text-blue-600">
            Time: {timeLeft}s
          </div>
        </div>

        {!isActive && !showResults && (
          <button
            onClick={startTest}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Test
          </button>
        )}

        {isActive && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-lg text-gray-700">{text}</p>
            </div>
            <textarea
              ref={textAreaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-32 p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start typing..."
            />
          </div>
        )}

        {showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Your Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">WPM</p>
                <p className="text-2xl font-bold text-blue-600">{stats.wpm}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{stats.accuracy}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalErrors}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-2xl font-bold text-purple-600">{30 - timeLeft}s</p>
              </div>
            </div>
            <button
              onClick={startTest}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-4"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;
