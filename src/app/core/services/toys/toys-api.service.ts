import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Toy } from '../../components/interfaces/toy.interface';

import * as Realm from 'realm-web';

const amountToAdd = 5;

let indexStartList = 0;
let indexEndList = 5;
let indexCurrentListItem = 0;

let user: any;

@Injectable({
  providedIn: 'root'
})

export class ToysApiService {

  constructor(
    private http: HttpClient
  ) { }

  initialiseMongoConnection() {
    const app = new Realm.App({ id: "christmas-ndazv" });
    // Create an anonymous credential
    const credentials = Realm.Credentials.anonymous();

    // Authenticate the user
    return app.logIn(credentials);
  }

  async getAllToys() {
    if (!user)
        user = await this.initialiseMongoConnection();
    return await user.functions.GetToys();
  }

  async getToyFromAtlas(id: number) {
    if (!user)
        user = await this.initialiseMongoConnection();
    return await user.functions.GetToy(id);
  }

  async deleteToyFromAtlas(id: number) {
    if (!user)
        user = await this.initialiseMongoConnection();
    return await user.functions.DeleteToy(id);
  }

  async editToyFromAtlas(id: number, toy: Toy) {
    if (!user)
        user = await this.initialiseMongoConnection();
    return await user.functions.EditToy(id, toy);
  }

  async addToyToAtlas(toy: Toy) {
    if (!user)
        user = await this.initialiseMongoConnection();
    return await user.functions.AddToy(toy);
  }

  // * convert Promise to Observable
  getToysFromAtlas(): Observable<Toy[]> {
    return from(this.getAllToys());
  }

  addToy(toy: Toy): Observable<Toy[]> {
    return from(this.addToyToAtlas(toy));
  }

  // loadToys(): void {
  //   indexCurrentListItem = indexEndList;
  //   indexEndList = indexEndList + amountToAdd;
  //   this.getToys();
  // }

  loadToys(): void {
    indexCurrentListItem = indexEndList;
    indexEndList = indexEndList + amountToAdd;
    this.getToysFromAtlas();
  }

  getToy(id: number): Observable<Toy> {
    return from(this.getToyFromAtlas(id));
  }

  editToy(id: number, toy: Toy): Observable<Toy> {
    return from(this.editToyFromAtlas(id, toy));
  }

  deleteToy(id: number): Observable<Toy> {
    return from(this.deleteToyFromAtlas(id));
  }
}
