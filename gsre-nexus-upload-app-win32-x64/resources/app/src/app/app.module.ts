import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- here
import { RoundProgressModule } from 'angular-svg-round-progressbar'; // <-- here
import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UploadFileService } from './upload-file/upload-file.service';
import { BsModalService, ModalBackdropComponent, ModalContainerComponent } from 'ngx-bootstrap/modal';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader/component-loader.factory';
import { PositioningService } from 'ngx-bootstrap/positioning/positioning.service';

@NgModule({
  declarations: [
    AppComponent,
    // ModalBackdropComponent,
    // ModalContainerComponent
  ],
  entryComponents: [ ModalBackdropComponent,ModalContainerComponent],
  imports: [
    BrowserModule, 
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,// <-- here
    RoundProgressModule
    // BrowserAnimationsModule // <-- and here
  ],
  providers: [UploadFileService,BsModalService,ComponentLoaderFactory,PositioningService],
  bootstrap: [AppComponent]
})
export class AppModule { }
