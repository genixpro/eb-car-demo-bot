import {AfterViewChecked, Component, NgZone} from '@angular/core';
import * as speechSDK from 'microsoft-speech-browser-sdk/Speech.Browser.Sdk';
import { ActivatedRoute } from '@angular/router';
import {MessageComponent} from './message.component';
import {ApiAiClient} from "api-ai-javascript";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  public inputMessage: String;
  public recognizer: any;
  public listening: boolean;
  public messages: Array<{
    person: String,
    message: String
  }>;
  public chatClient: ApiAiClient;
  public minimumResponseDelay: number;
  public specsData: any;
  public mode: String;
  public chatAreaVisible: boolean;

  constructor(private zone: NgZone, route: ActivatedRoute) {
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

    this.addMessage({
      "person": 'bot',
      "message": "Hello, Magesh, I have noticed that you have shown an interest in the Corolla. Did you have any questions regarding the vehicle?"
    });

    this.mode = 'dealership';
    this.chatAreaVisible = true;

    this.chatClient = new ApiAiClient({accessToken: 'd0ed6d507e594c0f988c863acf7829fa'});
    this.minimumResponseDelay = 500;

    this.specsData = {
      "modelYear": "2018",
      "seriesCode": "COR",
      "heading": ["COROLLA CE 6M", "COROLLA CE CVT", "COROLLA SE 6M", "COROLLA LE CVT", "COROLLA LE ECO CVT", "COROLLA SE CVT"],
      "modelCodes": ["BURCEM", "BURCEC", "BURSEM", "BURLEC", "BUREQC", "BURSEC"],
      "models": [{
        "code": "BURCEM",
        "seriesCode": "COR",
        "name": {"fr": "COROLLA CE 6M", "en": "COROLLA CE 6M"},
        "defaultExteriorColourCode": "0040",
        "packages": [{"name": {"fr": "Groupe standard", "en": "Standard Package"}, "code": "A", "isBase": true}],
        "index": 0
      }, {
        "code": "BURCEC",
        "seriesCode": "COR",
        "name": {"fr": "COROLLA CE CVT", "en": "COROLLA CE CVT"},
        "defaultExteriorColourCode": "0040",
        "packages": [{"name": {"fr": "Groupe standard", "en": "Standard Package"}, "code": "B", "isBase": true}],
        "index": 1
      }, {
        "code": "BURSEM",
        "seriesCode": "COR",
        "name": {"fr": "COROLLA SE 6M", "en": "COROLLA SE 6M"},
        "defaultExteriorColourCode": "0040",
        "packages": [{
          "name": {"fr": "Groupe standard", "en": "Standard Package"},
          "code": "A",
          "isBase": true
        }, {"name": {"fr": "Groupe Amélioré", "en": "Upgrade Package"}, "code": "B", "isBase": false}],
        "index": 2
      }, {
        "code": "BURLEC",
        "seriesCode": "COR",
        "name": {"fr": "COROLLA LE CVT", "en": "COROLLA LE CVT"},
        "defaultExteriorColourCode": "0040",
        "packages": [{
          "name": {"fr": "Groupe standard", "en": "Standard Package"},
          "code": "A",
          "isBase": true
        }, {
          "name": {"fr": "Groupe Amélioré", "en": "Upgrade Package"},
          "code": "B",
          "isBase": false
        }, {"name": {"fr": "Groupe XLE", "en": "XLE Package"}, "code": "C", "isBase": false}],
        "index": 3
      }, {
        "code": "BUREQC",
        "seriesCode": "COR",
        "name": {"fr": "COROLLA LE ECO CVT", "en": "COROLLA LE ECO CVT"},
        "defaultExteriorColourCode": "0040",
        "packages": [{"name": {"fr": "Groupe standard", "en": "Standard Package"}, "code": "A", "isBase": true}],
        "index": 4
      }, {
        "code": "BURSEC",
        "seriesCode": "COR",
        "name": {"fr": "COROLLA SE CVT", "en": "COROLLA SE CVT"},
        "defaultExteriorColourCode": "0040",
        "packages": [{
          "name": {"fr": "Groupe standard", "en": "Standard Package"},
          "code": "A",
          "isBase": true
        }, {
          "name": {"fr": "Groupe Amélioré", "en": "Upgrade Package"},
          "code": "B",
          "isBase": false
        }, {"name": {"fr": "Groupe XSE", "en": "XSE Package"}, "code": "C", "isBase": false}],
        "index": 5
      }],
      "categories": [{
        "id": "Interior",
        "id_en": "Interior",
        "groups": [{
          "name": "Steering",
          "items": [{
            "name": "3-spoke Steering Wheel",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Tilt & Telescopic Steering Wheel",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Steering Wheel Audio Controls",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Leather Wrapped Steering Wheel", "values": ["-", "-", "S", "O:Upgrade Package", "-", "S"]}]
        }, {
          "name": "Climate Control",
          "items": [{
            "name": "Dust, Pollen, Deodorizing Air Filter",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Rear Seat Heater Ducts", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Air Conditioning",
            "values": ["-", "S", "S", "S", "S", "S"]
          }, {"name": "Auto A/C", "values": ["-", "-", "S", "S", "S", "S"]}]
        }, {
          "name": "Audio",
          "items": [{
            "name": "6.1-inch Display Screen",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Voice Recognition", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "AM/FM/CD/MP3/WMA",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Audio Auxiliary Input Jack",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "USB Audio Input", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Bluetooth Capability",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "6 Speakers", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Glass Imprinted Antenna",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "SIRI Eyes-Free", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Seats",
          "items": [{
            "name": "Fabric Seats",
            "values": ["S", "S", "-", "-", "-", "-"]
          }, {
            "name": "Headrest-Vertical - Driver",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Driver Seat Recline Adjustment",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Driver Seat Vertical Adjustment",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Driver Seat Fore/Aft",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Headrest-Vertical - Passenger",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Passenger Seat Recline",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Passenger Seat Fore/Aft",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Fold Down Rear Seat (60/40)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Front Sport Seats", "values": ["-", "-", "S", "-", "-", "S"]}, {
            "name": "Heated Front Seats",
            "values": ["-", "-", "S", "S", "S", "S"]
          }, {"name": "Rear Seat Fold Down Centre Armrest", "values": ["-", "-", "S", "S", "S", "S"]}]
        }, {
          "name": "Windows",
          "items": [{
            "name": "Power Windows with Driver Side Auto Up / Down",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Electric Rear Window Defroster with Timer",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "High Solar Energy Absorbing Window Glass", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Convenience",
          "items": [{"name": "Power Door Locks", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Instrumentation",
          "items": [{
            "name": "3.5-inch TFT Multi Information Display",
            "values": ["S", "S", "-", "S", "S", "-"]
          }, {"name": "Backup Camera", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Tachometer",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Water Temperature Gauge",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Outside Temperature Gauge", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "ECO Indicator",
            "values": ["-", "S", "-", "S", "S", "S"]
          }, {
            "name": "4.2-inch TFT Multi Information Display",
            "values": ["-", "-", "S", "-", "-", "S"]
          }, {"name": "Instrumentation: Sport Speedometer", "values": ["-", "-", "S", "-", "-", "S"]}]
        }, {
          "name": "Mirrors",
          "items": [{"name": "Dual Vanity Mirrors", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Trim",
          "items": [{
            "name": "Resin Door Trim",
            "values": ["S", "S", "-", "-", "-", "-"]
          }, {
            "name": "Interior Trim: Piano Black Center Cluster Accent",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Interior Trim: Piano Black Instrument Panel Trim Accent",
            "values": ["-", "-", "S", "-", "-", "S"]
          }, {
            "name": "Synthetic Leather Door Trim",
            "values": ["-", "-", "S", "-", "-", "S"]
          }, {
            "name": "Chrome Inner Door Handles",
            "values": ["-", "-", "S", "S", "S", "S"]
          }, {"name": "Fabric Door Trim", "values": ["-", "-", "-", "S", "S", "-"]}]
        }, {
          "name": "Lights",
          "items": [{"name": "Fadeout Dome Lamp", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Cargo Lamp",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Map Lamps", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Illuminated Entry",
            "values": ["S", "S", "S", "S", "S", "S"]
          }]
        }, {
          "name": "Storage",
          "items": [{
            "name": "Front Console Box with Lid",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Storage: Synthetic Leather Console Box Lid",
            "values": ["-", "-", "S", "-", "-", "S"]
          }, {
            "name": "Storage: Front Passenger Rear Seatback Pocket",
            "values": ["-", "-", "S", "S", "S", "S"]
          }, {"name": "Storage: Soft Touch Console Box Lid", "values": ["-", "-", "-", "S", "S", "-"]}]
        }, {
          "name": "Flooring",
          "items": [{
            "name": "Carpet Floor Mats",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "All Season Floor Mats", "values": ["S", "S", "S", "S", "S", "S"]}]
        }]
      }, {
        "id": "Convenience",
        "id_en": "Convenience",
        "groups": [{
          "name": "Convenience",
          "items": [{
            "name": "Front Sun Visors with Extenders",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "12Volt Accessory Power Outlet",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Digital Clock", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Front & Rear Cup Holders",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Dynamic Radar Cruise Control", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Trim",
          "items": [{"name": "Door Map Pockets", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Security",
          "items": [{
            "name": "Security: Remote Trunk Release",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Keyless Entry with Trunk Release", "values": ["-", "-", "S", "S", "S", "S"]}]
        }]
      }, {
        "id": "Safety",
        "id_en": "Safety",
        "groups": [{
          "name": "Safety",
          "items": [{
            "name": "Whiplash-Injury-Lessening (WIL) Front Seats",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Front Passenger Seat Cushion Airbag",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Driver & Front Passenger Seat belt Pretensioner and Force Limiter",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Front Passenger Airbag Status / Occupancy Classification Indicator",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Driver & Passenger Airbag Supplemental Restraint System (SRS)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Front Seat Mounted Side Airbags",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Driver Knee Airbag",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Front and Rear Side Curtain Airbags",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "All-Position 3-Point Lap & Shoulder Belts",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Front Seatbelt Anchor Height Adjusters",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Rear Side Seatbelt Comfort Guides",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Anchor Points for Child Restraint Seats",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Child Protector Rear Door Locks",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Assist Grips", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Engine Immobilizer",
            "values": ["S", "S", "S", "S", "S", "S"]
          }]
        }, {
          "name": "Toyota Safety Sense",
          "items": [{
            "name": "Pre-Collision System with Pedestrian Detection",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Auto High Beam",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Dynamic Radar Cruise Control (full speed)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Lane Departure Alert with Steering Assist", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Security",
          "items": [{"name": "Remote Fuel Lid Release", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Warning",
          "items": [{
            "name": "Warnings: Shift Position Indicator",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Warnings: Head Lamps on with Auto Cut Off",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Low Fuel", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Low Washer Fluid",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Door Ajar",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Front Driver and Passenger Seat Belt Warning",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Warnings: Key Remind Warning",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Parking Brake", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "Warnings: Engine monitor",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Tire Pressure Monitoring System",
            "values": ["-", "-", "-", "O:XLE Package", "S", "O:XSE Package"]
          }]
        }, {
          "name": "Star Safety System",
          "items": [{
            "name": "Star Safety System: Smart Stop Technology (SST)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Star Safety System: Vehicle Stability Control (VSC)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Star Safety System: Anti-lock Brake System (ABS)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Star Safety System: Traction Control (TRAC)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Star Safety System: Electronic Brake Force Distribution (EBD)",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Star Safety System: Brake Assist (BA)", "values": ["S", "S", "S", "S", "S", "S"]}]
        }]
      }, {
        "id": "Exterior",
        "id_en": "Exterior",
        "groups": [{
          "name": "Wheels",
          "items": [{
            "name": "Full Wheel Covers",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Wheels : 15\" Steel Wheels",
            "values": ["S", "S", "-", "-", "S", "-"]
          }, {"name": "16\" Steel Wheels", "values": ["-", "-", "S", "S", "-", "S"]}]
        }, {
          "name": "Exterior",
          "items": [{
            "name": "Front Splash Guards",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Rear Splash Guards",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Colour-Keyed Door Handles",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Chrome Exhaust Tip", "values": ["-", "-", "S", "-", "-", "S"]}, {
            "name": "Rear Lip Spoiler",
            "values": ["-", "-", "S", "-", "S", "S"]
          }, {"name": "Sport Front Bumper & Grille", "values": ["-", "-", "S", "-", "-", "S"]}]
        }, {
          "name": "Mirrors",
          "items": [{
            "name": "Power-Adjustable, Colour-Keyed Heated Mirrors",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Integrated Signal Lamps", "values": ["-", "-", "S", "-", "-", "S"]}]
        }, {
          "name": "Wipers",
          "items": [{
            "name": "Intermittent Wipers",
            "values": ["S", "S", "-", "-", "-", "-"]
          }, {
            "name": "Variable Intermittent Wipers",
            "values": ["-", "-", "S", "S", "S", "S"]
          }, {"name": "Windshield Wiper De-Icer", "values": ["-", "-", "S", "S", "S", "S"]}]
        }, {
          "name": "Lights",
          "items": [{
            "name": "Headlamp LED Daytime Running Lights",
            "values": ["S", "S", "-", "S", "S", "-"]
          }, {
            "name": "Automatic Headlamp System",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Bi-LED Headlamps",
            "values": ["S", "S", "-", "S", "S", "-"]
          }, {
            "name": "Bumper LED Daytime Running Lights",
            "values": ["-", "-", "S", "-", "-", "S"]
          }, {"name": "Multi-LED Headlamps", "values": ["-", "-", "S", "-", "-", "S"]}, {
            "name": "LED Reverse Lights",
            "values": ["-", "-", "S", "-", "-", "S"]
          }]
        }]
      }, {
        "id": "Mechanical",
        "id_en": "Mechanical",
        "groups": [{
          "name": "Transmission",
          "items": [{"name": "6-Speed", "values": ["S", "-", "S", "-", "-", "-"]}, {
            "name": "Manual",
            "values": ["S", "-", "S", "-", "-", "-"]
          }, {
            "name": "Continuously Variable Transmission Intelligent Shift (CVTi-S)",
            "values": ["-", "S", "-", "S", "S", "S"]
          }, {
            "name": "Sequential Multi-Mode Shifter",
            "values": ["-", "-", "-", "-", "-", "S"]
          }, {"name": "Paddle Shifters", "values": ["-", "-", "-", "-", "-", "S"]}]
        }, {
          "name": "Engine",
          "items": [{"name": "1.8 Litre", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "4-Cylinder",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "DOHC", "values": ["S", "S", "S", "S", "S", "S"]}, {
            "name": "16-Valve",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Dual Variable Valve Timing with intelligence (VVT-i)",
            "values": ["S", "S", "S", "S", "-", "S"]
          }, {
            "name": "Ultra Low Emissions Vehicle (ULEV II)",
            "values": ["S", "S", "S", "S", "-", "S"]
          }, {
            "name": "VALVEMATIC (continuously variable valve train mechanism)",
            "values": ["-", "-", "-", "-", "S", "-"]
          }, {"name": "Low Emissions Vehicle (LEV3)", "values": ["-", "-", "-", "-", "S", "-"]}, {
            "name": "Sport Mode",
            "values": ["-", "-", "-", "-", "-", "S"]
          }]
        }, {
          "name": "Mechanical Features",
          "items": [{
            "name": "Front Wheel Drive",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Hill-start Assist Control (HAC)", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Steering",
          "items": [{"name": "Electric Power Steering", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Suspension",
          "items": [{
            "name": "Macpherson Struts - Front",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Stabilizer Bar - Front",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {
            "name": "Torsion Beam Type - Rear",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Stabilizer Bar - Rear", "values": ["S", "S", "S", "S", "S", "S"]}]
        }, {
          "name": "Tires",
          "items": [{"name": "P195/65R15 Tires", "values": ["S", "S", "-", "-", "S", "-"]}, {
            "name": "T135/80D16",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "P205/55R16 Tires", "values": ["-", "-", "S", "S", "-", "S"]}]
        }, {
          "name": "Brakes",
          "items": [{
            "name": "Front Ventilated Disc Brakes",
            "values": ["S", "S", "S", "S", "S", "S"]
          }, {"name": "Rear Drums", "values": ["S", "S", "S", "S", "S", "S"]}]
        }]
      }, {
        "id": "Optional Features",
        "id_en": "Optional Features",
        "groups": [{
          "name": "Optional Features",
          "items": [{
            "name": "Rear Discs",
            "values": ["-", "-", "O:Upgrade Package", "-", "-", "O:Upgrade Package,XSE Package"]
          }, {
            "name": "Power slide / tilt Moonroof",
            "values": ["-", "-", "O:Upgrade Package", "O:Upgrade Package,XLE Package", "-", "O:Upgrade Package,XSE Package"]
          }, {
            "name": "Heated Steering Wheel",
            "values": ["-", "-", "O:Upgrade Package", "O:Upgrade Package,XLE Package", "-", "O:Upgrade Package,XSE Package"]
          }, {
            "name": "P215/45R17 Tires",
            "values": ["-", "-", "O:Upgrade Package", "-", "-", "O:Upgrade Package,XSE Package"]
          }, {
            "name": "17\" Aluminum Alloy Wheels",
            "values": ["-", "-", "O:Upgrade Package", "-", "-", "O:Upgrade Package,XSE Package"]
          }, {
            "name": "Wheel Locks",
            "values": ["-", "-", "O:Upgrade Package", "O:Upgrade Package", "-", "O:Upgrade Package,XSE Package"]
          }, {
            "name": "16\" Aluminum Alloy Wheels",
            "values": ["-", "-", "-", "O:Upgrade Package,XLE Package", "-", "-"]
          }, {
            "name": "Integrated SiriusXM Satellite Radio",
            "values": ["-", "-", "-", "O:XLE Package", "-", "O:XSE Package"]
          }, {
            "name": "Navigation System",
            "values": ["-", "-", "-", "O:XLE Package", "-", "-"]
          }, {
            "name": "Push Button Start",
            "values": ["-", "-", "-", "O:XLE Package", "-", "O:XSE Package"]
          }, {
            "name": "Smart Key System",
            "values": ["-", "-", "-", "O:XLE Package", "-", "O:XSE Package"]
          }, {
            "name": "Auto-Dimming Rear View Mirror with HomeLink & Compass",
            "values": ["-", "-", "-", "O:XLE Package", "-", "O:XSE Package"]
          }, {
            "name": "XLE Badging",
            "values": ["-", "-", "-", "O:XLE Package", "-", "-"]
          }, {
            "name": "SofTex Leather Seating Surfaces",
            "values": ["-", "-", "-", "O:XLE Package", "-", "O:XSE Package"]
          }, {
            "name": "Driver Seat Fore/Aft (Power)",
            "values": ["-", "-", "-", "O:XLE Package", "-", "-"]
          }, {
            "name": "Driver Lumbar Support (Power)",
            "values": ["-", "-", "-", "O:XLE Package", "-", "-"]
          }, {
            "name": "Recline (Power)",
            "values": ["-", "-", "-", "O:XLE Package", "-", "-"]
          }, {
            "name": "Vertical (Power)",
            "values": ["-", "-", "-", "O:XLE Package", "-", "-"]
          }, {
            "name": "8-way Power Adjustable Drivers Seat",
            "values": ["-", "-", "-", "O:XLE Package", "-", "O:XSE Package"]
          }, {
            "name": "7-inch Display Screen",
            "values": ["-", "-", "-", "-", "-", "O:XSE Package"]
          }, {
            "name": "Navigation",
            "values": ["-", "-", "-", "-", "-", "O:XSE Package"]
          }, {"name": "\"XSE\" Rear Badge", "values": ["-", "-", "-", "-", "-", "O:XSE Package"]}]
        }]
      }, {
        "id": "Dimension",
        "id_en": "Dimension",
        "groups": [{
          "name": "Dimensions",
          "items": [{
            "name": "Height mm (in.)",
            "values": ["1,455 (57.3)", "1,455 (57.3)", "1,455 (57.3)", "1,455 (57.3)", "1,455 (57.3)", "1,455 (57.3)"]
          }, {
            "name": "Width mm (in.)",
            "values": ["1,776 (69.9)", "1,776 (69.9)", "1,776 (69.9)", "1,776 (69.9)", "1,776 (69.9)", "1,776 (69.9)"]
          }, {
            "name": "Length mm (in.)",
            "values": ["4,650 (183.1)", "4,650 (183.1)", "4,650 (183.1)", "4,650 (183.1)", "4,650 (183.1)", "4,650 (183.1)"]
          }, {
            "name": "Wheelbase mm (in.)",
            "values": ["2,700 (106.3)", "2,700 (106.3)", "2,700 (106.3)", "2,700 (106.3)", "2,700 (106.3)", "2,700 (106.3)"]
          }, {
            "name": "Front Track mm (in.)",
            "values": ["1,531 (60.3)", "1,531 (60.3)", "1,519 (59.8)", "1,519 (59.8)", "1,531 (60.3)", "1,519 (59.8)"]
          }, {
            "name": "Rear Track mm (in.)",
            "values": ["1,534 (60.4)", "1,534 (60.4)", "1,522 (59.9)", "1,522 (59.9)", "1,534 (60.4)", "1,522 (59.9)"]
          }, {
            "name": "Front Headroom mm (in.)",
            "values": ["973.9 (38.3)", "973.9 (38.3)", "973.9 (38.3)", "973.9 (38.3)", "973.9 (38.3)", "973.9 (38.3)"]
          }, {
            "name": "Rear Headroom mm (in.)",
            "values": ["941.6 (37.1)", "941.6 (37.1)", "941.6 (37.1)", "941.6 (37.1)", "941.6 (37.1)", "941.6 (37.1)"]
          }, {
            "name": "Front Legroom mm (in.)",
            "values": ["1,075.4 (42.3)", "1,075.4 (42.3)", "1,075.4 (42.3)", "1,075.4 (42.3)", "1,075.4 (42.3)", "1,075.4 (42.3)"]
          }, {
            "name": "Rear Legroom mm (in.)",
            "values": ["1,051.2 (41.4)", "1,051.2 (41.4)", "1,051.2 (41.4)", "1,051.2 (41.4)", "1,051.2 (41.4)", "1,051.2 (41.4)"]
          }, {
            "name": "Front Shoulder Room mm (in.)",
            "values": ["1,392.4 (54.8)", "1,392.4 (54.8)", "1,392.4 (54.8)", "1,392.4 (54.8)", "1,392.4 (54.8)", "1,392.4 (54.8)"]
          }, {
            "name": "Rear Shoulder Room mm (in.)",
            "values": ["1,391.1 (54.8)", "1,391.1 (54.8)", "1,391.1 (54.8)", "1,391.1 (54.8)", "1,391.1 (54.8)", "1,391.1 (54.8)"]
          }, {
            "name": "Seating Capacity",
            "values": ["5", "5", "5", "5", "5", "5"]
          }, {
            "name": "Base Curb Weight kg (lbs.)",
            "values": ["1,285 (2,830)", "1,285 (2,830)", "1,305 (2,875)", "1,300 (2,865)", "1,295 (2,855)", "1,305 (2,875)"]
          }, {
            "name": "Gross Vehicle Weight kg (lbs.)",
            "values": ["1735 (3,820)", "1735 (3,820)", "1735 (3,820)", "1735 (3,820)", "1735 (3,820)", "1735 (3,820)"]
          }, {
            "name": "Fuel Capacity litres (gal.)",
            "values": ["50 (13.2)", "50 (13.2)", "50 (13.2)", "50 (13.2)", "50 (13.2)", "50 (13.2)"]
          }, {
            "name": "Compression Ratio",
            "values": ["10.0:1", "10.0:1", "10.0:1", "10.0:1", "10.6:1", "10.0:1"]
          }, {
            "name": "Horsepower (kW)",
            "values": ["132 (99) @ 6,000 Rpm", "132 (99) @ 6,000 Rpm", "132 (99) @ 6,000 Rpm", "132 (99) @ 6,000 Rpm", "140 (104) @ 6,100 Rpm", "132 (99) @ 6,000 Rpm"]
          }, {
            "name": "Torque (N.m)",
            "values": ["128 (174) @ 4,000 Rpm", "128 (174) @ 4,000 Rpm", "128 (174) @ 4,000 Rpm", "128 (174) @ 4,000 Rpm", "126 (171) @ 4,400 Rpm", "128 (174) @ 4,000 Rpm"]
          }, {
            "name": "Turning Circle m. (ft.)",
            "values": ["10.8 (35.4)", "10.8 (35.4)", "10.8 (35.4)", "10.8 (35.4)", "10.8 (35.4)", "10.8 (35.4)"]
          }, {
            "name": "Ground Clearance mm (in.)",
            "values": ["169 (6.6)", "169 (6.6)", "169 (6.6)", "169 (6.6)", "169 (6.6)", "169 (6.6)"]
          }, {
            "name": "Cargo Capacity L (cu. Ft.)",
            "values": ["369 (13.031)", "369 (13.031)", "369 (13.031)", "369 (13.031)", "369 (13.031)", "369 (13.031)"]
          }, {
            "name": "Fuel Consumption - City/Highway/Combined L/100km",
            "values": ["8.4/6.5/7.5", "8.3/6.5/7.5", "8.4/6.5/7.5", "8.3/6.5/7.5", "7.8/5.9/6.9", "8.3/6.7/7.5"]
          }, {
            "name": "Fuel Consumption - City/Highway/Combined mpg",
            "values": ["34/43/38", "34/43/38", "34/43/38", "34/43/38", "36/48/41", "34/42/38"]
          }, {
            "name": "Front Headroom with available Moonroof mm (in.)",
            "values": ["-", "-", "964.2 (38.0)", "964.2 (38.0)", "-", "964.2 (38.0)"]
          }]
        }]
      }]
    };
  }

  public showChatArea() {
    this.chatAreaVisible = true;
  }

  public messageClicked(message) {
    if (message.message.toLowerCase().indexOf("toyota.com") != -1 || message.message.toLowerCase().indexOf("toyota.ca") != -1) {
      setTimeout(() =>
      {
        if (this.mode == 'facebook')
        {
          this.mode = 'dealership';
          this.messages = [this.messages[this.messages.length - 1]];
        }
      }, 500);
    }
  }


  public addMessage(message) {
    this.messages.push(message);
  }

  public submitText() {
    const message = this.inputMessage;

    this.addMessage({
      person: 'human',
      message: message
    });

    const standardFeatures = "";

    const startTime = new Date();

    this.chatClient.textRequest(message)
      .then((response) => {
        let responseMessage = response.result.fulfillment.speech;
        // console.log(response);

        if (response.result.metadata.intentName == 'Ask about feature')
        {
          const feature = response.result.parameters.feature;

          const trims = [];

          this.specsData.categories.forEach((category) =>
          {
            category.groups.forEach((group) =>
            {
              group.items.forEach((item) =>
              {
                const name = item.name.toLowerCase().replace(/\(.*\)/g, "");

                if (name == feature)
                {
                  item.values.forEach((value, index) =>
                  {
                    if(value === 'S')
                    {
                      trims.push(this.specsData.models[index].name.en.replace("COROLLA ", ""))
                    }
                  });
                }
              })
            })
          });


          const capitalizedFeature = feature[0].toUpperCase() + feature.substring(1);

          if(trims.length == 0)
          {
            responseMessage = capitalizedFeature + " must be purchased extra.";
          }
          else if(trims.length == 1)
          {
            responseMessage = capitalizedFeature + " is only standard on the " + trims[0] + ".";
          }
          else if(trims.length == 2)
          {
            responseMessage = capitalizedFeature + " is standard on the " + trims.join(" and the ") + ".";
          }
          else
          {
            const trimsExceptLast = trims.slice(0, trims.length - 1);
            const lastTrim = trims[trims.length - 1];


            responseMessage = capitalizedFeature + " is standard on the " + trimsExceptLast.join(", the ") + " and the " + lastTrim + ".";
          }
        }


        const delay = Math.max(0, (this.minimumResponseDelay - (Date.now() - startTime.getTime())));
        console.log(delay);
        setTimeout(() => {
          this.addMessage({
            "person": 'bot',
            "message": responseMessage
          });
        }, delay);
      })
      .catch((error) => {/* do something here too */
      });

    this.inputMessage = "";
  }

  public microphoneClicked(event) {
    if (this.listening) {
      this.recognizer.AudioSource.TurnOff();
    }
    else {
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

  public onEnter() {
    this.submitText();
  }

  ngAfterViewChecked() {
    var conversationBody = document.querySelector('#mainConversationBody');
    conversationBody.scrollTop = conversationBody.scrollHeight - conversationBody.clientHeight;
  }
}
