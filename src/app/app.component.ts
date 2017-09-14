import { Component, NgZone} from '@angular/core';
import * as speechSDK from 'microsoft-speech-browser-sdk/Speech.Browser.Sdk';
import { MessageComponent } from './message.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  public inputMessage: String;
  public recognizer: any;
  public listening: boolean;
  public messages: Array<String>;

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
              this.messages.push(this.inputMessage);
              this.inputMessage = "";
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
}
