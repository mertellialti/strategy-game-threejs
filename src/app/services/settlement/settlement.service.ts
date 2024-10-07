import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  villages: any[] = [];
  bases: any[] = [];
  
  constructor() { }
}
