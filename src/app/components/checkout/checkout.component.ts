import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormOptionService} from "../../services/form-option.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {FormValidators} from "../../validators/form-validators";

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

    countries: Country[] = [];

    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    constructor(private formBuilder: FormBuilder,
                private formOptionService: FormOptionService) {
    }

    ngOnInit() {

        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                // new FormControl(<initialValue>, <validators>, ...)
                firstName: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                lastName: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                email: new FormControl('',
                    [Validators.required, Validators.email]),  // maybe too lenient
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

        // populate country options
        this.formOptionService.getCountries().subscribe(
            data => this.countries = data
        );
    }

    get firstName() {
        return this.checkoutFormGroup.get('customer.firstName');
    }

    get lastName() {
        return this.checkoutFormGroup.get('customer.lastName');
    }

    get email() {
        return this.checkoutFormGroup.get('customer.email');
    }

    onSubmit() {
        console.log("[onSubmit]");


        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
        }

        console.log(this.checkoutFormGroup.get('customer')?.value!);
        console.log(this.checkoutFormGroup.get('shippingAddress')?.value!);
        console.log(this.checkoutFormGroup.get('billingAddress')?.value!);
        console.log(this.checkoutFormGroup.get('creditCard')?.value!);
        console.log("");
    }

    copyShippingToBilling(event: any) {
        if (event.target.checked) {
            console.log("checked!");
            this.checkoutFormGroup.controls['billingAddress'].setValue(
                this.checkoutFormGroup.controls['shippingAddress'].value);

            // copy state
            this.billingAddressStates = this.shippingAddressStates;
        } else {
            console.log("unchecked!");
            this.checkoutFormGroup.controls['billingAddress'].reset();

            this.billingAddressStates = [];
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

    onCountryChange(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);
        const countryCode = formGroup!.value.country.code;
        // console.log(`[onCountryChange] formGroupName=${formGroupName} countryCode=${countryCode}`);

        this.formOptionService.getStatesByCountryCode(countryCode).subscribe(
            data => {
                // console.log(`[onCountryChange] on [getStatesByCountryCode]: ${data}`);
                if (formGroupName == 'shippingAddress') {
                    this.shippingAddressStates = data;
                } else if (formGroupName == 'billingAddress') {
                    this.billingAddressStates = data;
                }

                formGroup!.get('state')!.setValue(data[0]);
            }
        );
    }
}
