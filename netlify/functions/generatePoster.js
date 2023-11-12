const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

async function createQRCode(url) {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error('Error generating QR Code:', error);
    return null;
  }
}

exports.handler = async (event) => {
  try {
    console.log("Received data:", event.body);
    const items = JSON.parse(event.body);
    console.log("Parsed items:", items);

    const results = await Promise.all(items.map(async (item) => {
      return await createPDF(item.theme, item.fact, item.title); // Pass the title to createPDF
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

function createPDF(theme, fact, title) { // Include title in the function parameters
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    // Generate QR Code
    const qrCodeImage = await createQRCode('https://rentfaktisk.dk');
    if (!qrCodeImage) {
      reject('Failed to generate QR Code');
      return;
    }

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData.toString('base64'));
    });
    doc.on('error', reject);

    // Title with Question Mark Background
    doc.fontSize(36).font('Helvetica-Bold').fillColor('#CCCCCC').text('?', 0, 40, { align: 'center' });
    doc.fillColor('black').text(title, { align: 'center' });

    // Theme (aligned left)
    doc.moveDown(2).fontSize(30).font('Helvetica').text(`Theme: ${theme}`, 50);

    // Fact with Exclamation Mark Background
    doc.moveDown().fontSize(30).font('Helvetica').fillColor('#CCCCCC').text('!', 0, doc.y + 20, { align: 'center' });
    doc.fillColor('black').text(`Fact: ${fact}`, 50, doc.y, { align: 'left' });

    // Add QR Code in Footer
    doc.image(qrCodeImage, 490, 680, { width: 100 });
    doc.fontSize(10).font('Helvetica').text('Scan for more information', 490, 800, { width: 100, align: 'center' });

    doc.end();
  });
}
