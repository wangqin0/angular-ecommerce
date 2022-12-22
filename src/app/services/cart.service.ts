import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}
  addToCart(newItem: CartItem) {
    // // check if already in cart
    // let itemExist: boolean = false;
    //
    // // find the item in the cart by item id
    // for (let cartItem of this.cartItems) {
    //   if (cartItem.product.id === newItem.product.id) {
    //     cartItem.quantity++;
    //     itemExist = true;
    //     break;
    //   }
    // }
    //
    // // check if we found the item
    // if (!itemExist) {
    //   this.cartItems.push(newItem);
    // }
    //
    // this.computeCartTotal();

    // refactored
    const existingCartItem = this.cartItems.find( cartItem => cartItem.product.id === newItem.product.id );
    if (existingCartItem == undefined) {
      this.cartItems.push(newItem);
    } else {
      existingCartItem.quantity++;
    }
    this.computeCartTotal();
  }

  computeCartTotal() {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for (let cartItem of this.cartItems) {
      totalPrice += cartItem.product.unitPrice * cartItem.quantity;
      totalQuantity += cartItem.quantity;
    }

    // publish the new values
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

    this.logCartData(totalPrice, totalQuantity);
  }

  logCartData(totalPrice: number, totalQuantity: number) {
    console.log(`[logCartData] totalPrice=${totalPrice.toFixed(2)}, totalQuantity=${totalQuantity}, by product:`);

    for (let cartItem of this.cartItems) {
      console.log(`[logCartData]   name=${cartItem.product.name}, unitPrice=${cartItem.product.unitPrice}, quantity=${cartItem.quantity}`);
    }
  }
}