import React, { useState } from 'react';
import axios from 'axios';
import TranslationForm from './TranslationForm';
import DataUploadForm from './DataUploadForm';

function App() {
  const [originalData, setOriginalData] = useState([]);
  
  const handleFileLoaded = (data) => {
    setOriginalData(data);
  };

  const handleSubmitTranslations = async (translations) => {
    try {
      const response = await axios.post('/.netlify/functions/generatePoster', JSON.stringify(translations), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Handle the response
      console.log(response.data);
      return response; // Return the response for the TranslationForm to use
    } catch (error) {
      console.error('Error generating poster:', error);
    }
  };
  

  return (
    <div className="App">
      <h1>Poster Translator</h1>
      <DataUploadForm onFileLoaded={handleFileLoaded} />
      <TranslationForm data={originalData} onSubmit={handleSubmitTranslations} />
    </div>
  );
}

export default App;
