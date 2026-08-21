import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private baseUrl = `${environment.apiUrl}/ingredients`;

  constructor(private http: HttpClient) {}

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.baseUrl);
  }
}
