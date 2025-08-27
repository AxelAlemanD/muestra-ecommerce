import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'validation',
  standalone: true,
})
export class ValidationPipe implements PipeTransform {

  transform(value: any, details: { name: string; type: string }, errorObj: any): string {
    const typeErrors = value[details.type];
    const errorToShow: string = typeErrors[Object.keys(errorObj)[0]];
    return (errorToShow.includes('INPUT_NAME'))
      ? errorToShow.replace('INPUT_NAME', details.name)
      : errorToShow;
  }
}
