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

    // Adding Background Elements
    doc.fontSize(200).opacity(0.1).font('Helvetica').text('?', 100, 150);
    doc.fontSize(200).opacity(0.1).font('Helvetica').text('?', 400, 300);
    doc.opacity(1); // Reset opacity for main text

    // Layout and Design for Text
    doc.fontSize(30).font('Helvetica-Bold').text(theme, {
      align: 'center',
      underline: true,
      continued: true,
    });
    doc.moveDown(0.5);
    doc.fontSize(24).font('Helvetica').text(fact, {
      align: 'center',
    });

    // Optional: Add a footer or additional info here
    // doc.fontSize(12).text('Additional Information', { align: 'center' });

    doc.end();
  });
}




