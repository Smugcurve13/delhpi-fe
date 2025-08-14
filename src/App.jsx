import React, { useState, useEffect, useRef } from 'react';
import Daisy from './components/Daisy';
import Search from './components/Search';
import Sparkles from './components/Sparkles';
import anime from 'animejs';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [datasetDescription, setDatasetDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const mainContentRef = useRef(null);
  const daisyRefs = useRef([]);
  const waterRef = useRef(null);
  const rippleRefs = useRef([]);

  useEffect(() => {
    anime({
      targets: mainContentRef.current,
      translateY: ['20px', '0'],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutQuad',
    });

    anime({
      targets: daisyRefs.current,
      rotate: [-5, 5],
      duration: 3000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
      delay: anime.stagger(200, { start: 500 }),
    });

    anime({
      targets: waterRef.current,
      translateY: ['5px', '0px'],
      duration: 5000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
    });

    anime({
      targets: rippleRefs.current,
      translateX: ['-5px', '5px'],
      opacity: [0.2, 0.3],
      duration: 4000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad',
      delay: anime.stagger(1000),
    });
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    console.log(`Searching for: ${searchTerm}`);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGeminiQuery = async () => {
    if (!searchTerm) return;
    setIsGeneratingDescription(true);
    setDatasetDescription('');

    let retryCount = 0;
    const maxRetries = 3;
    let delay = 1000;

    while (retryCount < maxRetries) {
      try {
        const prompt = `Reply in the form of a sassy Gen Z Girl : ${searchTerm}`;
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          setDatasetDescription(text);
        } else {
          console.error('Unexpected API response structure:', result);
          setDatasetDescription('Could not generate a description.');
        }
        break;
      } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        } else {
          setDatasetDescription('Failed to generate a description after multiple retries.');
        }
      }
    }
    setIsGeneratingDescription(false);
  };

  return (
    <div className="relative min-h-screen font-sans overflow-hidden p-4 flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-green-100">
      <div className="absolute inset-0 z-0">
        <Daisy scale={0.8} positionClass="bottom-16 left-10 md:left-24 lg:left-40" index={0} />
        <Daisy scale={1} positionClass="bottom-20 right-20 md:right-40" index={1} />
        <Daisy scale={0.9} positionClass="bottom-10 left-1/2 transform -translate-x-1/2" index={2} />
        <Daisy scale={0.7} positionClass="bottom-24 left-1/4" index={3} />
        <Daisy scale={0.6} positionClass="bottom-14 right-1/4" index={4} />
        <div ref={waterRef} className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent via-blue-200 to-blue-400 opacity-70">
          <div className="absolute bottom-0 w-full h-full bg-blue-300 opacity-30 animate-pulse"></div>
          <div ref={el => rippleRefs.current[0] = el} className="absolute w-[120%] h-12 -left-10 bottom-10 bg-white opacity-20 blur-sm rounded-full"></div>
          <div ref={el => rippleRefs.current[1] = el} className="absolute w-[110%] h-8 -right-5 bottom-20 bg-white opacity-20 blur-sm rounded-full"></div>
        </div>
      </div>
      <div ref={mainContentRef} className="flex flex-col items-center justify-center p-8 bg-white/30 backdrop-blur-sm rounded-3xl shadow-xl z-10 w-full max-w-2xl transform transition-transform duration-500 hover:scale-[1.01]">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-2 readable-heading">
          Delphi
        </h1>
        <p className="text-sm md:text-md text-center mb-8 readable-subtitle">
          A gentle path to your data.
        </p>
        <div className="relative w-full flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Wassup Baby Doll"
            className="flex-grow pl-5 pr-4 py-3 rounded-full text-gray-800 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors duration-300 shadow-md placeholder-gray-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="p-3 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Search size={20} />
          </button>
          <button
            onClick={handleGeminiQuery}
            disabled={isGeneratingDescription || !searchTerm}
            className="flex items-center space-x-2 p-3 rounded-full bg-purple-400 hover:bg-purple-500 transition-colors duration-300 text-white shadow-lg disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            <Sparkles size={20} />
          </button>
        </div>
        {isSearching && (
          <div className="mt-4 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-400 animate-bounce mr-2"></div>
            <div className="w-4 h-4 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 rounded-full bg-blue-400 animate-bounce ml-2" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        {(isGeneratingDescription || datasetDescription) && (
          <div className="mt-8 w-full p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-md text-gray-800">
            <h3 className="text-xl font-bold mb-2 text-gray-700">Response ✨</h3>
            {isGeneratingDescription ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                <p>Generating description...</p>
              </div>
            ) : (
              <p>{datasetDescription}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;