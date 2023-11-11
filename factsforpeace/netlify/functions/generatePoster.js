const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const { createSVG, createImageFromSVG } = require('./svgCreator.js'); 

exports.handler = async (event) => {
  try {
    const { theme, facts, title, format } = JSON.parse(event.body);

    // Generate SVG Poster
    const svgPoster = createSVG(theme, facts, title);

    // Convert based on the requested format
    let result;
    switch (format) {
      case 'image':
        result = await createImageFromSVG(svgPoster);
        break;
// In your exports.handler function
        case 'pdf':
        result = await createPDF(theme, facts, title); 
        break;

      default: // svg
        result = svgPoster;
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

  

  function createPDF(theme, facts, title) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData.toString('base64'));
      });
      doc.on('error', reject);

      // Manually draw elements based on the SVG content
      doc.fillColor('black').fontSize(20).text(title, 10, 30);
      doc.fillColor('lightblue').circle(300, 400, 100).fill();
      doc.fillColor('black').fontSize(16).text(theme, 300, 400, { align: 'center' });

      // Additional logic to handle 'facts' and other elements goes here

      doc.end();
    });
}


