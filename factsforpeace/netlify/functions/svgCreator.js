
function createSVG(theme, facts, title) {
    // Basic SVG structure
    const svgStart = `<svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">`;
    const svgEnd = `</svg>`;
  
    // Add title with black background
    const svgTitle = `
      <rect width="100%" height="50" fill="black" />
      <text x="10" y="30" fill="white" font-size="20">${title}</text>
    `;
  
    // Add circle and theme text
    const svgCircle = `<circle cx="300" cy="400" r="100" fill="lightblue" />`;
    const svgTheme = `<text x="300" y="400" text-anchor="middle" fill="black" font-size="16">${theme}</text>`;
  
    // Concatenate all SVG parts
    return `${svgStart}${svgTitle}${svgCircle}${svgTheme}${svgEnd}`;
  }




  const sharp = require('sharp');

  async function createImageFromSVG(svgContent) {
    try {
      const buffer = Buffer.from(svgContent);
      const image = await sharp(buffer)
        .toFormat('png') // or 'jpeg'
        .toBuffer();
  
      return image.toString('base64'); // Returns base64 encoded image
    } catch (error) {
      console.error('Error in converting SVG to Image:', error);
      throw error;
    }
  }


// Export the functions
module.exports = { createSVG, createImageFromSVG };
