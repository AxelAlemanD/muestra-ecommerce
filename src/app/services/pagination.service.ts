import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {

  paginate<T>(items: T[], limit: number, page: number): T[] {
    if (limit <= 0 || page <= 0) {
      throw new Error('limit y page deben ser mayores a 0');
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return items.slice(startIndex, endIndex);
  }
}
