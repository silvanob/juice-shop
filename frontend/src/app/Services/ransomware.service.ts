import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RansomwareService {
  public hostServer = environment.hostServer
  private readonly host = this.hostServer + '/rest/ransomware'

  constructor (private readonly http: HttpClient) { }

  decrypt (decryptionCode: string) {
    return this.http.post(this.host + '/decrypt', { decryptionCode: decryptionCode }).pipe(map((success: any) => success), catchError((err) => { throw err }))
  }

  encrypt () {
    return this.http.post(this.host + '/encrypt', {}).pipe(catchError((err) => { throw err }))
  }

  get started () {
    return this.http.get(this.host + '/started').pipe(catchError((err) => { throw err }))
  }
}
