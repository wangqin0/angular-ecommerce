import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormOptionService} from "../../services/form-option.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {FormValidators} from "../../validators/form-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {Customer} from "../../common/customer";
import {Address} from "../../common/address";
import {Router} from "@angular/router";

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
                private formOptionService: FormOptionService,
                private cartService: CartService,
                private checkoutService: CheckoutService,
                private router: Router) {
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
                street: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                city: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                state: new FormControl('',
                    [Validators.required]),
                country: new FormControl('',
                    [Validators.required]),
                zipCode: new FormControl('',
                    [Validators.required, Validators.minLength(3), FormValidators.allWhiteSpace]),
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                city: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                state: new FormControl('',
                    [Validators.required]),
                country: new FormControl('',
                    [Validators.required]),
                zipCode: new FormControl('',
                    [Validators.required, Validators.minLength(3), FormValidators.allWhiteSpace]),
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('',
                    [Validators.required]),
                nameOnCard: new FormControl('',
                    [Validators.required, Validators.minLength(2), FormValidators.allWhiteSpace]),
                cardNumber: new FormControl('',
                    [Validators.required, Validators.pattern('[0-9]{16}')]),
                securityCode: new FormControl('',
                    [Validators.required, Validators.pattern('[0-9]{3,4}')]),
                expirationMonth: [''],  // will not be empty or invalid
                expirationYear: [''],   // will not be empty or invalid
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

        this.subscribeCartService();
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

    get shippingAddressStreet() {
        return this.checkoutFormGroup.get('shippingAddress.street');
    }

    get shippingAddressCity() {
        return this.checkoutFormGroup.get('shippingAddress.city');
    }

    get shippingAddressState() {
        return this.checkoutFormGroup.get('shippingAddress.state');
    }

    get shippingAddressCountry() {
        return this.checkoutFormGroup.get('shippingAddress.country');
    }

    get shippingAddressZipCode() {
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }

    get billingAddressStreet() {
        return this.checkoutFormGroup.get('billingAddress.street');
    }

    get billingAddressCity() {
        return this.checkoutFormGroup.get('billingAddress.city');
    }

    get billingAddressState() {
        return this.checkoutFormGroup.get('billingAddress.state');
    }

    get billingAddressCountry() {
        return this.checkoutFormGroup.get('billingAddress.country');
    }

    get billingAddressZipCode() {
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }

    get CreditCardType() {
        return this.checkoutFormGroup.get('creditCard.cardType');
    }

    get CreditCardNameOnCard() {
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }

    get CreditCardNumber() {
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }

    get CreditCardSecurityCode() {
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }

    onSubmit() {
        console.log("[onSubmit]");


        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }

        // ----- begin setup purchase info -----
        // set up order
        let order = new Order(this.totalPrice, this.totalQuantity);

        // get cart items
        const cartItems = this.cartService.cartItems;

        // create orderItems from cartItems
        let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem((cartItem)));

        // customer
        let customer: Customer = this.checkoutFormGroup.get('customer')!.value;

        // shippingAddress
        let shippingAddress: Address = this.checkoutFormGroup.get('shippingAddress')!.value;

        let stateConverter: State = JSON.parse(JSON.stringify(shippingAddress.state));
        shippingAddress.state = stateConverter.name;

        let countryConverter: Country = JSON.parse(JSON.stringify(shippingAddress.country));
        shippingAddress.country = countryConverter.name;

        // billingAddress
        let billingAddress: Address = this.checkoutFormGroup.get('billingAddress')!.value;

        stateConverter = JSON.parse(JSON.stringify(billingAddress.state));
        billingAddress.state = stateConverter.name;

        countryConverter = JSON.parse(JSON.stringify(billingAddress.country));
        billingAddress.country = countryConverter.name;

        // purchase
        let purchase: Purchase = new Purchase(
            customer,
            shippingAddress,
            billingAddress,
            order,
            orderItems
        );
        // ----- end setup purchase info -----

        // call REST API via the CheckoutService
        this.checkoutService.placeOrder(purchase).subscribe({
            // next path
            next: response => {
                alert(`Your order has been received.\nOrder tracking number: ${response.trackingNumber}`);

                // reset cart
                this.resetCart();
            },
            // error path
            error: err => alert(`There was an error: ${err.message}`)
        });

        console.log(purchase);
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

    private subscribeCartService() {
        this.cartService.totalQuantity.subscribe(
            totalQuantity => this.totalQuantity = totalQuantity
        );
        this.cartService.totalPrice.subscribe(
            totalPrice => this.totalPrice = totalPrice
        );
    }

    private resetCart() {
        // reset cart data
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);

        // reset the from
        this.checkoutFormGroup.reset();

        // navigate back to the products page
        this.router.navigateByUrl("/products");
    }
}
