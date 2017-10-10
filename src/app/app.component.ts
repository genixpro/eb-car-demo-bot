import {AfterViewChecked, Component, NgZone} from '@angular/core';
import * as speechSDK from 'microsoft-speech-browser-sdk/Speech.Browser.Sdk';
import { MessageComponent } from './message.component';
import {ApiAiClient} from "api-ai-javascript";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked
{
  public inputMessage: String;
  public recognizer: any;
  public listening: boolean;
  public messages: Array<{
    person: String,
    message: String
  }>;
  public chatClient: ApiAiClient;
  public minimumResponseDelay: number;

  constructor(private zone:NgZone)
  {
    this.inputMessage = "";

    const recognizerConfig = new speechSDK.RecognizerConfig(
      new speechSDK.SpeechConfig(
        new speechSDK.Context(
          new speechSDK.OS(navigator.userAgent, "Browser", null),
          new speechSDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
      speechSDK.RecognitionMode.Interactive, // speechSDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
      "en-US", // Supported languages are specific to each recognition mode. Refer to docs.
      speechSDK.SpeechResultFormat["Simple"]); // speechSDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

    // Alternatively use speechSDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    const authentication = new speechSDK.CognitiveSubscriptionKeyAuthentication("8a4fa6b11a7443abbe74f8b2e78ad542");

    this.recognizer = speechSDK.CreateRecognizer(recognizerConfig, authentication);
    this.listening = false;
    this.messages = [];

    this.chatClient = new ApiAiClient({accessToken: 'd0ed6d507e594c0f988c863acf7829fa'});
    this.minimumResponseDelay = 500;
  }

  public addMessage(message)
  {
    this.messages.push(message);
  }

  public submitText()
  {
    const message = this.inputMessage;

    this.addMessage({
      person: 'human',
      message: message
    });


    const startTime = new Date();

    this.chatClient.textRequest(message)
      .then((response) => {
        let responseMessage = response.result.fulfillment.speech;
        // console.log(response);

        if (response.result.metadata.intentName == 'Describe Vehicle')
        {
          // Get the type of car in order to generate an appropriate response.
          if (response.result.parameters.vehicle_model == 'camry')
          {
            responseMessage = "The Camry is a great, mid-market vehicle."
          }
          else if (response.result.parameters.vehicle_model == 'corolla')
          {
            responseMessage = "The Corolla is a great compact sedan. It competes with the Honda Civic and Ford Focus."
          }
        }


        const delay = Math.max(0, (this.minimumResponseDelay - (Date.now() - startTime.getTime())) );
        console.log(delay);
        setTimeout(() =>
        {
          this.addMessage({
            "person": 'bot',
            "message": responseMessage
          });
        }, delay);
      })
      .catch((error) => {/* do something here too */});

    this.inputMessage = "";
  }

  public microphoneClicked(event)
  {
    if (this.listening)
    {
      this.recognizer.AudioSource.TurnOff();
    }
    else
    {
      this.recognizer.Recognize((event) => {
        this.zone.run(() => {
          switch (event.Name) {
            case "RecognitionTriggeredEvent" :
              break;
            case "ListeningStartedEvent" :
              this.listening = true;
              break;
            case "RecognitionStartedEvent" :
              this.listening = true;
              break;
            case "SpeechStartDetectedEvent" :
              break;
            case "SpeechHypothesisEvent" :
              this.inputMessage = event.result.Text;
              break;
            case "SpeechEndDetectedEvent" :
              this.listening = false;
              this.submitText();
              break;
            case "SpeechSimplePhraseEvent" :
              break;
            case "SpeechDetailedPhraseEvent" :
              break;
            case "RecognitionEndedEvent" :
              this.listening = false;
              break;
          }
        });
      })
        .On(() => {
            // The request succeeded. Nothing to do here.
          },
          (error) => {
            console.error(error);
          });

    }
  }

  public onEnter()
  {
    this.submitText();
  }

  ngAfterViewChecked() {
    var conversationBody = document.querySelector('#mainConversationBody');
    conversationBody.scrollTop = conversationBody.scrollHeight - conversationBody.clientHeight;
  }
}
