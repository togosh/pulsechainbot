var CONFIG = require('./config.json');
var DEBUG = CONFIG.debug;
console.log('Debug mode:', DEBUG);

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('es6-promise').polyfill();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'PulseChainBot Website'
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const transporter = nodemailer.createTransport({
        host: CONFIG.email.host,
        port: CONFIG.email.port,
        secure: CONFIG.email.secure,
        auth: {
            user: CONFIG.email.user,
            pass: CONFIG.email.pass
        }
    });

    const mailOptions = {
        from: CONFIG.email.from,
        to: CONFIG.email.to,
        subject: `PulseChainBot Contact Form: ${name}`,
        text: `You have a new contact request:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p>You have a new contact request:</p><ul><li>Name: ${name}</li><li>Email: ${email}</li><li>Message: ${message}</li></ul>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Error sending email' });
    }
});

// Error handling for 404
app.use((req, res, next) => {
    res.status(404).send("Sorry, that page doesn't exist!");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const HTTP_PORT = CONFIG.port || 8080;
const HTTPS_PORT = 443;

if (CONFIG.https && CONFIG.https.key && CONFIG.https.cert) {
    try {
        const httpsOptions = {
            key: fs.readFileSync(path.resolve(__dirname, CONFIG.https.key)),
            cert: fs.readFileSync(path.resolve(__dirname, CONFIG.https.cert))
        };

        https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
            console.log(`PulseChainBot HTTPS server running on port ${HTTPS_PORT} for ${CONFIG.hostname}`);
        });

        http.createServer((req, res) => {
            res.writeHead(301, { "Location": "https://" + CONFIG.hostname + req.url });
            res.end();
        }).listen(HTTP_PORT, () => {
            console.log(`HTTP server running on port ${HTTP_PORT}, redirecting to HTTPS`);
        });

    } catch (err) {
        console.error("Could not start HTTPS server. Error reading certificate files:", err.message);
        console.log("Falling back to HTTP only on port " + HTTP_PORT);
        app.listen(HTTP_PORT, () => {
            console.log(`PulseChainBot HTTP server running on port ${HTTP_PORT} (HTTPS setup failed)`);
        });
    }
} else {
    console.log('HTTPS not configured. Starting HTTP server only.');
    app.listen(HTTP_PORT, () => {
        console.log(`PulseChainBot HTTP server running on port ${HTTP_PORT}`);
    });
}