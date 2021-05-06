import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RansomwareService {
  public hostServer = environment.hostServer
  private readonly host = this.hostServer + '/rest/ransomware'

  constructor(private readonly http: HttpClient) { }

  decrypt(decryptionCode: string) {
    return this.http.post(this.host + '/decrypt', { decryptionCode: decryptionCode }).pipe(catchError((err) => { throw err }))
  }
}
