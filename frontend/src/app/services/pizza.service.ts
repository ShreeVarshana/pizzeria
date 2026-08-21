import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pizza } from '../models/pizza';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private baseUrl = `${environment.apiUrl}/pizzas`;

  constructor(private http: HttpClient) {}

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.baseUrl);
  }

  getPizza(id: string): Observable<Pizza> {
    return this.http.get<Pizza>(`${this.baseUrl}/${id}`);
  }
}
