import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.pingServer();
    setInterval(() => this.pingServer(), 10 * 60 * 1000);
  }

  pingServer(): void {
    this.http.get(`${environment.apiUrl}/health`, { headers: {} }).subscribe({ error: () => {} });
  }
}
