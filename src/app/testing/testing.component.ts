import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  companyForm !:FormGroup;

  constructor(private fb: FormBuilder) { }



  ngOnInit(): void {
    // this.companyForm = this.fb.group({
    //   companyName: new FormControl('', [Validators.required]),
    //   admins: this.fb.array([])
    // })
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      admins: this.fb.array([])
    })

  }

  get admins() {
    return this.companyForm.controls["admins"] as FormArray;
  }

  addNewAdmin(){
    const admin = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email] ]
    });
    this.admins.push(admin);
  }

}
