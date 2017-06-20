export interface IProduct {
  id: number,
  name: string,
  details: string,
  price: number,
  qty? : number,
  img? : string,
  fav?: boolean 

}