const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can choose other services like 'Yahoo', 'Outlook'
    auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-email-password' // Your email password or app password
    }
});

// Function to send Welcome Email
function sendWelcomeEmail(to) {
    const mailOptions = {
        from: 'your-email@gmail.com', // sender address
        to: to, // list of receivers
        subject: 'Welcome to Our Service!', // Subject line
        text: 'Thank you for signing up with us. We are excited to have you on board!', // plain text body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending welcome email:', error);
        }
        console.log('Welcome email sent: ' + info.response);
    });
}

// Function to send Order Confirmation Email
function sendOrderConfirmationEmail(to, orderDetails) {
    const mailOptions = {
        from: 'your-email@gmail.com', // sender address
        to: to, // list of receivers
        subject: 'Order Confirmation', // Subject line
        text: `Your order has been confirmed!\n\nOrder Details: ${JSON.stringify(orderDetails)}`, // plain text body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending order confirmation email:', error);
        }
        console.log('Order confirmation email sent: ' + info.response);
    });
}

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail };