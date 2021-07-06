import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrls: ['./location-item.component.scss']
})
export class LocationItemComponent implements OnInit {

  @Input() name: string = '';
  @Input() country: string = '';
  @Input() subcountry?: string;

  @Input() searchInput?: string;

  constructor() { }

  ngOnInit(): void {
  }

  emboldenResult(target: string) {
    let result = target;
    if (this.searchInput) {
      const replace = this.searchInput;
      const regex = new RegExp(replace,"ig");
      result = target.replace(regex, (match) => `<b>${match}</b>`);
    }

    return result;
  }

}
