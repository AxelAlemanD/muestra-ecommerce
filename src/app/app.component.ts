import { Component, OnInit } from '@angular/core';
import { GenericService } from './services/generic.service';
import { BrandsRepo } from './shared/repositories/brands.repository';
import { ProductsRepo } from './shared/repositories/products.repository';
import { CategoriesRepo } from './shared/repositories/categories.repository';
import { HttpEntitiesEnum } from './shared/enums/http-entities.enum';
import { take } from 'rxjs';
import { IBrand } from './interfaces/brand.interface';
import { ICategory } from './interfaces/category.interface';
import { IProduct } from './interfaces/product.interface';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  theme: 'light-theme' | 'dark-theme' | null = null;
  brands: IBrand[] = [
    {
      "id": 1,
      "nombre": "NUPEC",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 2,
      "nombre": "PRO PLAN",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 3,
      "nombre": "PURINA",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 4,
      "nombre": "BRAVECTO",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 5,
      "nombre": "EXCELLENT",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 6,
      "nombre": "PETS PHARMA",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 7,
      "nombre": "GRATEFUL",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 8,
      "nombre": "NEXGARD",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 9,
      "nombre": "PISA",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 10,
      "nombre": "FELICAT",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 11,
      "nombre": "SHAGGY",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 12,
      "nombre": "PANCHO",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 13,
      "nombre": "Aranda Pets",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 14,
      "nombre": "fancy pets",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 15,
      "nombre": "CASA LUCA",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 16,
      "nombre": "Agromas",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
    },
    {
      "id": 17,
      "nombre": "NUCAN",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      }
    }
  ];

  categories: ICategory[] = [
    {
      "id": 1,
      "nombre": "PERRO",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
      subcategorias: [
        {
          "id": 5,
          "nombre": "Adulto",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 23,
          "nombre": "Snack",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 25,
          "nombre": "Cachorro",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 26,
          "nombre": "Razas Pequeñas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 27,
          "nombre": "Senior",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 2,
      "nombre": "GATO",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
      subcategorias: [
        {
          "id": 7,
          "nombre": "Adultos",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 24,
          "nombre": "Snacks",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 28,
          "nombre": "Kitten",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 29,
          "nombre": "Arena",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 30,
          "nombre": "Especializados",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 3,
      "nombre": "ACCESORIOS",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
      subcategorias: [
        {
          "id": 18,
          "nombre": "Juguetes",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 19,
          "nombre": "Collares y Pecheras",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 20,
          "nombre": "Comederos y Complementos",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 4,
      "nombre": "FARMAPET",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
      subcategorias: [
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 11,
          "nombre": "Desparasitantes",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 12,
          "nombre": "Suplementos y mas.",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 13,
          "nombre": "Collar Isabelino",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 31,
          "nombre": "Higiene y Cuidado",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 32,
      "nombre": "AVES",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
      subcategorias: [
        {
          "id": 33,
          "nombre": "Inicio",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 34,
          "nombre": "Ponedora",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 35,
          "nombre": "Engorda",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 36,
          "nombre": "Desarrollo",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 37,
          "nombre": "Gallo",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 38,
          "nombre": "Granos",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },

    {
      "id": 39,
      "nombre": "EQUINO",
      "media": {
        id: 0,
        nombre: '',
        media_url: '',
      },
      subcategorias: [
        {
          "id": 40,
          "nombre": "Alimento",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 41,
          "nombre": "Suplementos - Med",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 42,
          "nombre": "Accesorios e Higiene",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
  ]

  products: IProduct[] = [
    {
      "id": 1,
      "nombre": "NUPEC CACHORRO",
      "descripcion": "La selección de un alimento adecuado para tu mascota es muy importante para garantizar su crecimiento, desarrollo y salud. Con esta opción de Nupec podrás cubrir las necesidades nutricionales y energéticas de tu perro.\n\nTu mascota siempre saludable\nEllos son parte de la familia y nos regalan su compañía y su cariño. Para que se mantengan sanos y fuertes, una alimentación balanceada es esencial. Bríndale a tu perro los nutrientes que necesita para que pueda correr, saltar y jugar todo el día.\n\nBeneficios del alimento seco\nLa mayor ventaja de la comida seca para mascotas es que se puede almacenar por mucho más tiempo sin que se deteriore, y evita la aparición de hongos o bacterias. Además, este tipo de alimento ayuda a eliminar el sarro y a retrasar la formación de la placa dental con el proceso de masticación y trituración.",
      "caracteristicas": "<ul><li><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Tipo de comida para mascotas: Seca<\/span><\/li><li><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Sabor: Mix\n<\/span><\/span><\/li><li><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Recomendado para perro cachorro.<\/span><\/span><\/li><li><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Sabor y nutrición completa para tu mascota.<\/span><\/span><\/li><li><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Imágenes ilustrativas. El paquete puede variar según peso.<br><\/span><\/span><\/li><li><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Grupo Nutec Nupec Nutrición Científica Perro Cachorro contiene carne de pollo y vitaminas para una salud oral óptima en cachorros.<\/span><\/span><\/li><\/ul><div><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><\/span><\/span><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><\/span><span style=\"background-color: rgb(248, 249, 250); display: inline !important;\"><\/span><\/div>",
      "sku": "7503008553002",
      "unidad_medida": "Kg",
      "precio": 255.00,
      "precio_con_descuento": 255.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 25,
          "nombre": "Cachorro",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 1,
          "producto_id": 1,
          "stock": -83,
          "variante": {
            color: "5KG",
            size: "5KG",
            colorCode: null
          },
          "precio": 579.0,
          "created_at": "2024-12-30 07:54:37",
          "updated_at": "2025-04-02 11:11:21"
        },
        {
          "id": 2,
          "producto_id": 1,
          "stock": -47,
          "variante": {
            color: "8KG",
            size: "8KG",
            colorCode: null
          },
          "precio": 810.0,
          "created_at": "2024-12-30 07:55:10",
          "updated_at": "2025-04-02 11:11:21"
        },
        {
          "id": 3,
          "producto_id": 1,
          "stock": 25,
          "variante": {
            color: "15KG",
            size: "15KG",
            colorCode: null
          },
          "precio": 1517.0,
          "created_at": "2024-12-30 07:55:38",
          "updated_at": "2024-12-30 07:55:38"
        },
        {
          "id": 12,
          "producto_id": 1,
          "stock": 25,
          "variante": {
            color: "2KG",
            size: "2KG",
            colorCode: null
          },
          "precio": 300.0,
          "created_at": "2025-01-15 11:12:16",
          "updated_at": "2025-02-17 10:00:43"
        },
      ]
    },
    {
      "id": 2,
      "nombre": "NUPEC ADULTO",
      "descripcion": "En NUPEC estamos conscientes de que un canino en etapa adulta necesita un aporte de nutrientes óptimo para conservar su masa muscular, vitalidad y un pelaje sano. Por ello diseñamos un alimento con la selección de vitaminas, minerales y aporte de proteína adecuados para reforzar su sistema inmune y asegurar una condición física fuerte y saludable. Este alimento seco, especialmente formulado para perros de razas medianas y grandes, contiene un 24% de proteína bruta, lo que favorece el desarrollo muscular. Proporciona la energía necesaria para un estilo de vida activo. Sus ingredientes de alta calidad, como arroz y pollo, garantizan una nutrición balanceada. Además, su composición incluye un 4% de fibra cruda y un 9% de humedad, asegurando una digestión adecuada. Presentado en una bolsa de 5 kg, es ideal para mantener a tu mascota en óptimas condiciones.",
      "caracteristicas": "<ul><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Mascota recomendada: Perro\n<\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Etapa de vida de la mascota: Adulto Tamaño de la raza: Mediana\/Grande<\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Aporte de nutrientes: 9% Húmedad 4% Fibra cruda 8% Cenizas 43% E.L.N\n<\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Fabricante: Grupo Nutec<\/span><\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Marca: Nupec\n<\/span><\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Línea: Nutrición Científica<\/span><\/span><\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Sabor: Mix\n<\/span><\/span><\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Tipo de comida para mascotas: Seca<\/span><\/span><\/span><\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Es protector de la salud oral: Sí<\/span><\/span><\/span><\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Ingredientes: Pollo<\/span><\/span><\/span><\/span><\/span><\/li><\/ul><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><\/span><\/span><\/span><\/span><\/span>",
      "sku": "7503008553200",
      "unidad_medida": "Kg",
      "precio": 259.00,
      "precio_con_descuento": 259.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 5,
          "nombre": "Adulto",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 5,
          "producto_id": 2,
          "stock": 16,
          "variante": {
            color: "5KG",
            size: "5KG",
            colorCode: null
          },
          "precio": 540.0,
          "created_at": "2024-12-30 08:13:14",
          "updated_at": "2025-04-01 11:11:23"
        },
        {
          "id": 6,
          "producto_id": 2,
          "stock": 25,
          "variante": {
            color: "8KG",
            size: "8KG",
            colorCode: null
          },
          "precio": 805.0,
          "created_at": "2024-12-30 08:13:40",
          "updated_at": "2024-12-30 08:13:40"
        },
        {
          "id": 7,
          "producto_id": 2,
          "stock": 25,
          "variante": {
            color: "15KG",
            size: "15KG",
            colorCode: null
          },
          "precio": 1335.0,
          "created_at": "2024-12-30 08:19:13",
          "updated_at": "2024-12-30 08:19:13"
        },
        {
          "id": 13,
          "producto_id": 2,
          "stock": 19,
          "variante": {
            color: "2KG",
            size: "2KG",
            colorCode: null
          },
          "precio": 259.0,
          "created_at": "2025-01-15 11:13:18",
          "updated_at": "2025-04-10 10:26:42"
        },
      ]
    },
    {
      "id": 3,
      "nombre": "NUPEC ADULTO RP",
      "descripcion": "ANÁLISIS GARANTIZADO\nProteína Cruda Mín. 24.0%\nGrasa Cruda Mín. 12.0%\nFibra Cruda Máx. 4.0%\nHumedad Máx. 9.0%\nCenizas Máx. 8.0%\nE.L.N. 43.0%\n\nINGREDIENTES:\nHarina de carne de res, arroz, maíz, carne de pollo, concentrado de proteína vegetal, grasa de pollo, harina de carne de pollo, pulpa de remolacha, semilla de linaza, harina de pescado, sabor natural de pollo, fósforo, calcio, sodio, extracto de raíz de achicoria, cloruro de colina, levadura hidrolizada (Saccharomyces cerevisiae activa 10x1010), acetato de retinol (fuente de vitamina A), colecalciferol (fuente de vitamina D), acetato de DL-alpha tocoferol (fuente de vitamina E), menadiona nicotinamida bisulfato (fuente de vitamina K), ácido ascórbico (fuente de vitamina C), mononitrato de tiamina (fuente de vitamina B1), riboflavina (fuente de vitamina B2), ácido nicotínico (fuente de vitamina B3), clorhidrato de piridoxina (fuente de vitamina B6), cianocobalamina (fuente de vitamina B12), D-biotina (fuente de vitamina H), D-pantotenato de calcio (fuente de vitamina B5), ácido fólico, hierro orgánico, manganeso orgánico, selenio orgánico, cobre orgánico, zinc orgánico, EDDI, extracto de Yucca schidigera, mezcla de romero y tocoferoles como conservadores.",
      "caracteristicas": "<ul><li>Fabricante: Grupo Nutec<\/li><li>Marca: Nupec<\/li><li>Línea: Nutrición Científica<\/li><li>Mascota recomendada: Perro<\/li><li>Tamaño de la raza: Pequeña<\/li><li>Etapa de vida de la mascota: Adulto<\/li><li>Sabor: Mix<\/li><li>Tipo de comida para mascotas: Seca<\/li><li>Ingredientes: Pollo<\/li><li>Es protector de la salud oral: Sí<\/li><li>Aporte de nutrientes: 9% Húmedad, 4% Fibra cruda, 8% Cenizas, 43% E.L.N, Contenido calórico 3500 kcal\/kg<\/li><\/ul>",
      "sku": "7503008553248",
      "unidad_medida": "Kg",
      "precio": 289.00,
      "precio_con_descuento": 289.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 23,
          "nombre": "Snack",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 8,
          "producto_id": 3,
          "stock": 25,
          "variante": {
            color: "8KG",
            size: "8KG",
            colorCode: null
          },
          "precio": 920.0,
          "created_at": "2024-12-30 08:24:33",
          "updated_at": "2024-12-30 08:24:33"
        },
        {
          "id": 14,
          "producto_id": 3,
          "stock": 25,
          "variante": {
            color: "2KG",
            size: "2KG",
            colorCode: null
          },
          "precio": 289.0,
          "created_at": "2025-01-15 11:14:17",
          "updated_at": "2025-01-15 11:14:17"
        },
      ]
    },
    {
      "id": 4,
      "nombre": "NUPEC CACHORRO RP",
      "descripcion": "La selección de un alimento adecuado para tu mascota es muy importante para garantizar su crecimiento, desarrollo y salud. Con esta opción de Nupec podrás cubrir las necesidades nutricionales y energéticas de tu perro.\n\nTu mascota siempre saludable\nEllos son parte de la familia y nos regalan su compañía y su cariño. Para que se mantengan sanos y fuertes, una alimentación balanceada es esencial. Bríndale a tu perro los nutrientes que necesita para que pueda correr, saltar y jugar todo el día.\n\nBeneficios del alimento seco\nLa mayor ventaja de la comida seca para mascotas es que se puede almacenar por mucho más tiempo sin que se deteriore, y evita la aparición de hongos o bacterias. Además, este tipo de alimento ayuda a eliminar el sarro y a retrasar la formación de la placa dental con el proceso de masticación y trituración.",
      "caracteristicas": "<li>Fabricante: Grupo Nutec<\/li><li>Marca: Nupec<\/li><li>Línea: Nutrición Científica<\/li><li>Sabor: Mix<\/li><li>Tipo de comida para mascotas: Seca<\/li><li>Es protector de la salud oral: Sí<\/li><li>Ingredientes: Carne de pollo, Vitamina E, Vitamina B1, Biotina<\/li><li>Características de la mascota:<ul><li>Mascota recomendada: Perro<\/li><li>Etapa de vida de la mascota: Cachorro<\/li><li>Tamaño de la raza: Pequeña<\/li><\/ul><\/li><li>Otros:<ul><li>Necesidades especiales: Urinario<\/li><\/ul><\/li><li>Aporte de nutrientes: 28% Proteína<\/li><!--EndFragment-->",
      "sku": "7503008553040",
      "unidad_medida": "Kg",
      "precio": 320.00,
      "precio_con_descuento": 320.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 26,
          "nombre": "Razas Pequeñas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 4,
          "producto_id": 4,
          "stock": 24,
          "variante": {
            color: "8KG",
            size: "8KG",
            colorCode: null
          },
          "precio": 1060.0,
          "created_at": "2024-12-30 07:59:43",
          "updated_at": "2025-03-06 04:05:57"
        },
        {
          "id": 15,
          "producto_id": 4,
          "stock": 1,
          "variante": {
            color: "2KG",
            size: "2KG",
            colorCode: null
          },
          "precio": 320.0,
          "created_at": "2025-01-15 11:15:09",
          "updated_at": "2025-04-17 11:33:53"
        },
      ]
    },
    {
      "id": 5,
      "nombre": "NUPEC SENIOR 2KG (prueba)",
      "descripcion": "ANÁLISIS GARANTIZADO\nProteína Cruda 29.0% Min.\nGrasa Cruda 12.0% Min\nFibra Cruda 4.5% Max.\nHumedad 11.0% Máx.\nCenizas 7.0% Máx.\nE.L.N. 36.5%\n\nBENEFICIOS\n\nPromueve la salud articular.\nAyuda en el mantenimiento de la masa ósea y muscular.\nFavorece la respuesta del sistema inmunológico.\nINGREDIENTES\nHarina de carne de res, maíz, arroz, carne de pollo, grasa de pollo, harina de pescado, pulpa de remolacha, concentrado de proteína vegetal, sabor natural de pollo, fósforo, calcio, sodio, acetato de retinol (fuente de vitamina A), colecalciferol (fuente de vitamina D), acetato de DL-tocoferol (fuente de vitamina E), menadiona nicotinamida bisulfato (fuente de vitamina K), ácido ascórbico (fuente de vitamina C), mononitrato de tiamina (fuente de vitamina B1), riboflavina (fuente de vitamina B2), ácido nicotínico (fuente de vitamina B3), clorhidrato de piridoxina (fuente de vitamina B6), cianocobalamina (fuente de vitamina B12), D-biotina (fuente de vitamina H), D-pantotenato de calcio (fuente de vitamina B5), ácido fólico, hierro orgánico, manganeso orgánico, selenio orgánico, cobre orgánico, zinc orgánico, EDDI, glucosamina, sulfato de condroitina, extracto de yucca shidigera, mezcla de romero y tocoferoles como conservadores.",
      "caracteristicas": "<ul><li>Sabor: Mix<br><\/li><li>Recomendado para perro senior.<br><\/li><li>Sabor y nutrición completa para tu mascota.<br><\/li><li>Imágenes ilustrativas. El paquete puede variar según peso.<br><\/li><li>Grupo Nutec Nupec Nutrición Científica Perro Senior es ideal para la etapa senior de tu mascota, <\/li><li>proporcionando una nutrición científicamente balanceada.<\/li><li>Tipo de comida para mascotas: Seca<\/li><li>Ingredientes: Pollo<\/li><li>Es protector de la salud oral: No<\/li><li>Necesidades especiales: Quisquilloso<br><\/li><li>Aporte de nutrientes: 29% Proteína<\/li><\/ul>",
      "sku": "7503008553965",
      "unidad_medida": "Kg",
      "precio": 500.00,
      "precio_con_descuento": 500.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 27,
          "nombre": "Senior",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 6,
      "nombre": "NUPEC DENTAL CARE 180GR",
      "descripcion": "Premios Nupec Dental Care 180g es un delicioso snack diseñado especialmente para el cuidado dental de tu perro. Con una fórmula enriquecida con calcio, estos premios ayudan a fortalecer los dientes de tu mascota, promoviendo una salud bucal óptima. Además, su innovadora fórmula con clorofila no solo aporta un sabor irresistible a pollo, sino que también combate el mal aliento al inhibir el crecimiento bacteriano. Este producto, que se presenta en un práctico envase de 180 g, es ideal para perros y está diseñado para ser un complemento en su dieta. Con una textura seca y crujiente, estos premios son perfectos para disfrutar en cualquier momento del día. Recuerda que la salud dental es fundamental para el bienestar de tu mascota, y con Nupec, puedes cuidar de ella de manera deliciosa y efectiva. ¡Haz de la higiene dental un momento especial para tu perro!",
      "caracteristicas": "<li>Marca: Nupec<\/li><li>Otros<ul><li>Línea: PREMIOS<\/li><li>Peso neto: 180 g<\/li><li>Sabor: Pollo<\/li><li>Formato de venta: Unidad<\/li><li>Beneficios:<ul><li>Su fórmula con clorofila ayuda a combatir el mal aliento, inhibiendo el crecimiento bacteriano.<\/li><li>Con calcio para fortalecer sus dientes<\/li><\/ul><\/li><li>Textura: Seco<\/li><li>Tipo de golosina para perros y gatos: Snack<\/li><li>Mascotas recomendadas: Perros<\/li><\/ul><\/li><!--EndFragment-->",
      "sku": "7503020053290",
      "unidad_medida": "unidad",
      "precio": 90.00,
      "precio_con_descuento": 90.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 23,
          "nombre": "Snack",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 7,
      "nombre": "NUPEC FELINO KITTEN",
      "descripcion": "Nupec Felino Kitten es un alimento seco especializado para gatitos, con un contenido de proteína bruta del 8.5%. Su delicioso sabor a carne y pollo lo convierte en una opción irresistible para tu mascota. Este producto es ideal para gatitos de todas las razas y tamaños, garantizando una alimentación balanceada y completa. Además, su fórmula ayuda a proteger la salud oral de tu felino.\n\nNupec es una marca reconocida por su compromiso con la nutrición animal, y este producto no es la excepción. Fabricado por Grupo Nutec, líder en el mercado de alimentos para mascotas, puedes confiar en la calidad y seguridad de este alimento para tu gato.\n\nLa línea de Nutrición Felina Especializada de Nupec está diseñada para cubrir las necesidades específicas de cada etapa de vida de tu mascota. Con Nupec Felino Kitten, tu gatito recibirá todos los nutrientes necesarios para crecer sano y fuerte. Aprovecha esta oferta que incluye catnip gratis, un regalo perfecto para consentir a tu felino. ¡No esperes más y bríndale a tu gatito la alimentación que se merece con Nupec Felino Kitten!",
      "caracteristicas": "<p style=\"font-size: 13.6px; text-align: var(--bs-body-text-align); display: inline !important;\">Características de la mascota<\/p><ul><li>Mascota recomendada: Gato<\/li><li>Etapa de vida de la mascota: Gatito<\/li><li>Tamaño de la raza: Todos los tamaños<\/li><\/ul><p style=\"font-size: 13.6px; text-align: var(--bs-body-text-align); display: inline !important;\">Características generales<\/p><ul><li>Fabricante: Grupo Nutec<\/li><li>Marca: Nupec<\/li><li>Línea: Nutrición Felina Especializada<\/li><li>Nombre: Kitten<\/li><\/ul><p style=\"font-size: 13.6px; text-align: var(--bs-body-text-align); display: inline !important;\">Especificaciones<\/p><ul style=\"font-size: 13.6px; text-align: var(--bs-body-text-align);\"><li>Sabor: Carne\/Pollo<\/li><li>Tipo de comida para mascotas: Seca<\/li><li>Es protector de la salud oral: Sí<\/li><li>Ingredientes: Carne de pollo<\/li><\/ul><!--EndFragment-->",
      "sku": "7503026084113",
      "unidad_medida": "Kg",
      "precio": 240.00,
      "precio_con_descuento": 240.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 2,
          "nombre": "GATO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 28,
          "nombre": "Kitten",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 11,
          "producto_id": 7,
          "stock": 25,
          "variante": {
            color: "3KG",
            size: "3KG",
            colorCode: null
          },
          "precio": 460.0,
          "created_at": "2025-01-03 07:29:13",
          "updated_at": "2025-01-03 07:29:13"
        },
        {
          "id": 16,
          "producto_id": 7,
          "stock": 25,
          "variante": {
            color: "1.5KG",
            size: "1.5KG",
            colorCode: null
          },
          "precio": 235.0,
          "created_at": "2025-01-15 11:17:30",
          "updated_at": "2025-01-15 11:17:30"
        },
      ]
    },
    {
      "id": 8,
      "nombre": "NUPEC FELINO INDOOR",
      "descripcion": "La selección de un alimento adecuado para tu mascota es muy importante para garantizar su crecimiento, desarrollo y salud. Con esta opción de Nupec podrás cubrir las necesidades nutricionales y energéticas de tu gato.\n\nTu mascota siempre saludable\nUna alimentación balanceada es esencial para que tu fiel compañero se mantenga sano y fuerte. La dieta de tu gato se refleja en su pelaje, por eso es de vital importancia que contenga todos los nutrientes necesarios para su crecimiento. Asegura la energía y vitalidad de tu amigo para que pueda correr, saltar y jugar todo el día.\n\nBeneficios del alimento seco\nLa mayor ventaja de la comida seca para mascotas es que se puede almacenar por mucho más tiempo sin que se deteriore, y evita la aparición de hongos o bacterias. Además, este tipo de alimento ayuda a eliminar el sarro y a retrasar la formación de la placa dental con el proceso de masticación y trituración.\n\nProteína para una nutrición completa\nAlimento rico en proteína animal de alto valor biológico, contiene minerales como calcio, fósforo, potasio y hierro, vitaminas A, D y E, fibras y ácidos grasos esenciales. Estos nutrientes favorecen el fortalecimiento del sistema inmunológico de tu mascota y el correcto funcionamiento de sus sistemas vitales. Además, contribuyen a la salud de su pelo, piel y uñas y al mantenimiento de sus tendones, músculos y huesos.",
      "caracteristicas": "<ul><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Fabricante: Grupo Nutec\n<\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Marca: Nupec<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Línea: Nutrición Científica Consciente<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Nombre: Indoor<\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Mascota recomendada: Gato<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Etapa de vida de la mascota: Adulto<\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Sabor: Pollo\/Salmon\/Arroz<\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Tipo de comida para mascotas: Seca<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Es protector de la salud oral: No<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Ingredientes: Mix<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Necesidades especiales: Urinario<br><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Aporte de nutrientes: 3% Fibra, 7.5% Cenizas<\/span><\/li><\/ul><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><\/span>",
      "sku": "7503026084137",
      "unidad_medida": "Kg",
      "precio": 216.00,
      "precio_con_descuento": 216.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 2,
          "nombre": "GATO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 7,
          "nombre": "Adultos",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 9,
          "producto_id": 8,
          "stock": 25,
          "variante": {
            color: "3KG",
            size: "3KG",
            colorCode: null
          },
          "precio": 410.0,
          "created_at": "2025-01-03 07:26:29",
          "updated_at": "2025-01-03 07:26:29"
        },
        {
          "id": 17,
          "producto_id": 8,
          "stock": 25,
          "variante": {
            color: "1.5KG",
            size: "1.5KG",
            colorCode: null
          },
          "precio": 210.0,
          "created_at": "2025-01-15 11:18:26",
          "updated_at": "2025-01-15 11:18:26"
        },
      ]
    },
    {
      "id": 9,
      "nombre": "NUPEC FELINO HAIRBALL",
      "descripcion": "<ul><li>Nutrición especializada para gatos adultos de pelaje largo.\n<br><\/li><li>Alimento con balance adecuado de nutrientes que ayudan a reducir la formacion de bolas de pelo\n<br><\/li><li>Alta palatabilidad\n<br><\/li><li>Ingredientes nobles\n<br><\/li><li>¿Por qué NUPEC Felino HairBall? En NUPEC estamos conscientes de que el metabolismo de un felino de pelaje largo requiere de una nutrición especializada. Por ello hemos formulado un alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.<\/li><\/ul>",
      "caracteristicas": "<li>Marca: Nupec<\/li><li>Rango de edad (descripción): Adulto<\/li><li>Forma del producto: Gránulo<\/li><li>Usos específicos del producto: Entrenamiento<\/li><li>Número de artículos: 1<\/li><li>Información del paquete: Bolsa<\/li><li>Recomendación de raza: Todas las razas y tamaños<\/li><li>Información sobre alérgenos: Sin alérgenos<br><\/li>",
      "sku": "7503026084151",
      "unidad_medida": "Kg",
      "precio": 225.00,
      "precio_con_descuento": 225.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 2,
          "nombre": "GATO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 7,
          "nombre": "Adultos",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ],
      variantes: [
        {
          "id": 10,
          "producto_id": 9,
          "stock": 25,
          "variante": {
            color: "3KG",
            size: "3KG",
            colorCode: null
          },
          "precio": 440.0,
          "created_at": "2025-01-03 07:28:16",
          "updated_at": "2025-01-03 07:28:16"
        },
        {
          "id": 18,
          "producto_id": 9,
          "stock": 25,
          "variante": {
            color: "1.5KG",
            size: "1.5KG",
            colorCode: null
          },
          "precio": 225.0,
          "created_at": "2025-01-15 11:19:33",
          "updated_at": "2025-01-15 11:19:33"
        },
      ]
    },
    {
      "id": 10,
      "nombre": "NUPEC FELINO URINARY 1.5 KG",
      "descripcion": "Felino Urinary Management® de Nupec es una croqueta especialmente formulada para la prevención de la formación de cristales en la orina de los gatos. Este alimento seco, presentado en una práctica bolsa, es ideal para felinos de todas las razas y etapas de vida, especialmente para aquellos adultos que requieren atención especial en su salud urinaria. Con un alto contenido de proteína bruta del 33%, esta fórmula incluye ingredientes de calidad como pescado y pollo, garantizando un sabor mix que encantará a tu mascota. Además, su composición contribuye a la salud oral, lo que lo convierte en una opción integral para el bienestar de tu gato. Recuerda que la dosificación debe ser determinada por un médico veterinario, asegurando así que tu felino reciba la atención nutricional adecuada. Elige Felino Urinary Management® y proporciona a tu gato una nutrición especializada y balanceada.",
      "caracteristicas": "<p data-start=\"106\" data-end=\"140\"><strong data-start=\"106\" data-end=\"140\">Características de la mascota:<\/strong><\/p><ul data-start=\"141\" data-end=\"206\"><li data-start=\"141\" data-end=\"168\">Mascota recomendada: Gato<\/li><li data-start=\"169\" data-end=\"206\">Etapa de vida de la mascota: Adulto<\/li><\/ul><p data-start=\"208\" data-end=\"229\"><strong data-start=\"208\" data-end=\"229\">Especificaciones:<\/strong><\/p><ul data-start=\"230\" data-end=\"361\"><li data-start=\"258\" data-end=\"294\">Tipo de comida para mascotas: Seca<\/li><li data-start=\"295\" data-end=\"330\">Es protector de la salud oral: Sí<\/li><li data-start=\"331\" data-end=\"361\">Ingredientes: Pescado, Pollo<\/li><\/ul><p data-start=\"363\" data-end=\"393\"><strong data-start=\"363\" data-end=\"393\">Características generales:<\/strong><\/p><ul data-start=\"612\" data-end=\"670\" data-is-last-node=\"\"><li data-start=\"394\" data-end=\"419\">Fabricante: Grupo Nutec<\/li><li data-start=\"420\" data-end=\"434\">Marca: Nupec<\/li><li data-start=\"435\" data-end=\"474\">Línea: Nutrición Felina Especializada<\/li><li data-start=\"475\" data-end=\"503\">Nombre: Urinary Management<\/li><\/ul>",
      "sku": "7503026084885",
      "unidad_medida": "Kg",
      "precio": 285.00,
      "precio_con_descuento": 285.00,
      "marca": this.brands.find(brand => brand.id === 1)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 2,
          "nombre": "GATO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 30,
          "nombre": "Especializados",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 11,
      "nombre": "GRATEFUL JR 20KG",
      "descripcion": "<span style=\"background-color: rgb(248, 249, 250); display: inline !important;\">BUENO POR SU SABOR Y ¡GRANDES BENEFICIOS!\n\nLa formula de Grateful® está elaborada con\nuna gran variedad de ingredientes que le\nencantarán a tu perro, entre los que destacan\nla chía, ajonjolí y linaza, ingredientes\nespeciales que garantizan una sana\nalimentación con extraordinario aporte\nalimenticio para tu mascota.<\/span>",
      "caracteristicas": "<p>GRATEFUL JR\n<\/p><ul data-start=\"297\" data-end=\"363\" data-is-last-node=\"\"><li data-start=\"87\" data-end=\"115\">Mascota recomendada: Perro<\/li><li data-start=\"116\" data-end=\"153\">Etapa de vida de la mascota: Cachorro Joven y Madres<\/li><li data-start=\"154\" data-end=\"182\">Tamaño de la raza: Mediana a Grande<\/li><li data-start=\"154\" data-end=\"182\">Sabor: Pollo, Carne y Vegetales<\/li><li data-start=\"221\" data-end=\"247\">Peso de la unidad: 20 kg<\/li><li data-start=\"248\" data-end=\"284\">Tipo de comida para mascotas: Seca<\/li><li data-start=\"297\" data-end=\"363\" data-is-last-node=\"\">Aporte de nutrientes: Pre y Probióticos<\/li><\/ul><p><\/p>",
      "sku": "7503011263325",
      "unidad_medida": "Kg",
      "precio": 590.00,
      "precio_con_descuento": 590.00,
      "marca": this.brands.find(brand => brand.id === 7)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 25,
          "nombre": "Cachorro",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 12,
      "nombre": "GRATEFUL RP 15KG",
      "descripcion": "Grateful Razas Pequeñas es el alimento ideal para esos pequeños consentidos que merecen lo mejor. Con un peso neto de 15 kg, este producto está diseñado específicamente para perros de razas pequeñas, asegurando que cada bocado sea un deleite. Su fórmula única, que incluye carne fresca de pollo y\/o gallina, arroz y vegetales, proporciona un balance perfecto entre nutrición y sabor. Con un contenido de proteína bruta del 24%, este alimento seco no solo satisface el paladar de tu mascota, sino que también aporta antioxidantes, Omega 3 y aceites esenciales, esenciales para su bienestar. Además, su presentación en bolsa garantiza frescura y comodidad. Ideal para perros adultos, Grateful Razas Pequeñas es la elección perfecta para mantener a tu pequeño campeón saludable y feliz. ¡Dale a tu mascota el alimento que se merece!",
      "caracteristicas": "<ul data-start=\"297\" data-end=\"363\" data-is-last-node=\"\"><li data-start=\"87\" data-end=\"115\">Mascota recomendada: Perro<\/li><li data-start=\"116\" data-end=\"153\">Etapa de vida de la mascota: Adulto<\/li><li data-start=\"154\" data-end=\"182\">Tamaño de la raza: Pequeña<\/li><li data-start=\"154\" data-end=\"182\">Sabor: Pollo<\/li><li data-start=\"221\" data-end=\"247\">Peso de la unidad: 15 kg<\/li><li data-start=\"248\" data-end=\"284\">Tipo de comida para mascotas: Seca<\/li><li data-start=\"297\" data-end=\"363\" data-is-last-node=\"\">Aporte de nutrientes: Antioxidantes, Omega 3, Aceites esenciales<br><\/li><\/ul>",
      "sku": "7503011263387",
      "unidad_medida": "Kg",
      "precio": 450.00,
      "precio_con_descuento": 450.00,
      "marca": this.brands.find(brand => brand.id === 7)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 26,
          "nombre": "Razas Pequeñas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 15,
      "nombre": "GRATEFUL 25KG",
      "descripcion": "La selección de un alimento adecuado para tu mascota es muy importante para garantizar su crecimiento, desarrollo y salud. Con esta opción de Grateful podrás cubrir las necesidades nutricionales y energéticas de tu perro.\n\nTu mascota siempre saludable\nEllos son parte de la familia y nos regalan su compañía y su cariño. Para que se mantengan sanos y fuertes, una alimentación balanceada es esencial. Bríndale a tu perro los nutrientes que necesita para que pueda correr, saltar y jugar todo el día.\n\nBeneficios del alimento seco\nLa mayor ventaja de la comida seca para mascotas es que se puede almacenar por mucho más tiempo sin que se deteriore, y evita la aparición de hongos o bacterias. Además, este tipo de alimento ayuda a eliminar el sarro y a retrasar la formación de la placa dental con el proceso de masticación y trituración.",
      "caracteristicas": "<li data-start=\"83\" data-end=\"104\">Fabricante: Sesajal<\/li><li data-start=\"105\" data-end=\"122\">Marca: Grateful<\/li><!--StartFragment--><li data-start=\"146\" data-end=\"158\">Sabor: Mix<\/li><li data-start=\"159\" data-end=\"185\">Peso de la unidad: 25 kg<\/li><li data-start=\"186\" data-end=\"222\">Tipo de comida para mascotas: Seca<\/li><li data-start=\"223\" data-end=\"285\">Ingredientes: Chía, Ajonjolí, Linaza, Antioxidantes, Omega 3<\/li><!--EndFragment--><li data-start=\"322\" data-end=\"350\">Mascota recomendada: Perro<\/li><li data-start=\"351\" data-end=\"388\">Etapa de vida de la mascota: Adulto<\/li><li data-start=\"351\" data-end=\"388\">Necesidades especiales: No<\/li><div>\n\n\n<\/div>",
      "sku": "7503011263172",
      "unidad_medida": "Kg",
      "precio": 545.00,
      "precio_con_descuento": 545.00,
      "marca": this.brands.find(brand => brand.id === 7)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 5,
          "nombre": "Adulto",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 16,
      "nombre": "GRATEFUL PLUS 25KG",
      "descripcion": "La fórmula de Grateful Plus alimento para perros adultos de todas las razas, está elaborada con una gran variedad de elementos que amará tu perro, entre los que destacan los chicharos y zanahorias deshidratadas, ingredientes que garantizan una sana y divertida alimentación para tu mascota.\n\nBENEFICIOS\n-Aporte de energía.\n-Piel y pelo saludable.\n-Crecimiento de músculos y tejidos.\n-Mejoras en sistema digestivo.\n-Fortalece los huesos.\n\nINGREDIENTES\nGranos (maíz y\/o sorgo y\/o trigo), derivados de granos (gluten de maíz y\/o salvado de trigo y\/o salvado de maíz), zanahoria deshidratada, chícharo deshidratado, pastas de oleaginosas (soya y\/o linaza y\/o ajonjolí), harina de carne y hueso de res y\/o harina de pollo, levadura de cerveza inactiva ((saccharomyces cereviciae) como fuente de beta glucanos y paredes celulares (prebióticos)), grasa de res y\/o pollo estabilizada con antioxidantes (BHA, BHT y\/o TBHQ), saborizante natural de cerdo y\/o pollo, sal, yucca schidigera, carbonato de calcio, carbonato de magnesio, sulfato ferroso, sulfato de cobre, oxido de magnesio, yodo, cloruro de potasio, cloruro de selenio, vitaminas A, E, D3, K, B12, tiamina, riboflavina, ácido pantoténico, biotina, colina, niacina, piridoxina, ácido fólico, colorantes artificiales.\n\nANÁLISIS GARANTIZADO:\nProteína cruda (min.) 21%\nGrasa cruda (min.) 10%\nFibra cruda (máx.) 5%\nCenizas (máx.) 11%\nHumedad (máx.) 12%",
      "caracteristicas": "<li data-start=\"87\" data-end=\"116\">Mascota recomendada: Perros<\/li><li data-start=\"117\" data-end=\"154\">Etapa de vida de la mascota: Adulto<\/li><li data-start=\"155\" data-end=\"193\">Tamaño de la raza: Todos los tamaños<\/li><!--StartFragment--><li data-start=\"217\" data-end=\"229\">Sabor: Mix<\/li><li data-start=\"230\" data-end=\"256\">Peso de la unidad: 25 kg<\/li><li data-start=\"257\" data-end=\"293\">Tipo de comida para mascotas: Seca<\/li><li data-start=\"294\" data-end=\"329\">Es protector de la salud oral: Sí<\/li><li data-start=\"330\" data-end=\"392\">Ingredientes: Ajonjolí, Antioxidantes, Chía, Linaza, Omega 3<\/li><!--StartFragment--><li data-start=\"572\" data-end=\"600\">Necesidades especiales: No<\/li><li data-start=\"601\" data-end=\"641\" data-is-last-node=\"\">Aporte de nutrientes: 2.5% Fibra cruda<br><\/li>",
      "sku": "7503026980224",
      "unidad_medida": "Kg",
      "precio": 797.00,
      "precio_con_descuento": 797.00,
      "marca": this.brands.find(brand => brand.id === 7)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 1,
          "nombre": "PERRO",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 5,
          "nombre": "Adulto",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 17,
      "nombre": "BRAVECTO VERY SAMLL 45MG 2-4.5KG 1 MES",
      "descripcion": "Bravecto Masticable Contra Pulgas Y Garrapatas Para 1 Mes: Lo Último En Protección Canina\nDescubra un mundo de protección sin igual contra pulgas y garrapatas con Bravecto 1-Month Chewable for Dogs. Específicamente diseñado con el ingrediente activo fluralaner, este tratamiento oral asegura un escudo de un mes de duración para los perros contra las infestaciones de pulgas y garrapatas dañinas. Adecuado para perros y cachorros a partir de 8 semanas de edad y un peso igual o superior a 2 kg.\n\n¿Por qué elegir Bravecto 1-Month Chew?\nMáxima comodidad: Más fácil, más limpio y más cómodo que los tratamientos puntuales tradicionales.\nDosis única mensual: Una dosis oral cada mes mantiene a su compañero canino libre de pulgas y garrapatas.\nSin aislamiento: Las mascotas tratadas no necesitan estar separadas, a diferencia de lo que ocurre con algunos tratamientos puntuales.\nAdecuado para mascotas en crecimiento: La fórmula mensual satisface las necesidades de su mascota en crecimiento.\nFórmula potente: Fluralaner actúa sobre el sistema nervioso de pulgas y garrapatas, garantizando su rápida eliminación.<div><br><\/div><div>Almacenamiento y precauciones\nConservar a temperatura inferior a 30°C. Este producto es exclusivo para perros y no debe estar al alcance de los niños. Evitar su consumo y lavarse siempre las manos después de manipularlo.<\/div>",
      "caracteristicas": "<ul><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\">Es un eficaz tratamiento para controlar las infestaciones de pulgas y garrapatas.\n<\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Protege a tu canino por 3 meses contra pulgas garrapatas\n<\/span><\/span><\/li><li><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\">Bravecto puede utilizarse sin problemas en caninas en gestación o lactancia.<\/span><\/span><\/li><\/ul><span style=\"font-size: 0.85rem; background-color: rgb(248, 249, 250); text-align: var(--bs-body-text-align); display: inline !important;\"><span style=\"background-color: rgb(248, 249, 250); font-size: 0.85rem; text-align: var(--bs-body-text-align); display: inline !important;\"><\/span><\/span>",
      "sku": "19254",
      "unidad_medida": "unidad",
      "precio": 135.00,
      "precio_con_descuento": 135.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 18,
      "nombre": "BRAVECTO SMALL 100MG 4.5-10KG 1 MES",
      "descripcion": "Descubra un mundo de protección sin igual contra pulgas y garrapatas con Bravecto 1-Month Chewable for Dogs. Específicamente diseñado con el ingrediente activo fluralaner, este tratamiento oral asegura un escudo de un mes de duración para los perros contra las infestaciones de pulgas y garrapatas dañinas. Adecuado para perros y cachorros a partir de 8 semanas de edad y un peso igual o superior a 2 kg.\n\n¿Por qué elegir Bravecto 1-Month Chew?\nMáxima comodidad: Más fácil, más limpio y más cómodo que los tratamientos puntuales tradicionales.\nDosis única mensual: Una dosis oral cada mes mantiene a su compañero canino libre de pulgas y garrapatas.\nSin aislamiento: Las mascotas tratadas no necesitan estar separadas, a diferencia de lo que ocurre con algunos tratamientos puntuales.\nAdecuado para mascotas en crecimiento: La fórmula mensual satisface las necesidades de su mascota en crecimiento.\nFórmula potente: Fluralaner actúa sobre el sistema nervioso de pulgas y garrapatas, garantizando su rápida eliminación.<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"437\" style=\"width: 328pt;\"><colgroup><col width=\"437\" style=\"mso-width-source:userset;mso-width-alt:15530;width:328pt\"><\/colgroup><tbody>\n<\/tbody><\/table>",
      "caracteristicas": "<ul><li>Cómodo y sin complicaciones: A diferencia de los tratamientos puntuales tradicionales, Bravecto es fácil de administrar sin complicaciones.\n<br><\/li><li>Dosificación mensual: Una sola masticación proporciona protección completa durante todo un mes, eliminando la necesidad de aplicaciones frecuentes.\n<br><\/li><li>Seguro para todos los perros: No es necesario aislar a su perro después del tratamiento. Es seguro para su mascota para estar alrededor de otros inmediatamente.\n<br><\/li><li>Fórmula eficaz: Fluralaner ataca y elimina rápidamente pulgas y garrapatas al alterar su sistema nervioso.\n<br><\/li><li>Ideal para cachorros en crecimiento: Adecuado para cachorros jóvenes y perros en crecimiento, proporcionando una protección continua a medida que se desarrollan.<\/li><\/ul>",
      "sku": "19255",
      "unidad_medida": "unidad",
      "precio": 140.00,
      "precio_con_descuento": 140.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 19,
      "nombre": "BRAVECTO MEDIUM 200MG 10-20KG 1 MES",
      "descripcion": "Bravecto Chew de MSD es la tableta masticable para el control de infestaciones causadas por parásitos externos, una solución casi inmediata y un efecto residual que mantiene la protección tiempo después de la aplicación. Bravecto Chew es de amplio espectro y proporciona protección contra garrapatas (adultas y juveniles), pulgas y ácaros de la sarna demodécica, sarcóptica e infestaciones por ácaros Otodectes spp, su presentación en forma de tableta masticable palatable de dosis única hace que su administración sea fácil y sin complicaciones. El fluralaner, su compuesto activo es una molécula de vanguardia perteneciente a la familia de las Isoxazolinas que actúa en los canales de cloruro del sistema nervioso de los artrópodos y proporciona un 100% de eficacia, y 1 mes de protección\n\nBravecto Chew Protección Inmediata y Duradera para Perros Pequeños. Diseñado específicamente para perros de 10 a 20 kg, Bravecto Chew es la respuesta técnica y confiable para el control de infestaciones de parásitos externos. Esta tableta masticable de amplio espectro combate garrapatas, pulgas y ácaros, incluyendo las infestaciones por ácaros Otodectes spp. Su eficacia es de larga duración, manteniendo a tu compañero peludo protegido sin complicaciones.",
      "caracteristicas": "<ul><li>Bravecto Chew es una tableta masticable antiparasitaria externa de dosis única para perros adultos.\n<br><\/li><li>Ayuda a eliminar huevos, larvas y pulgas adultas, rompiendo todo el ciclo de la pulga, además de ácaros y garrapatas.\n<br><\/li><li>Controla inmediatamente infestaciones por ectoparásitos y protege por 12 semanas post aplicación.\n<br><\/li><li>Perfecta para el control de pulgas en caninos (Ctenocephalides feliz y Ctenocephalides canis).\n<br><\/li><li>Eficaz contra garrapatas adultas y juveniles (Ixodes spp., Dermacentor spp. y Rhipicephalus sanguineus).\n<br><\/li><li>Controla las infestaciones por ácaros(Otodectes spp) y los causantes de sarna demodécica y sarcóptica.\n<br><\/li><li>No utilizar en cachorros de menos de 8 semanas de vida y\/o perros que pesen menos de 2 kg.<\/li><\/ul>",
      "sku": "19256",
      "unidad_medida": "unidad",
      "precio": 145.00,
      "precio_con_descuento": 145.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 20,
      "nombre": "BRAVECTO LARGE 400MG 20-40KG 1 MES",
      "descripcion": "Descubra un mundo de protección sin igual contra pulgas y garrapatas con Bravecto 1-Month Chewable for Dogs. Específicamente diseñado con el ingrediente activo fluralaner, este tratamiento oral asegura un escudo de un mes de duración para los perros contra las infestaciones de pulgas y garrapatas dañinas. Adecuado para perros y cachorros a partir de 8 semanas de edad y un peso igual o superior a 2 kg.",
      "caracteristicas": "<ul><li>Eficacia Garantizada: Elimina infestaciones de pulgas (Ctenocephalides felis) y garrapatas (Rhipicephalus sanguineus) rápidamente, asegurando un hogar libre de estos parásitos indeseables.\n<br><\/li><li>Control de Ácaros: También combate los ácaros causantes de la sarna demodécica y ácaros del oído, ayudando a mantener la piel de tu perro en óptimas condiciones.\n<br><\/li><li>Fácil de Administrar: Su delicioso sabor a hígado de cerdo asegura que tu mascota lo acepte sin problemas, pudiendo mezclarse con su comida si es necesario.<\/li><\/ul>",
      "sku": "19257",
      "unidad_medida": "unidad",
      "precio": 156.00,
      "precio_con_descuento": 156.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 21,
      "nombre": "BRAVECTO 112.5 MG (2-4.5 KG)",
      "descripcion": "Protege a tu perro mini de infestaciones de pulgas y garrapatas con la Tableta Masticable Antipulgas y Garrapatas, Perros Mini - Bravecto. Este tratamiento innovador proporciona una protección prolongada de hasta 12 semanas con una sola dosis, eliminando rápidamente los parásitos y previniendo nuevas infestaciones. Con fluralaner, una molécula de la familia de las isoxazolinas, Bravecto ofrece un control duradero y efectivo en perros de tamaño mini.",
      "caracteristicas": "<ul><li>Fluralaner como ingrediente activo: Parasiticida eficaz de la familia de las isoxazolinas.\n<br><\/li><li>Protección de larga duración de 12 semanas: Controla varias especies de garrapatas y pulgas con un solo tratamiento.\n<br><\/li><li>Tableta masticable: Fácil de administrar y bien aceptada por los perros mini.\n<br><\/li><li>Para perros de tamaño mini: Formulado específicamente para perros de este tamaño.<\/li><\/ul>",
      "sku": "8713184134349",
      "unidad_medida": "unidad",
      "precio": 414.00,
      "precio_con_descuento": 414.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 22,
      "nombre": "BRAVECTO 500 MG (10 -20)",
      "descripcion": "Antipulgas y garrapatas Bravecto\nBravecto para perros de 10 a 20 kg es un comprimido masticable que está indicado para el tratamiento de las infestaciones por garrapatas y pulgas, proporcionando 3 meses de protección.\nUn solo comprimido masticable de Bravecto tiene una eficacia de 12 a 3 meses, casi tres veces más que las soluciones normales del mercado.\nBravecto comienza a actuar 2 horas después de la ingestión para matar las pulgas y controlar las garrapatas.\nBravecto debe administrarse por vía oral en una sola dosis cada 12 semanas, según la dosis y el peso del perro. El tratamiento con Bravecto puede comenzar en cualquier momento del año y continuar durante todo el año, sin interrupción, para garantizar que tu perro esté libre de pulgas y garrapatas.\nPrecauciones:\n- Mantenga el producto en su embalaje original hasta su uso, para evitar que los niños tengan acceso directo al producto;\n- No coma, beba ni fume mientras manipule el producto;\n- Lávese bien las manos con agua y jabón inmediatamente después de usar el producto;\n- Los restos del producto o del embalaje vacío deben desecharse correctamente, de acuerdo con las normas locales requisitos;\n- Este producto no debe usarse para tratar cachorros de perros menores de 8 semanas.",
      "caracteristicas": "<li data-start=\"83\" data-end=\"110\">Laboratorio: Bravecto<\/li><li data-start=\"111\" data-end=\"127\">Marca: MSD<\/li><li data-start=\"128\" data-end=\"185\">Modelo: Antipulgas y Garrapatas Bravecto 10 a 20 kg<\/li><li data-start=\"186\" data-end=\"222\">Línea: Comprimidos Mastigáveis<\/li><li data-start=\"223\" data-end=\"241\">Color: Verde<\/li><li data-start=\"242\" data-end=\"274\">Cantidad de comprimidos: 1<\/li><li data-start=\"275\" data-end=\"304\">Peso de la unidad: 40 g<\/li><li data-start=\"305\" data-end=\"339\">Volumen de la unidad: 500 mL<\/li><li data-start=\"340\" data-end=\"370\">Formato de venta: Unidad\n<li data-start=\"407\" data-end=\"464\">Mascota recomendada: Antiparasitarios para mascotas<\/li><li data-start=\"465\" data-end=\"503\">Peso mínimo de la mascota: 10 kg<\/li><li data-start=\"504\" data-end=\"542\">Peso máximo de la mascota: 20 kg<\/li><li data-start=\"543\" data-end=\"631\">Rango de peso de la mascota: 0 (generalmente no aplicable a este tipo de producto)\n<li data-start=\"657\" data-end=\"700\">Tipo de parásitos: Pulgas, Garrapatas<\/li><li data-start=\"701\" data-end=\"740\">Formato del tratamiento: Pastilla<\/li><li data-start=\"741\" data-end=\"785\">Rango máximo de funcionamiento: 0.1 cm<\/li><li data-start=\"786\" data-end=\"830\">Mínima duración del efecto: 12 semanas<\/li><li data-start=\"831\" data-end=\"853\">Es ajustable: Sí<\/li><li data-start=\"854\" data-end=\"885\" data-is-last-node=\"\">Es resistente al agua: Sí<br><\/li><\/li><\/li>",
      "sku": "8713184135285",
      "unidad_medida": "unidad",
      "precio": 460.00,
      "precio_con_descuento": 460.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 23,
      "nombre": "BRAVECTO 1000 MG (20-40 KG)",
      "descripcion": "Bravecto® Large Antipulgas y Garrapatas (20 - 40 KG): Protege a tu perro con la eficacia de Bravecto, una solución innovadora que combate pulgas y garrapatas de manera efectiva y duradera. Este antiparasitario contiene Fluralaner, un compuesto que actúa en el sistema nervioso de los parásitos, asegurando una protección inmediata y de larga duración durante 12 semanas.",
      "caracteristicas": "<li data-start=\"124\" data-end=\"213\">Elimina garrapatas (Ixodes y Dermacentor) y pulgas (Ctenocephalides) de forma efectiva.<\/li><li data-start=\"216\" data-end=\"267\">Garantiza que tu perro se sienta cómodo y seguro.\n<li data-start=\"305\" data-end=\"407\">Bravecto provee protección contra enfermedades transmitidas por garrapatas, como la Babesia canis.<\/li><li data-start=\"410\" data-end=\"465\">Acción rápida que impide la transmisión de patógenos.\n<!--StartFragment--><li data-start=\"497\" data-end=\"600\">Presentación en forma de tableta masticable, generalmente bien aceptada por la mayoría de los perros.<\/li><li data-start=\"603\" data-end=\"675\" data-is-last-node=\"\">Puede administrarse junto con su alimento o directamente en su hocico.<br><\/li><\/li><\/li>",
      "sku": "8713184135292",
      "unidad_medida": "unidad",
      "precio": 480.00,
      "precio_con_descuento": 480.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 24,
      "nombre": "BRAVECTO 1400 MG (40 -56 KG)",
      "descripcion": "<div>Bravecto es para perros con un peso de 40kg - 56kg. Contiene Fluralaner, molécula nueva perteneciente a la familia de las ISOXAZOLINAS, son una nueva clase de parasiticidas. Para el control de infestaciones por garrapatas y pulgas en perros con actividad inmediata y de larga duración durante 12 semanas.<\/div><div><br><\/div>Desparasitante externo para perros\nComprimidos masticables para el tratamiento de infestación por garrapatas y pulgas en los perros, proporcionando 12 semanas de protección.\nEste producto veterinario es un insecticida y acaricida sistémico con acción de larga duración, que promueve la inmediata y persistente eficacia por 12 semanas contra las garrapatas y pulgas.\nInicia su acción a partir de las 2 horas, obteniendo su máxima eficacia a las 8 horas contra pulgas y 12 horas contra garrapatas.\nEl producto controla eficazmente las poblaciones de pulgas en el ambiente y en las áreas a las que el perro tiene acceso.\nPuede usarse como parte de una estrategia de tratamiento para la dermatitis alérgica a la picadura de pulga. Bravecto es eficaz independientemente de la frecuencia de baños.\nDosis y administración: Vía oral, dependiendo el peso corporal del perro; 1 tableta cada 12 semanas.\nConsulte a su médico veterinario antes de usar este producto.<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"437\" style=\"width: 328pt;\"><colgroup><col width=\"437\" style=\"mso-width-source:userset;mso-width-alt:15530;width:328pt\"><\/colgroup><tbody>\n<\/tbody><\/table>",
      "caracteristicas": "<ul><li>Fácil de administrar\n<br><\/li><li>Muy agradable, bien aceptado por la mayoría de los perros.\n<br><\/li><li>Es seguro para su uso en perros de cría, embarazadas y lactantes.\n<br><\/li><li>Para su uso en perros a partir de 8 semanas de edad y más de 2 kg de peso corporal\n<br><\/li><li>Se puede administrar durante todo el año.<\/li><\/ul>",
      "sku": "8713184141408",
      "unidad_medida": "unidad",
      "precio": 700.00,
      "precio_con_descuento": 700.00,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": false,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
    {
      "id": 25,
      "nombre": "BRAVECTO SPOT ON CAT 112.5 MG (1.2-2.8 KG)",
      "descripcion": "Antiparasitario Pipeta BRAVECTO para Gatos de 1.2 kg a 2.8 kg.\n\nEs una solución tópica de fácil aplicación para el tratamiento de infestaciones por pulgas, garrapatas y ácaros (otodectes cynotis) en gatos, brindando protección de 12 semanas continuas. Posee un alto nivel de seguridad y absorción transdermal.\n\nLos sachets solo deben abrirse inmediatamente antes de usar.\n\nMODO DE ACCION:\n\nFluralaner es un antiparasitario de acción sistémica perteneciente a la clase isoxazolinas. Fluralaner es un potente inhibidor del sistema nervioso de los artrópodos. Actúa antagonizando los canales de cloro estimulados por ligandos, receptores GABA ( ácido gamma aminobutírico) y receptores glutamato.\n\nPara gatos de más de 12,5 kg de peso, se recomienda utilizar una combinación de dos pipetas que se ajuste lo más posible al peso del animal.\n\nMétodo de administración:\nPaso 1: Inmediatamente antes de usar, abra el sobre y saque la pipeta. Ésta debe sostenerse en posición vertical (la punta hacia arriba) por la base o por la parte rígida superior debajo de la tapa. La tapa debe rotarse completamente en el sentido de las manecillas del reloj o en sentido contrario a éstas. La tapa se mantendrá adherida a la pipeta; no es posible desprenderla. La pipeta estará abierta y lista para usarse cuando sienta que el sello se ha roto.\n\nPaso 2: Para facilitar la aplicación, el gato debe estar de pie o echado con la espalda colocada horizontalmente. Coloque la punta de la pipeta en la base del cráneo del gato.\n\nPaso 3: Presione suavemente la pipeta y aplique todo el contenido de la solución sobre la piel del gato. El producto debe aplicarse en un sólo punto en la base del cráneo en gatos de hasta 2.8 kg de peso.<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"437\" style=\"width: 328pt;\"><colgroup><col width=\"437\" style=\"mso-width-source:userset;mso-width-alt:15530;width:328pt\"><\/colgroup><tbody>\n<\/tbody><\/table>",
      "caracteristicas": "<ul><li>Laboratorio: Zoetis<br><\/li><li>Marca: Bravecto<br><\/li><li>Modelo: Antipulgas<br><\/li><li>Volumen de la unidad: 0.4 mL<br><\/li><li>Formato del tratamiento: Pipeta<br><\/li><li>Mascota recomendada: Gatos<br><\/li><li>Peso mínimo de la mascota: 1.2 kg<br><\/li><li>Peso máximo de la mascota: 2.5 kg<br><\/li><li>Rango de peso de la mascota: 1.2 - 2.8 kg<br><\/li><li>Tipo de parásitos: Pulgas<br><\/li><li>Mínima duración del efecto: 12 semanas<br><\/li><li>Es resistente al agua: Sí<\/li><\/ul>",
      "sku": "8713184189981",
      "unidad_medida": "unidades",
      "precio": 559.13,
      "precio_con_descuento": 559.13,
      "marca": this.brands.find(brand => brand.id === 4)!,
      "es_destacado": true,
      stock: 100,
      media: [
        {
          id: 0,
          nombre: '',
          media_url: '',
        }
      ],
      sucursales: [],
      contiene_promocion: false,
      categorias: [
        {
          "id": 4,
          "nombre": "FARMAPET",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
        {
          "id": 6,
          "nombre": "Antipulgas",
          "media": {
            id: 0,
            nombre: '',
            media_url: '',
          },
        },
      ]
    },
  ];

  constructor(
    private _brandsRepo: BrandsRepo,
    private _productsRepo: ProductsRepo,
    private _categoriesRepo: CategoriesRepo,
    private _loadingService: LoadingService,
    private _themeService: ThemeService,
    private _router: Router
  ) {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  ngOnInit() {
    this._themeService.init();
    this.theme = this._themeService.theme;
    this._loadData();
  }

  toggleTheme() {
    const THEME = (this._themeService.theme === 'light-theme') ? 'dark-theme' : 'light-theme';
    this._themeService.set(THEME);
    this.theme = THEME;
  }

  private _loadData() {
    this._loadingService.show();
    this._brandsRepo.setBrands(this.brands);
    this._categoriesRepo.setCategories(this.categories);
    this._productsRepo.setProducts(this.products);

    setTimeout(() => {
      this._loadingService.hide();
    }, 3000);
  }
}
