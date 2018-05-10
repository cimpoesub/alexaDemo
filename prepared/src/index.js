const Alexa = require('alexa-sdk');

const Comm = require('./helpers/communicationHelper.js');

const states = {
  START: "_START_MODE",
  MESSAGESTATE: "_MESSAGE_STATE"
};

const initialMessage = 'Hello Bogdan, how can I help you? Would you like some trivia?';
const greetingMessage = 'Hello everyone and welcome to Hack TM 2018! Bogdan totally has an idea what he\'s talking about and is not just winging it! Would you like to hear some trivia?';
const fallowupMessage = '. Would you like to hear more trivia?';
const helpMessage = 'This skill can tell you some trivia if you ask for trivia. It can also say hello to the public. Would you like to hear some trivia?';
const goodbyeMessage = 'Goodbye everyone! See you at the next event!';

// Called when the session starts.
exports.handler = function (event, context, callback) {
  let alexa = Alexa.handler(event, context);
  alexa.appId=process.env.ALEXA_APP_ID;
  // alexa.applicationId=process.env.ALEXA_APP_ID;

  // Fix for hardcoded context from simulator
  if(event.context && event.context.System.application.applicationId == 'applicationId'){
    event.context.System.application.applicationId = event.session.application.applicationId;
  }
  
  alexa.registerHandlers(newSessionHandler, responseHandler);
  alexa.execute();
};

// Set state to start up and welcome the user
const newSessionHandler = {
  'NewSession': function () {
    console.log('\n ===== THIS stringified ===== \n' + JSON.stringify(this));
    this.handler.state = states.START;
    this.emit(':ask', initialMessage);
  },
};

const responseHandler = Alexa.CreateStateHandler(states.START, {
  'NewSession': function () {
    this.handler.state = '';
    this.emitWithState('NewSession');
  },
  'AMAZON.YesIntent': function () {
    Comm.getTrivia( (message)=>{
      this.emit(':ask', message + fallowupMessage);
    });
  },
  'SayHelloIntent': function () {
    this.emit(':ask', greetingMessage);
  },
  'TellTriviaIntent': function () {
    Comm.getTrivia( (message)=>{
      this.emit(':ask', message + fallowupMessage);
    });
  },
  'AMAZON.NoIntent': function () {
    this.emit(':tell', goodbyeMessage);
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', goodbyeMessage);
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', helpMessage);
  },
  'Unhandled': function () {
    this.emit(':ask', helpMessage);
  },
});
