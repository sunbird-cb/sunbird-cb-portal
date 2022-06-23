import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable()

export class PublicHomeService {
    constructor(private http: HttpClient) { }

    fetchConfig(url: string) {
        return this.http.get<any>(url)
    }
}
