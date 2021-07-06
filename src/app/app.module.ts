import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { LocationSelectorComponent } from './location-selector/location-selector.component';
import { LocationItemListComponent } from './location-item-list/location-item-list.component';
import { LocationItemComponent } from './location-item/location-item.component';
import { LocationSearchInputComponent } from './location-search-input/location-search-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LocationSelectorComponent,
    LocationItemListComponent,
    LocationItemComponent,
    LocationSearchInputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
