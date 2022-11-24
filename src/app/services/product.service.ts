import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  // for size other than default: ?size=100
  private baseUrl = "http://localhost:8080/api/products";

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    // DONE: need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  }
}
