exports.handler = function(context, event, callback) {
    // Create a TwiML Voice Response object to build the response
    const twiml = new Twilio.twiml.VoiceResponse();

    // If no previous conversation is present, or if the conversation is empty, start the conversation
    if (!event.request.cookies.convo) {
        // Greet the user with a message using AWS Polly Neural voice
        twiml.say({
                voice: 'Polly.Joanna-Neural',
            },
            "Hey! I'm Joanna, a health proffessional chatbot. What would you like to talk about today?"
        );
    }

    // listen to the user's speech and pass the input to the /respond Function
    twiml.gather({
        speechTimeout: 'auto',
        speechModel: 'experimental_conversations',
        input: 'speech',
        action: '/respond',
    });

    // Create a Twilio Response object
    const response = new Twilio.Response();

    // Set the response content type to XML (TwiML)
    response.appendHeader('Content-Type', 'application/xml');

    // Set the response body to the generated TwiML
    response.setBody(twiml.toString());

    // If no conversation cookie is present, set an empty conversation cookie
    if (!event.request.cookies.convo) {
        response.setCookie('convo', '', ['Path=/']);
    }

    // Return the response to Twilio
    return callback(null, response);
};
