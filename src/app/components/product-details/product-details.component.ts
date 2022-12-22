import { Component } from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  product!: Product;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
    // const productId: number = +this.
  }

  private handleProductDetails() {

    // get teh "id" param string. convert string to a number using the "+" symbol
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart(product: Product) {
    console.log(`Adding to cart from detail view: ${product.name}, ${product.unitPrice}`)

    const newCartItem = new CartItem(product);
    this.cartService.addToCart(newCartItem);
  }
}
