import { Component } from '@angular/core';
import { ModalService } from '../services/modal/modal.service';
// import * as THREE from 'three';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  segmentSelected: string = 'army';
  isCardOpen: boolean = true;

  

  constructor(
    protected modalSrv: ModalService
  ) {
    this.isCardOpen = modalSrv.isModalOpen;
  }

  segmentChanged(event: any) {
    console.log('Segment changed event', event.detail.value);
    this.segmentSelected = event.detail.value;
  }

  // openModal(segment: string) {
  //   this.segmentSelected = segment;
  //   // this.isCardOpen = true;
  //   this.modalSrv.isModalOpen = true;
  //   console.log('Segment', this.segmentSelected, ' isCardOpen: ', this.isCardOpen);
  // }

}
