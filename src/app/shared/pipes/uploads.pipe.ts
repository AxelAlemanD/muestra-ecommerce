import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'uploads',
  standalone: true,
})
export class UploadsPipe implements PipeTransform {

  private _pathUploads = environment._uploadsUrl;

  transform(value: string): string {
    return this._pathUploads + value;
  }

}
