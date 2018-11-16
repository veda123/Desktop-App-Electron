import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadFileService {
  constructor(private http: HttpClient) { }

  public uploadFile(file:string, username: string, password: string,artifact:string,version:string,binaryFile:File):Observable<HttpEvent<any>>{
    let headers = new HttpHeaders();
    headers=headers.append("Authorization", "Basic " + btoa(`${username}:${password}`));
    const req = new HttpRequest('PUT', 'http://use08nexus01p:8081/nexus/content/repositories/test/Veda/Test123/'+artifact+'/'+version+'/'+file,binaryFile,{headers:headers,reportProgress: true,responseType:'text'});
    return this.http.request((req));   
  }
}
