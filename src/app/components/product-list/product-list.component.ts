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
  searchMode: boolean = false;

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

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
