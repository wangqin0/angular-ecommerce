export class Product {

  // Parameter Properties
  constructor(private sku: string,
              public name: string,
              public description: string,
              public unitPrice: number,
              public imageUrl: string,
              public active: boolean,
              public unitsInStock: number,
              public dataCreated: Date,
              public lastUpdated: Date,
  ) {
  }
}
