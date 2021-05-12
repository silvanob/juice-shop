import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { RansomwareService } from './ransomware.service';

describe('RansomwareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RansomwareService]
    })
  });

  it('should be created', inject([RansomwareService], (service: RansomwareService) => {
    expect(service).toBeTruthy();
  }));

  it('should send the decryption key and return', inject([RansomwareService, HttpTestingController],
    fakeAsync((service: RansomwareService, httpMock: HttpTestingController) => {
    let res: any
    service.decrypt(null).subscribe((data) => (res = data))

    const req = httpMock.expectOne('http://localhost:3000/rest/ransomware/decrypt')
    req.flush({ data: 'hello' })
    tick()

    expect(req.request.method).toBe('POST')
    expect(res).toEqual({ data: 'hello' })
    httpMock.verify()
  })
  ));
});
