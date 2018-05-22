import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SasakiService } from '../../../services/sasaki/sasaki.service';

@Component({
    selector: 'app-auth-register-terms',
    templateUrl: './auth-register-terms.component.html',
    styleUrls: ['./auth-register-terms.component.scss']
})
export class AuthRegisterTermsComponent implements OnInit {

    public isLoading: boolean;
    public termsForm: FormGroup;
    public disable: boolean;

    constructor(
        private sasaki: SasakiService,
        private formBuilder: FormBuilder
    ) { }

    public ngOnInit() {
        this.termsForm = this.formBuilder.group({
            terms: [false, [Validators.requiredTrue]]
        });
        console.log(this.termsForm);
        this.disable = false;
    }

    /**
     * 次へ
     * @method onSubmit
     */
    public async onSubmit() {
        if (this.disable) {
            return;
        }
        if (this.termsForm.invalid) {
            this.termsForm.controls.terms.markAsDirty();

            return;
        }
        this.disable = true;
        try {
            await this.sasaki.signUp();
        } catch (error) {
            console.error(error);
            this.disable = false;
        }
    }

}
