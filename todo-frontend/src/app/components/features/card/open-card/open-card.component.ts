import { Component, Input, Output } from '@angular/core';
import { SharedService } from '../../../../services/shared-service.service';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../core/banner/banner/banner.component';

@Component({
  selector: 'app-open-card',
  standalone: true,
  imports: [
    BannerComponent,
     CommonModule
    ],
  templateUrl: './open-card.component.html',
  styleUrl: './open-card.component.scss'
})
export class OpenCardComponent {

  constructor(private sharedService: SharedService, private apiService: ApiService){}
  @Input() isChoose: boolean = false;
  @Input() isVisible: boolean = true;
  @Input() card: any;
  @Input() data: any;
  @Input() list: any;
  @Output() history: any;

  
  onClick() {
    this.sharedService.toggleIsVisibleCard();
  }


  onClickEditCard(){
    this.sharedService.toggleIsVisibleEditCard();
    this.sharedService.toggleIsVisibleCard();
    this.sharedService.toggleisEditableCard();
    this.sharedService.setCard(this.card);
    this.sharedService.setList(this.list);
  }
  
  onClickPatch(anotherList: any){
    
  }

  ngOnInit() {
    this.sharedService.isVisibleCard$.subscribe(value => {
      this.isVisible = value; 
    });

    this.sharedService.isChooseCardHistory$.subscribe(value =>{
      this.isChoose = value;
    })

}


ngDoCheck(): void {
  if(this.isVisible){
    this.card = this.sharedService.getCard();
    this.data = this.sharedService.getData();
    this.list = this.sharedService.getList();
    this.history = this.sharedService.getHistory().slice().reverse();
  }
}


  
  
}

