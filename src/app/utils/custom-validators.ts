import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidators {

  /**
   * Validates that the password contains 8 characters, 
   * where at least one is uppercase, one lowercase and one number
   * @returns Pattern that validates the password
   */
  password(): ValidatorFn {
    return Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/);
  }

  passwordMatch(passwordControl: AbstractControl, confirmPasswordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (passwordControl && confirmPasswordControl) {
        if (passwordControl.value !== confirmPasswordControl.value) {
          return { 'mismatch': true };
        }
      }
      return null;
    };
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      // If the value is empty, it is not validated (to combine with `Validators.required`).
      if (!value) {
        return null;
      }

      // Regex to validate the phone number format.
      const regex = /^[0-9]{10}$/;

      // Allowed combinations.
      const validPrefixes = [
        '810', '811', '812', '813', '814',
        '815', '816', '817', '818', '819',
        '488', '821', '823', '824', '825',
        '826', '828', '829', '867', '873',
        '892'
      ];

      // Validate that the number only contains 10 digits.
      if (!regex.test(value)) {
        return { invalidPhone: 'El número debe contener exactamente 10 dígitos numéricos.' };
      }

      // Validate that it starts with an allowed prefix.
      const prefix = value.substring(0, 3); // Extract the first three digits.
      if (!validPrefixes.includes(prefix)) {
        return { invalidPrefix: `El número debe comenzar con una de las combinaciones permitidas: ${validPrefixes.join(', ')}.` };
      }

      return null;
    };
  }

  forbiddenWordsValidator(forbiddenWords: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.trim().toLowerCase();
      const found = forbiddenWords.some(word => word.toLowerCase() === value);

      return found ? { forbiddenWord: true } : null;
    };
  }
}