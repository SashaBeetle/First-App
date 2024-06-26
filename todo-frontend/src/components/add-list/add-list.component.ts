import { Component, Input } from '@angular/core';
import { SharedServiceService } from '../../services/shared-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss'
})
export class AddListComponent {
  
  @Input() data: any;
  @Input() editable: boolean = false;
  @Input() list: any;
  listForm: FormGroup;

  constructor(private sharedService: SharedServiceService, private apiService: ApiService){
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
      this.apiService.postData('https://localhost:7247/api/catalog', jsonData) 
        .subscribe(response => {
          this.listForm.value.id = response.id;
          this.data.push(this.listForm.value)
          console.log('Form submitted successfully!', jsonData);
        }, error => {
          console.error('Error submitting form:', error, jsonData);
        });
    }    
  }

  onSubmitEditList(){
    if(this.listForm.valid){
      this.list = this.sharedService.getList();
      this.list.title = this.listForm.get('title')?.value;
  
      this.apiService.patchData(`https://localhost:7247/api/catalog/${this.list.id}?title=${this.list.title}`,1)
        .subscribe(response => {
          console.log('Patch request successful!', response);
        }, error => {
          console.error('Error patching data:', error);
        });
  
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
