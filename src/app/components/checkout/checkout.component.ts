import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {FormOptionService} from "../../services/form-option.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = this.formBuilder.group(1);

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];


  constructor(private formBuilder: FormBuilder, private formOptionService: FormOptionService) {
  }

  ngOnInit() {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    // populate credit card month and year options
    const startMonth: number = new Date().getMonth() + 1;
    this.formOptionService.getCreditCardMonths(startMonth).subscribe(
        data => this.creditCardMonths = data
    );
    this.formOptionService.getCreditCardYears().subscribe(
        data => this.creditCardYears = data
    );

  }

  onSubmit() {
    console.log("Handling the checkout submit");
    console.log(this.checkoutFormGroup.get('customer')?.value!);
  }

  copyShippingToBilling(event: any) {
    if (event.target.checked) {
      console.log("checked!");
      this.checkoutFormGroup.controls['billingAddress'].setValue(
          this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      console.log("unchecked!");
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onYearChange() {
    const currentYear = new Date().getFullYear();
    const selectedYear = +this.checkoutFormGroup.get('creditCard')?.value.expirationYear;

    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formOptionService.getCreditCardMonths(startMonth).subscribe(
        data => this.creditCardMonths = data
    )
  }
}
