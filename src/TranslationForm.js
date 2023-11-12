import React, { useState, useEffect } from 'react';

function TranslationForm({ data, onSubmit }) {
  const [translations, setTranslations] = useState([]);
  const [pdfData, setPdfData] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');


  useEffect(() => {
    // Initialize translations with the original data
    setTranslations(data.map(item => ({ ...item, translatedTheme: '', translatedFact: '' })));
  }, [data]);

  const handleTranslationChange = (index, field, value) => {
    const updatedTranslations = [...translations];
    updatedTranslations[index][field] = value;
    setTranslations(updatedTranslations);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfData}`;
    link.download = `${pdfFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const translatedData = translations.map(item => ({
      theme: item.translatedTheme,
      fact: item.translatedFact
    }));
    const response = await onSubmit(translatedData);
    if (response.data && response.data.length > 0) {
      setPdfData(response.data[0]); // Assuming the first item for demonstration
      setPdfFileName(translatedData[0].theme); // Set file name based on the first theme
      console.log("PDF Generated Successfully");
    }
  };


  return (
    <div>
    <form onSubmit={handleSubmit}>
      <table>
        <thead>
          <tr>
            <th>Theme</th>
            <th>Fact</th>
            <th>Translated Theme</th>
            <th>Translated Fact</th>
          </tr>
        </thead>
        <tbody>
          {translations.map((item, index) => (
            <tr key={index}>
              <td>{item.Themes}</td>
              <td>{item.Facts}</td>
              <td>
                <input
                  type="text"
                  value={item.translatedTheme}
                  onChange={(e) => handleTranslationChange(index, 'translatedTheme', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.translatedFact}
                  onChange={(e) => handleTranslationChange(index, 'translatedFact', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">Generate Translated Posters</button>
    </form>
     {pdfData && (
      <div>
        <p>Generated PDF: {pdfFileName}</p>
        <button onClick={handleDownload}>Download PDF</button>
      </div>
    )}
  </div>
);
}

export default TranslationForm;