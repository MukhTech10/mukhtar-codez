const { sendMailToOwner, sendAckToCustomer } = require('../utils/mailer')

module.exports.sendMessage = async function (req, res, next) {
    try {
        // 1. Get Payload
        const { name, email, topic, message } = req.body;

        // 2. Payload Validation (Removed strict !topic so it doesn't drop valid requests)
        if (!name || !email || !message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, email, and message must be provided."
            });
        }

        // 3. Create Time Stamp
        const timeStamp = new Date().toLocaleString();

        // 4. Create The Mail Objects For Admin And Potential Client
        const adminMail = {
            name: name,
            email: email,
            topic: topic || 'General Inquiry', // Fallback value if frontend didn't supply a topic
            message: `time: ${timeStamp} \n message: ${message}`
        };

        const userMail = {
            name: name,
            email: email
        };

        // 5. Send Mails together concurrently
        await Promise.all([
            sendMailToOwner(adminMail),
            sendAckToCustomer(userMail)
        ]);

        // 6. Success Response
        return res.status(200).json({
            success: true,
            message: 'messages sent successfully'
        });

    } catch (error) {
        console.error("Mailer error: ", error.message);
        return res.status(500).json({
            success: false,
            message: 'Email Failed To Send',
            error: error.message
        });
    }
}