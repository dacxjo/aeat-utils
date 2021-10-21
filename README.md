# AEAT-Utils

AEAT-Utils es una paquete que ayuda a la generación de algunos de los modelos Agencia Estatal de Administración Tributaria Española (AEAT), mediante la lectura e interpretación interna de los diseños de registro de dichos modelos.

## Instalación

```bash
npm install aeat-utils
```

## Modelos soportados

- Modelo 111
- Modelo 115
- Modelo 130
- Modelo 303

## Importación

```node
import { model111, model115, model130, model303 } from 'aeat-utils';
```

o

```node
const { model111, model115, model130, model303 } = require('aeat-utils');
```

## Modo de uso

Se llama a la función del modelo que se quiere generar, devolviendo una promesa:

```node
await model111(data, options);
```

donde:

- data: Objeto que contiene la información del ejercicio, periodo, declarante y las casillas a rellenar. **Cada modelo tiene diferente numero de casillas a rellenar**. Mas adelante se muestran las casillas que se envian para generar cada modelo.
- options: Opciones para la generación del fichero, actualmente hay 2:
  - destionationPath: Ruta absoluta para almacenar el archivo .txt luego del procesamiento. Ej: "uploads/models"
  - asBuffer: Si es **true** no almanena el archivo y en su lugar retorna el contenido del fichero como un Buffer. Por defecto es **false**

```typescript
type ModelOptions = {
  destinationPath?: string;
  asBuffer?: boolean;
};
```

## Datos de cada modelo

#### Datos en común

Todas las funciones para generar los modelos comparten ciertos parámetros que se estructuran de la siguiente manera:

```typescript
interface Model111Input extends ModelInput {
  declarationType: DeclarationType;
  declarant: Declarant;
  fields: {
    field01: string | number;
    field02: string | number;
    ...
  };
}
```

donde

```typescript
type DeclarationType = 'I' | 'U' | 'G' | 'N' | 'C' | 'D' | 'V' | 'X';

interface Declarant {
  name: string;
  lastname: string;
  nif: string;
  iban: string;
}

interface ModelInput {
  exercise: string;
  period: Period;
  version: string;
  devCompanyNIF: string;
}
```

Solamente el campo **fields**, que son los datos que se deben pasar a las funciones, varía en base al tipo de modelo.

#### Casillas para el modelo 111

<details>
  <summary>Click para ver</summary>

- Casilla 01 (field01)
- Casilla 02 (field02)
- Casilla 03 (field03)
- Casilla 07 (field07)
- Casilla 08 (field08)
- Casilla 09 (field09)
</details>

#### Casillas para el modelo 115

<details>
  <summary>Click para ver</summary>

- Casilla 01 (field01)
- Casilla 02 (field02)
- Casilla 03 (field03)
</details>

#### Casillas para el modelo 130

<details>
  <summary>Click para ver</summary>

- Casilla 01 (field01)
- Casilla 02 (field02)
- Casilla 05 (field05)
- Casilla 06 (field06)
- Casilla 13 (field13)
</details>

#### Casillas para el modelo 303

<details>
  <summary>Click para ver</summary>

- Casilla 01 (field01)
- Casilla 02 (field02)
- Casilla 03 (field03)
- Casilla 04 (field04)
- Casilla 05 (field05)
- Casilla 06 (field06)
- Casilla 07 (field07)
- Casilla 08 (field08)
- Casilla 09 (field09)
- Casilla 10 (field10)
- Casilla 16 (field16)
- Casilla 17 (field17)
- Casilla 18 (field18)
- Casilla 19 (field19)
- Casilla 20 (field20)
- Casilla 21 (field21)
- Casilla 22 (field22)
- Casilla 23 (field23)
- Casilla 24 (field24)
- Casilla 28 (field28)
- Casilla 29 (field29)
- Casilla 30 (field30)
- Casilla 31 (field31)
- Casilla 59 (field59)
- Casilla 60 (field60)
- Casilla 78 (field78)
- Casilla 110 (field110)
</details>
<br/>

> Todas las casillas que no se lista, se pondran en blancos, 0 o se calcularán según sea el caso.

# Ejemplo

```typescript
const { model111 } = require('aeat-utils');

const data = {
  exercise: '2021',
  period: '3T',
  version: '0001',
  devCompanyNIF: '00000000N',
  declarationType: 'I',
  declarant: {
    name: 'Foo',
    lastname: 'Bar Foobar',
    nif: '00000000S',
    iban: 'ES0000000000000000000000',
  },
  fields: {
    field01: '0',
    field02: '0',
    field03: '0',
    field07: '3',
    field08: '560.43',
    field09: '230.5',
    // fields pueden ser números también
  },
};
await model111(data, {
  destinationPath: 'uploads/models',
});
```

Al ejecutar el bloque anterior, generará un archivo **111.txt** en el directorio **uploads/models** especificado.

## Build localmente

```bash
  pnpm install && pnpm run build
```

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
