import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedServiceService } from '../../services/shared-service.service';
import { OpenCardComponent } from '../open-card/open-card.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-component',
  standalone: true,
  imports: [OpenCardComponent, CommonModule],
  templateUrl: './card-component.component.html',
  styleUrl: './card-component.component.scss'
})
export class CardComponentComponent {
  @Input() cardId: any;
  @Input() list: any;
  @Input() data: any;
  @Input() history:any;

  sharedData: any;
  card: any;
    


  constructor(
    private sharedService: SharedServiceService, 
    private apiService: ApiService,
  ){}

  onClickOpenCard() {
    this.sharedService.toggleIsVisibleCard();
    this.sharedService.setCard(this.card);
    this.sharedService.setData(this.data);
    this.sharedService.setList(this.list);

    this.apiService.getData(`https://localhost:7247/api/HistoryItem/ForCard${this.card.id}`)
    .subscribe(response => {
      this.history = response;
      this.sharedService.setHistory(response);
      console.log('Get request successful!', this.history);
    }, error => {
      console.error('Error Getting data:', error);
    });



    
    
  }

  onClickDelete(){
    this.apiService.deleteDataById(`https://localhost:7247/api/cards`, this.cardId).subscribe(res=>{
      this.removeFromList(this.cardId)
    })
  }

  onClickPatch(anotherList: any){
    this.apiService.patchData(`https://localhost:7247/api/catalog/MoveCard?catalogId_1=${this.list.id}&catalogId_2=${anotherList.id}&cardId=${this.cardId}`, 1)//json into(cardId, catalogId, catalogId)
      .subscribe(response => {
        this.swapCard(this.cardId, anotherList);
        console.log('Patch request successful!', response);
      }, error => {
        console.error('Error patching data:', error);
      });

  }

  swapCard(card: number, anotherList: any) {
    this.removeFromList(card);
    anotherList.cardsId.push(this.cardId);
    }
  



  async ngOnInit(){
    this.apiService.getData(`https://localhost:7247/api/cards/${this.cardId}`).subscribe(res =>{
      this.card = res;
    });
}

removeFromList(cardId: number) {
  const index = this.list.cardsId.findIndex((item: number) => item === cardId);
  if (index !== -1) {
    this.list.cardsId.splice(index, 1);
  } else {
    console.warn('Card not found in local list:', cardId);
  }
}
}

