import { Product } from './product';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product('', '', '', -1, '', false, -1, new Date(), new Date())).toBeTruthy();
  });
});
