import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from 'rxjs/operators'
import {ProductCategory} from "../common/product-category";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  // for size other than default: ?size=100
  private productUrl = environment.backendUrl + "/products";
  private categoryUrl = environment.backendUrl + "/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    // Build url with category id
    const url = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(url);
  }

  getProductListPaginate(pageNum: number, pageSize: number, categoryId: number): Observable<GetResponseProducts>{
    // Build url with category id, pageNum & size
    const url = `${this.productUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNum}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  searchProducts(keyword: string): Observable<Product[]> {

    // DONE: need to build URL based search keyword
    const url = `${this.productUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(url);
  }

  searchProductsPaginate(keyword: string, pageNum: number, pageSize: number): Observable<GetResponseProducts> {
    // Build url with keyword, pageNum & size
    const url = `${this.productUrl}/search/findByNameContaining?name=${keyword}&page=${pageNum}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  private getProducts(endpoint: string) {
    return this.httpClient.get<GetResponseProducts>(endpoint).pipe(
      map(response => response._embedded.products)
    )
  }

  // observable: JSON data can be converted directly to Product object
  getProduct(productId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrlId = `${this.productUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrlId);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
