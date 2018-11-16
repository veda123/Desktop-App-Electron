import { Component, OnInit, ElementRef, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { trigger, transition, useAnimation } from '@angular/animations';
// import { fadeIn,slideInLeft, jackInTheBox,fadeInLeft} from 'ng-animate';
import { UploadFileService } from './upload-file/upload-file.service';
import { ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // animations: [
  //   trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
  //   trigger('fadeInLeft', [transition('* => *', useAnimation(fadeInLeft))]),
  //   trigger('slideInLeft', [transition('* => *', useAnimation(slideInLeft))]),
  //   trigger('jackInTheBox', [transition('* => *', useAnimation(jackInTheBox))])
  // ],
})

export class AppComponent implements OnInit {
  title:string="Artifact Upload";
  fadeIn: any;
  fadeInLeft : any;
  slideInLeft : any;
  jackInTheBox:any;
  versionPattern:string = "[1-9]{1}[0-9]{0,1}[.][0-9]{1,2}[.][0-9]{1,2}[.][0-9]+";
  artifactPattern:string = "[a-zA-Z]+[a-zA-Z0-9\\-]*";
  partNumberPattern:string="[0-9]+"
  equipType:any;
  selectedFile:string
  url;
  binaryFile;
  username:string="****";
  password:string="****"
  model: any = {};
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  success:boolean= false;
  invalid:boolean=false;
  progress = { loaded : 0 , total : 0 };
  modalRef: BsModalRef;

  nexusForm  = new FormGroup({
    unit        : new FormControl('',[Validators.required,Validators.pattern(this.artifactPattern)]),
    bench       : new FormControl('',[Validators.required,Validators.pattern(this.artifactPattern)]),
    type        : new FormControl('',Validators.required),
    version     : new FormControl('',[Validators.required,Validators.pattern(this.versionPattern)]),
    partNumber  : new FormControl('',[Validators.required,Validators.pattern(this.partNumberPattern)]),
    tpsFileDetails    : new FormControl('',Validators.required)
  });
  errors: any;

  constructor(private http: HttpClient, private uploadService:UploadFileService, private modalService: BsModalService){
  }

  process(equipment,template: TemplateRef<any>){
    console.log("console");
    let artifact = (equipment.unit+"_"+equipment.bench+"_"+equipment.type).toUpperCase();
    // artifact = artifact.toUpperCase();
    let tpsFile = "ED"+equipment.partNumber+"_"+equipment.version+".zip";
    this.modalRef = this.modalService.show(template);
    this.uploadService.uploadFile(tpsFile,this.username,this.password,artifact,equipment.version,this.binaryFile)
        .subscribe((event: HttpEvent<any>)=>{
          // console.log("fileUpload",fileUpload);
         this.success = false;
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request sent!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header received!');
              break;
            case HttpEventType.UploadProgress:
            console.log("upload",this.success);
               this.progress.loaded = Math.round(100* event.loaded / event.total);
               this.progress.total = event.total;
              console.log(`Upload in progress! ${ this.progress.loaded }Kb loaded`);
              break;
            case HttpEventType.Response:
              console.log('😺 Done!', event.body);
              this.reset();
              this.success= true; 
              this.modalRef.hide();         
          }
        },error => {
          this.errors = error;
          this.invalid = true;
          console.log("error",error)});
  }

  onFileSelected(event){
    this.nexusForm.get('tpsFileDetails').reset();
    this.selectedFile=event.target.files[0].name;
    this.binaryFile = event.target.files[0];
    if(this.selectedFile){
      this.nexusForm.get('tpsFileDetails').setValue("uploaded");
    }
  }

  reset():void{
    this.nexusForm.reset();
    this.myInputVariable.nativeElement.value="";
    this.nexusForm.get('type').setValue("");
    this.success= false;
  }

  get unit()
  {
    return this.nexusForm.get('unit');
  }

  get bench()
  {
    return this.nexusForm.get('bench');
  }
  get type()
  {
    return this.nexusForm.get('type');
  }
  get version()
  {
    return this.nexusForm.get('version');
  }
  get partNumber()
  {
    return this.nexusForm.get('partNumber');
  }
  get tpsFileDetails()
  {
    return this.nexusForm.get('tpsFileDetails');
  }

  ngOnInit(){
    let apiUrl ="./assets/data/values.json";
    this.http.get(apiUrl).subscribe(data=>{ 
      this.equipType = data;
      console.log("data",this.equipType);
    })

  }

}
