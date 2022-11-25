import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from 'rxjs/operators'
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  // for size other than default: ?size=100
  private productUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    // DONE: need to build URL based on category id
    const endpoint = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(endpoint);
  }

  searchProducts(keyword: string): Observable<Product[]> {

    // DONE: need to build URL based search keyword
    const endpoint = `${this.productUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(endpoint);
  }

  private getProducts(endpoint: string) {
    return this.httpClient.get<GetResponseProducts>(endpoint).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
