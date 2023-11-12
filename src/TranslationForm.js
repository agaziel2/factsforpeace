import React, { useState, useEffect } from 'react';

function TranslationForm({ data, onSubmit }) {
  const [translations, setTranslations] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTranslations(data.map(item => ({ ...item, translatedTheme: '', translatedFact: '', pdfData: null, pdfFileName: '' })));
  }, [data]);

  const handleTranslationChange = (index, field, value) => {
    const updatedTranslations = [...translations];
    updatedTranslations[index][field] = value;
    setTranslations(updatedTranslations);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDownload = (pdfData, pdfFileName) => {
    console.log("Downloading PDF:", pdfFileName);
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfData}`;
    link.download = `${pdfFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (index, theme, fact) => {
    const payload = {
      theme, 
      fact, 
      title // Add the title to the payload
    };
    const response = await onSubmit([payload]);
    if (response && response.data && response.data.data && response.data.data.length > 0) {
      const updatedTranslations = [...translations];
      updatedTranslations[index].pdfData = response.data.data[0];
      updatedTranslations[index].pdfFileName = theme;
      setTranslations(updatedTranslations);
      console.log(`PDF Generated for theme: ${theme}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter title for PDF"
        value={title}
        onChange={handleTitleChange}
      />
      <table>
        <thead>
          <tr>
            <th>Theme</th>
            <th>Fact</th>
            <th>Translated Theme</th>
            <th>Translated Fact</th>
            <th>Actions</th>
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
              <td>
                <button onClick={() => handleSubmit(index, item.translatedTheme, item.translatedFact)}>Generate PDF</button>
                {item.pdfData && (
                  <button onClick={() => handleDownload(item.pdfData, item.pdfFileName)}>Download PDF</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TranslationForm;
