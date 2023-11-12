import React, { useState, useEffect } from 'react';

function TranslationForm({ data, onSubmit }) {
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    // Initialize translations with the original data
    setTranslations(data.map(item => ({ ...item, translatedTheme: '', translatedFact: '' })));
  }, [data]);

  const handleTranslationChange = (index, field, value) => {
    const updatedTranslations = [...translations];
    updatedTranslations[index][field] = value;
    setTranslations(updatedTranslations);
  };  s

  const handleSubmit = (e) => {
    e.preventDefault();
    // Extract only the translated data
    const translatedData = translations.map(item => ({
        theme: item.translatedTheme, // Assuming the backend expects 'theme'
        fact: item.translatedFact   // Assuming the backend expects 'fact'
    }));
    onSubmit(translatedData);
};


  return (
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
  );
}

export default TranslationForm;
//triggert deploy