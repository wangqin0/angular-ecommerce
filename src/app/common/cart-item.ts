import {Product} from "./product";

export class CartItem {

    product: Product;
    quantity: number;

    constructor(product: Product) {
        this.product = product;

        this.quantity = 1;
    }
}
