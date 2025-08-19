const fs = require('fs-extra');
const path = require('path');
const Home = require('../models/home');
const { generateHomePDF } = require('../utils/pdf/pdfGenerator');

// Create a directory for temporary PDF files if it doesn't exist
const tempPdfDir = path.join(__dirname, '..', 'temp', 'pdf');
fs.ensureDirSync(tempPdfDir); // Creates directory if it doesn't exist

exports.downloadHomePDF = async (req, res, next) => {
    const homeId = req.params.homeId;
    
    try {
        // Find the home by ID
        const home = await Home.findById(homeId);
        
        if (!home) {
            console.log(`Home with ID ${homeId} not found for PDF generation.`);
            return res.status(404).send('Home not found');
        }
        
        // Create a unique filename for the PDF
        const pdfFilename = `home-${homeId}-${Date.now()}.pdf`;
        const pdfPath = path.join(tempPdfDir, pdfFilename);
        
        // Generate the PDF
        await generateHomePDF(home, pdfPath);
        
        // Set headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${home.houseName.replace(/[^a-zA-Z0-9]/g, '_')}_details.pdf"`);

        // Send the file
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

        // Clean up the file after sending
        fileStream.on('end', () => {
            fs.unlink(pdfPath, (err) => {
                if (err) console.error(`Error removing temporary PDF file ${pdfPath}:`, err);
                else console.log(`Temporary PDF file removed: ${pdfPath}`);
            });
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
};
