import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchMode: boolean = false;

  // pagination, pageNum start from 1!
  pageNum: number = 1;
  pageSize: number = 10;  // match the default value in templates
  totalElements: number = 0;
  // no totalPages here (from Spring Data REST
  maxPageSelect = 6;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword')

    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts()
    }
  }

  handleSearchProducts() {
    const keyword: string = this.activatedRoute.snapshot.paramMap.get('keyword')!;

    // new search for the products using keyword
    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {
    // check if `id` parameter is available
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id')

    if (hasCategoryId) {
      // get `id` param string, convert string to a number using the `+`
      // note the ending `!`: non-null assertion operator
      this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    } else {
      // no category id, default to 1
      this.currentCategoryId = 1;
    }

    // NOTE: Angular will reuse a component if it's currently being viewed
    // Need to check if we have a different category id than previous, if so
    // set the pageNum back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNum = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNum=${this.pageNum}`);

    this.productService.getProductListPaginate(this.pageNum - 1, this.pageSize, this.currentCategoryId).subscribe(
        data => {
          this.products = data._embedded.products;

          this.pageSize = data.page.size;
          this.totalElements = data.page.totalElements;
          this.pageNum = data.page.number + 1;
        }
    )
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNum = 1;
    // reload list
    this.listProducts();
  }

}
