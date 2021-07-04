import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-search-input',
  templateUrl: './location-search-input.component.html',
  styleUrls: ['./location-search-input.component.scss']
})
export class LocationSearchInputComponent implements OnInit {

  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  inputFocused() {
    this.onFocus.emit();
  }

  inputBlurred() {
    this.onBlur.emit();
  }

}
