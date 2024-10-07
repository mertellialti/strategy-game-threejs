import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  isModalOpen: boolean = false;

  selectedSegment: string = 'castle';

  showMainContent: boolean = true;
  showSingleContent: boolean = true;

  modalContent: any;

  constructor() { }

  applyContent(selectedType: string, ){

  }

  openSettlementModal(){
    this.isModalOpen = true;
    this.selectedSegment = 'settlement';
    this.showMainContent = true;
    this.showSingleContent = false;
  }

  openBaseModal(){
    this.isModalOpen = true;
    this.selectedSegment = 'castle';
    this.showMainContent = true;
    this.showSingleContent = false;
  }

  openVillageModal(villageData: any){
    this.isModalOpen = true;
    this.selectedSegment = 'castle';
    this.modalContent = villageData;    
    this.showMainContent = false;
    this.showSingleContent = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }
}
