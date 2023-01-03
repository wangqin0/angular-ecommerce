export class OrderHistory {

    constructor(public id: string,
                public trackingNumber: string,
                public totalPrice: number,
                public totalQuantity: number,
                public dateCreated: Date) {
    }
}
