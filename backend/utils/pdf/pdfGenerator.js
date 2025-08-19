const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');

/**
 * Generates a PDF document with home details and image
 * @param {Object} home - The home object with details
 * @param {string} outputPath - Path where to save the PDF
 * @returns {Promise<string>} - Promise resolving to the path of the generated PDF
 */
const generateHomePDF = async (home, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            // Create a new PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                info: {
                    Title: `${home.houseName} - Details`,
                    Author: 'NexStay Clone',
                }
            });

            // Pipe the PDF to a write stream
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            // Add the header with title
            doc.fontSize(25)
               .font('Helvetica-Bold')
               .text(`${home.houseName}`, { align: 'center' });

            doc.moveDown();
            
            // Try to add the image if available
            try {
                const imagePath = path.join(process.cwd(), home.houseImage);
                if (fs.existsSync(imagePath)) {
                    doc.image(imagePath, {
                        fit: [500, 300],
                        align: 'center',
                    });
                    doc.moveDown();
                }
            } catch (imageError) {
                console.log('Error adding image to PDF:', imageError);
                // Continue without image if there's an error
                doc.fontSize(12)
                   .font('Helvetica-Italic')
                   .text('(Image not available)', { align: 'center' });
                doc.moveDown();
            }

            // Add home details
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .text('Home Details', { underline: true });
            doc.moveDown(0.5);
            
            // Location
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('Location:')
               .font('Helvetica')
               .fontSize(12)
               .text(home.houseLocation);
            doc.moveDown();
            
            // Price
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('Price:')
               .font('Helvetica')
               .fontSize(12)
               .text(`$${home.price} per night`);
            doc.moveDown();
            
            // Rating
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('Rating:')
               .font('Helvetica')
               .fontSize(12)
               .text(`${home.rating} out of 5`);
            doc.moveDown();
            
            // Description
            if (home.description) {
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .text('Description:')
                   .font('Helvetica')
                   .fontSize(12)
                   .text(home.description);
            }
            
            // Add a footer
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);
                
                // Save the current position
                const originalPosition = doc.y;
                
                // Go to the bottom of the page
                doc.fontSize(10)
                   .font('Helvetica')
                   .text(
                      'Generated from NexStay Clone - ' + new Date().toLocaleDateString(),
                      50,
                      doc.page.height - 50,
                      { align: 'center' }
                   );
                
                // Restore the position
                doc.y = originalPosition;
            }

            // Finalize the PDF
            doc.end();
            
            // When the stream is finished, resolve the promise with the path
            writeStream.on('finish', () => {
                resolve(outputPath);
            });
            
            writeStream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateHomePDF };
