const PDFDocument = require('pdfkit');
const { createSVG, createImageFromSVG } = require('./svgCreator.js'); 

exports.handler = async (event) => {
  try {
    console.log("Received data:", event.body);
    const items = JSON.parse(event.body);
    console.log("Parsed items:", items);

    const results = await Promise.all(items.map(async (item) => {
      return await createPDF(item.theme, item.fact); // Always creating a PDF
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


 function createPDF(theme, fact) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData.toString('base64'));
    });
    doc.on('error', reject);

    // Hardcoded title
    const title = "Your Hardcoded Title";

    doc.fillColor('black').fontSize(20).text(title, 10, 30);
    // You can adjust the positioning and styling as needed
    doc.fillColor('black').fontSize(16).text(`Theme: ${theme}`, 10, 60);
    doc.fillColor('black').fontSize(16).text(`Fact: ${fact}`, 10, 90);

    doc.end();
  });
}



