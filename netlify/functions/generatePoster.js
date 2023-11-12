const PDFDocument = require('pdfkit');
const { createSVG, createImageFromSVG } = require('./svgCreator.js'); 

exports.handler = async (event) => {
  try {
    // Expecting an array of items each with theme, facts, title, and format
    const items = JSON.parse(event.body);

    const results = await Promise.all(items.map(async (item) => {
      const svgPoster = createSVG(item.theme, item.facts, item.title);

      switch (item.format) {
        case 'image':
          return await createImageFromSVG(svgPoster);
        case 'pdf':
          return await createPDF(item.theme, item.facts, item.title);
        default:
          return svgPoster;
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ data: results }),
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


