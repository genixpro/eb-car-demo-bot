import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MessageComponent } from './message.component';
import { FormsModule }   from '@angular/forms';

import * as speechSDK from 'microsoft-speech-browser-sdk/Speech.Browser.Sdk';



@NgModule({
  declarations: [
    AppComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
