// CONTROLLER

//Home Controller
module.exports.index = function (req, res, next) {
    res.render('index', { title: 'Express' });
}

//HANDLE CONTACT
module.exports.sendMessage = function (req, res, next) {
    //Get Values From Form
    const name = req.body.name
    const email = req.body.email
    const topic = req.body.topic || ''
    const message = req.body.message
    //Create Time Stamp
    const date = new Date()

    //log to console to test
    console.log(`${name} with email ${email} sent a message on the topic ${topic} which reads thus ${message}`)

    //refresh the page
    res.redirect('/#contact')
}