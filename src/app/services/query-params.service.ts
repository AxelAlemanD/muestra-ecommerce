import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class QueryParamsService {

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) { }

    sanitize(): void {
        const allowedParams = ['busqueda', 'marca', 'precio', 'orden', 'limite', 'pagina', 'promocion', 'tipo-promocion', 'categoria', 'subcategoria'];
        let queryParams = { ...this._activatedRoute.snapshot.queryParams };

        queryParams = Object.keys(queryParams)
            .filter(key => allowedParams.includes(key))
            .reduce((obj, key) => {
                obj[key] = queryParams[key];
                return obj;
            }, {} as any);

        this._router.navigate([], { queryParams });
    }

    removeParam(param: string): void {
        let queryParams = { ...this._activatedRoute.snapshot.queryParams };
        if (Object.hasOwn(queryParams, param)) {
            delete queryParams[param]
        }
        this._router.navigate([], { queryParams });
    }
}
