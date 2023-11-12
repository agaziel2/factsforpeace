import React, { useState } from 'react';
import Papa from 'papaparse';

function DataUploadForm({ onFileLoaded }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log('Parsing file:', file);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log('Parse results:', results);
          onFileLoaded(results.data);
        },
        skipEmptyLines: true,
      });
    } else {
      alert('Please select a CSV file.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="file" onChange={e => setFile(e.target.files[0])} accept=".csv" />
      </div>
      <button type="submit">Upload Data</button>
    </form>
  );
}

export default DataUploadForm;
