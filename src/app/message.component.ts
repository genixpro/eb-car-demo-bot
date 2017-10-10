import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({opacity: 1.0})),
      transition('void => *', [
        style({opacity: 0.0}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({opacity: 1.0}))
      ])
    ])
  ]
})
export class MessageComponent
{
  @Input() person: String;
  @Input() text: String;
}


