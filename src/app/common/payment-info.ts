export class PaymentInfo {

  constructor(public amount: number, // count of the smallest currency unit
              public currency: string,
              public receiptEmail: string) {

  }
}
