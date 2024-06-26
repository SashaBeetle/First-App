import { Component, EventEmitter, input, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CardComponentComponent } from '../card-component/card-component.component';
import { AddListComponent } from '../add-list/add-list.component';
import { SharedServiceService } from '../../services/shared-service.service';
import { ApiService } from '../../services/api.service';
import { AddCardComponent } from '../add-card/add-card.component';
import { OpenCardComponent } from '../open-card/open-card.component';


@Component({
  selector: 'app-list-component',
  standalone: true,
  imports: [
    CardComponentComponent,
    AddListComponent,
    OpenCardComponent,
    AddCardComponent
  ],
  templateUrl: './list-component.component.html',
  styleUrl: './list-component.component.scss'
})
export class ListComponentComponent implements OnChanges {

  @Input() isVisible: boolean = false;
  @Output() data: any;

  isAddListVisible: boolean = true;


  constructor(
    private sharedService: SharedServiceService,
    private apiService: ApiService
  ){}



  onClickEdit(list: any) {
    this.sharedService.toggleIsVisibleCreateList();
    this.sharedService.toggleisEditableList();
    this.sharedService.setList(list);
  }

  onClickAddList(){
    this.sharedService.toggleIsVisibleCreateList();
  }

  onClickAddCard(list: any) {
    this.sharedService.toggleIsVisibleEditCard();
    this.sharedService.setList(list);
  }

  onClickDeleteList(listId: number){
    this.apiService.deleteDataById("https://localhost:7247/api/catalog",listId).subscribe(res=>{
      console.log('ListN:', listId);
      const index = this.data.findIndex((item: { id: number; }) => item.id === listId);
        if (index !== -1) {
          this.data.splice(index, 1);
          console.log(this.data);
        }
    })
  }

  sortDataByTitle(data: any[]): any[] {
    return data.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('Data updated:', this.data);
    }
    console.log('Works');

  }
  
  async ngOnInit(){
    this.sharedService.isVisibleCreateList$.subscribe(value => {
      this.isVisible = value; 
    });

    this.apiService.getData("https://localhost:7247/api/catalog").subscribe(res =>{
      console.log(res); 
      this.data = res;
      this.sortDataByTitle(this.data);
      
    }); 
  }

  ngDoCheck(): void {
    if(this.data.length == 4){
      this.isAddListVisible = false;
      console.log('List',this.isAddListVisible)
    }else{      
      this.isAddListVisible = true;
    }
    
    
  }
}


