import { FormControl } from "@angular/forms"

export interface Toy {
  _id?: symbol,
  id: number,
  title: string,
  picture: string,
  amount: number,
  year: number,
  shape: string,
  color: string,
  size: string,
  fave: boolean
}

export interface FilterParametrs {
  amountInputMin: number,
  amountInputMax: number,
  yearInputMin: number,
  yearInputMax: number,
  sizes: (string|boolean)[],
  favItem: boolean
}
