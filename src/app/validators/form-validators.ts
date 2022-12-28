import {FormControl, ValidationErrors} from "@angular/forms";

export class FormValidators {

    // whitespace validation
    static allWhiteSpace(contorl: FormControl): ValidationErrors {

        // check if string only contains whitespace
        if (contorl.value != null && contorl.value.trim().length === 0) {
            return { 'allWhiteSpace': true };
        }
        return {};
    }
}
