import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../../services/shared-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { BoardState } from '../../../../ngrx/board/board.reducer';
import * as PostActions from '../../../../ngrx/list/list.actions'


@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss'
})
export class AddListComponent {
  private readonly store:Store<BoardState> = inject(Store)

  @Input() lists: any;
  @Input() editable: boolean = false;
  @Input() list: any;
  @Input() board: any;
  listForm: FormGroup;

  constructor(
    private sharedService: SharedService, 
    )
    {
    this.listForm = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.maxLength(15)]),
      cardsId: new FormControl([])
    })
  }

  onClick() {
    if(this.editable){
      this.sharedService.toggleisEditableList();
    }
    this.sharedService.toggleIsVisibleCreateList();
  }

  onSubmitCreateList(){
    if(this.listForm.valid){
      const jsonData = JSON.stringify(this.listForm.value);
      this.store.dispatch(PostActions.postListApi({ boardId: this.board.id, list: jsonData }))
    }    
  }

  onSubmitEditList(){
    if(this.listForm.valid){
      this.list = this.sharedService.getList();
      this.list.title = this.listForm.get('title')?.value;
      
      this.store.dispatch(PostActions.patchListApi({
        listId: this.list.id,
        boardId: this.board.id,
        listTitle: this.listForm.get('title')?.value
      }))
  
      this.sharedService.toggleisEditableList();
      this.sharedService.toggleIsVisibleCreateList();
    }
    
  }

  ngOnInit() {
    this.sharedService.isEditableList$.subscribe(value => {
      this.editable = value; 
    });
  }
  
}