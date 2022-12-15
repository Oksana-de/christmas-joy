import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Toy } from '../../components/interfaces/toy.interface';

const BASE_URL = 'http://localhost:3000';
const amountToAdd = 5;

let indexStartList = 0;
let indexEndList = 5;
let indexCurrentListItem = 0;


@Injectable({
  providedIn: 'root'
})

export class ToysApiService {

  constructor(private http: HttpClient) { }

  getToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(`${BASE_URL}/toys?_start=${indexStartList}&_end=${indexEndList}`);
  }

  addToy(toy: Toy): Observable<Toy[]> {
    return this.http.post<Toy[]>(`${BASE_URL}/toys`, toy);
  }

  loadToys(): void {
    indexCurrentListItem = indexEndList;
    indexEndList = indexEndList + amountToAdd;
    this.getToys();
  }

  getToy(id: number): Observable<Toy> {
    return this.http.get<Toy>(`${BASE_URL}/toys/${id}`);
  }

  editToy(id: number, toy: Toy): Observable<Toy> {
    return this.http.put<Toy>(`${BASE_URL}/toys/${id}`, toy)
  }

  deleteToy(id: number): Observable<Toy> {
    return this.http.delete<Toy>(`${BASE_URL}/toys/${id}`);
  }
}
