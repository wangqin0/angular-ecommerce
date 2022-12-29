import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

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

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      this.removeCartItem(cartItem);
    } else {
      this.computeCartTotal();
    }
  }

  removeCartItem(toRemove: CartItem) {
    const i = this.cartItems.findIndex( cartItem => cartItem.product.id === toRemove.product.id );
    if (i >= 0) {
      this.cartItems.splice(i, 1);
      this.computeCartTotal();
    } else {
      console.error(`[removeCartItem] i=${ i } is negative!`)
    }
  }
}
