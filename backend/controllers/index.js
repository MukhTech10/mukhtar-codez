// CONTROLLER
const { sendMailToOwner, sendAckToCustomer } = require('../utils/mailer')

//Home Controller
module.exports.index = function (req, res, next) {
    res.render('index', { title: 'Express' });
}

//HANDLE CONTACT
// HANDLE CONTACT
module.exports.sendMessage = async function (req, res, next) { // 1. Added 'async' keyword here
    try {
        // Get Values From Form
        const name = req.body.name;
        const email = req.body.email;
        const topic = req.body.topic || '';
        const message = req.body.message;
        
        // Create Time Stamp
        const date = new Date();

        // 2. Node blocks execution until both emails are successfully sent
        await Promise.all([
            sendMailToOwner({ name, email, topic, message }),
            sendAckToCustomer({ name, email })
        ]);

        // 3. Only refresh the page AFTER the emails are completely gone
        res.redirect('/#contact');

    } catch (error) {
        // 4. Always catch mail delivery failures so your server doesn't crash
        console.error("Form Submission Mailer Error:", error.message);
        next(error); 
    }
}