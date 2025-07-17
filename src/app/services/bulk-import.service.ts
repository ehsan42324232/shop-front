import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BulkImportLog } from '../models/bulk-import-log.model';

@Injectable({
  providedIn: 'root'
})
export class BulkImportService {
  private apiUrl = `${environment.apiUrl}/import-logs`;

  constructor(private http: HttpClient) {}

  getImportLogs(): Observable<BulkImportLog[]> {
    return this.http.get<BulkImportLog[]>(this.apiUrl);
  }

  getImportLog(id: string): Observable<BulkImportLog> {
    return this.http.get<BulkImportLog>(`${this.apiUrl}/${id}`);
  }
}
