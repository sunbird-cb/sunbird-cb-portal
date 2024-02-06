import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadCheckService {
  private loadedSubject$ = new Subject<boolean>();
  childComponentLoaded$ = this.loadedSubject$.asObservable();

  componentLoaded(isLoaded: boolean) {
    this.loadedSubject$.next(isLoaded);
  }
}