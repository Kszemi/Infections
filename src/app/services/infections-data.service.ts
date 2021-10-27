import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Papa} from "ngx-papaparse";

import  * as iconv from "iconv-lite"
import {Buffer} from "buffer";

@Injectable({
  providedIn: 'root',
})
export class InfectionsDataService {
  constructor(private httpClient: HttpClient,
              private csvParser: Papa) {}

  fetchOutput(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':  'text/csv; charset=utf-8',
    })

    const options: {
      Accept: 'application/text';
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: 'arraybuffer';
      withCredentials?: boolean;
    } = {
      Accept: 'application/text',
      responseType: 'arraybuffer',
      headers: headers,
    };

    return this.httpClient
      .get('https://www.arcgis.com/sharing/rest/content/items/153a138859bb4c418156642b5b74925b/data', options)
      .pipe(
        map(
          response => {
            console.log("exists: " + iconv.encodingExists("ISO-8859-2"))
            console.log("response: ", response)
            // let decodedResponse = iconv.decode(this.toBuffer(response), "ISO-8859-2")
            let buffer = Buffer.from( new Uint8Array(response) );
            let decodedResponse = iconv.decode(this.toBuffer(buffer), "ISO-8859-2");

            console.log(this.csvParser.parse(decodedResponse));
            return this.csvParser.parse(decodedResponse);
            // return response
          }),
      );

  }
  toBuffer(arrayBuffer: ArrayBuffer) {
    let buf = Buffer.alloc(arrayBuffer.byteLength);
    let view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
