import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_POINTS = {
    COMPETENCY_LIST: `apis/proxies/v8/competency/v4/search`
}

@Injectable({providedIn: 'root'})

export class CompetencyPassbookService {
    constructor(private http: HttpClient) { }
    
    getCompetencyList(payload: any): Observable<any> {
        return this.http.post(API_POINTS.COMPETENCY_LIST, payload);
    }
}