import { Component, Output, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-location-search-input',
  templateUrl: './location-search-input.component.html',
  styleUrls: ['./location-search-input.component.scss']
})
export class LocationSearchInputComponent implements OnInit, AfterViewInit {

  searchInput: string = '';

  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  searchInputChanged: Subject<string> = new Subject<string>();


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.searchInputChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      (value) => {
        this.search(value)
      } 
    )
  }

  changed(searchInput: string) {
    this.searchInputChanged.next(searchInput);
  }
  
  search(searchInput: string) {
    this.onSearch.emit({
      searchInput
    });
  }

}
