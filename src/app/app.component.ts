import { Component, OnInit, ElementRef, TemplateRef } from '@angular/core';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadFileService } from './upload-file/upload-file.service';
import { ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title:string="Artifact Upload To Nexus";
  versionPattern:string = "[1-9]{1}[0-9]{0,1}[.][0-9]{1,2}[.][0-9]{1,2}[.][0-9A-Za-z]+";
  artifactPattern:string = "[a-zA-Z]+[a-zA-Z0-9\\-]*";
  partNumberPattern:string="[A-Za-z]*[0-9]+";
  equipType:any;
  loginCredentials:any;
  selectedFile:string
  url;
  binaryFile;
  username:string;
  password:string;
  model: any = {};
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  success:boolean= false;
  invalid:boolean=false;
  progress = { loaded : 0 , total : 0 };
  modalRef: BsModalRef;
  invalidFile:boolean = false;
  modalHeader:string = "Upload Status";
  modalBodyMessage:string = "Uploaded Successfully to Nexus!!!"

  nexusForm  = new FormGroup({
    unit              : new FormControl('',[Validators.required,Validators.pattern(this.artifactPattern)]),
    bench             : new FormControl('',[Validators.required,Validators.pattern(this.artifactPattern)]),
    type              : new FormControl('',Validators.required),
    version           : new FormControl('',[Validators.required,Validators.pattern(this.versionPattern)]),
    partNumber        : new FormControl('',[Validators.required,Validators.pattern(this.partNumberPattern)]),
    tpsFileDetails    : new FormControl('',Validators.required)
  });
  errors: any;

  constructor(private http: HttpClient, private uploadService:UploadFileService, private modalService: BsModalService){
  }

  process(equipment,template: TemplateRef<any>){
    this.invalidFile = false;
    let fileExt = this.selectedFile.substr(this.selectedFile.lastIndexOf("."));
    //allow only zip files to be uploaded
    if(fileExt != ".zip"){
      this.invalidFile = true;
    }
    else{
      let artifact = (equipment.unit+"_"+equipment.bench+"_"+equipment.type).toUpperCase();  // artifact :(unit_bench_softwareType)
      let tpsFile = (equipment.partNumber).toUpperCase()+"_"+equipment.version+".zip";  // file name : partnumber_version
      this.modalRef = this.modalService.show(template,{backdrop: 'static', keyboard: false}); //opens the modal,  background not clickable 
      //invokes the service call to upload the file 
      this.uploadService.uploadFile(tpsFile,this.username,this.password,artifact,equipment.version,this.binaryFile)
        .subscribe((event: HttpEvent<any>)=>{
         this.success = false;
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request sent!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header received!');
              break;
            case HttpEventType.UploadProgress:
              this.progress.loaded = Math.round(100*event.loaded / event.total);
              console.log(`Upload in progress! ${ this.progress.loaded }Kb loaded`);
              break;
            case HttpEventType.Response:
              console.log('😺 Done!', event.body);
              this.success= true;     
           }
        },error => {
          this.errors = error;
          this.invalid = true});
    }
  }

  onFileSelected(event){
    this.nexusForm.get('tpsFileDetails').reset();
    this.selectedFile=event.target.files[0].name;
    this.binaryFile = event.target.files[0];
    if(this.selectedFile){
      this.nexusForm.get('tpsFileDetails').setValue("uploaded");
    }
  }

  //initalises all the fields 
  reset():void{
    this.nexusForm.reset();
    this.myInputVariable.nativeElement.value="";
    this.nexusForm.get('type').setValue("");
    this.success= false;
    this.invalid = false;
    this.invalidFile = false;
  }

  closeModal():void{
    this.modalRef.hide(); //closes the modal
    this.reset();
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
    //loads config files which has credentials and software types values
    let apiUrl ="./assets/data/Software-Types.json";
    let credentials = "./assets/data/credentials.json";

    //reads software-type values from json file and stores into a local object
    this.http.get(apiUrl).subscribe(data=>{ 
      this.equipType = data;
    });

    //reads login credentials from json file ans stores into a local object
    this.http.get(credentials).subscribe(data=>{ 
      this.loginCredentials = data;
      this.username = this.loginCredentials[0].username;
      this.password = this.loginCredentials[0].password;
    });

  }
}
