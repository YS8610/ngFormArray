import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Learner Bike';
  bikeForm !: FormGroup;

  cond = ["good", "neutral", "bad"];
  no !: number;
  condition ="good";
  comment !: string;
  isEdit = false;
  bikesInfo : {no: string, condition : string, comment: string}[] =[];
  bikeRecords = ""; //key name for localStorage
  editInd !: number;
  page = "All";

  constructor(private fb : FormBuilder){
    if (localStorage.getItem(this.bikeRecords)){
      this.bikesInfo = JSON.parse( <string>localStorage.getItem(this.bikeRecords) )
    }
  }

  ngOnInit(){
    this.bikeForm = this.fb.group({
      bikes : this.fb.array([
        this.fb.group({
          no : ["",Validators.required],
          condition : ["good",Validators.required],
          comment : [""]
        })
      ])
    });
  }

  get bikes(){
    return this.bikeForm.controls["bikes"] as FormArray;
  }

  onAddBike(){
    const bike = this.fb.group({
      no : ["",Validators.required],
      condition : ["good",Validators.required],
      comment : [""]
    })
    this.bikes.push(bike);
  }

  onsubmit(){
    // console.log(this.bikes);
    this.bikes.controls.forEach(
      (element, index) => {
        this.bikesInfo.push(element.value);
        // console.log(element.value);
      })

      this.bikeForm.reset();
      this.bikeForm = this.fb.group({
        bikes : this.fb.array([
          this.fb.group({
            no : ["",Validators.required],
            condition : ["good",Validators.required],
            comment : [""]
          })
        ])
      });
      this.saveBikesInfo(this.bikesInfo);
  }

  onDelete(i:number){
    this.bikes.removeAt(i);
  }

  onDeleteAll(){
    this.bikesInfo = [];
    localStorage.removeItem(this.bikeRecords);
  }

  onDeleteSaved(i:number){
    this.bikesInfo.splice(i,1);
    // console.log(i);
    this.saveBikesInfo(this.bikesInfo);
  }

  onEditSaved(i:number){
    this.isEdit = true;
    // console.log(this.bikesInfo[i]);
    this.editInd = i;
    this.bikeForm = this.fb.group({
      bikes : this.fb.array([
        this.fb.group({
          no : [this.bikesInfo[i].no,Validators.required],
          condition : [this.bikesInfo[i].condition,Validators.required],
          comment : [this.bikesInfo[i].comment]
        })
      ])
    });
  }

  onEditUpdate(){
    // console.log(this.bikes.value[0].no);
    this.bikesInfo[this.editInd].no = (this.bikes.value[0]).no;
    this.bikesInfo[this.editInd].condition = (this.bikes.value[0]).condition;
    this.bikesInfo[this.editInd].comment = (this.bikes.value[0]).comment;

    this.bikeForm.reset();
    this.isEdit = false;
    this.saveBikesInfo(this.bikesInfo);
  }


  saveBikesInfo( bikeinfo: {no: string, condition : string, comment: string}[] ):void {
    localStorage.setItem( this.bikeRecords, JSON.stringify(bikeinfo) );
  }

  onAllPage(){
    this.page = "All";
  }

  onGoodPage(){
    this.page = "Good";
  }

  onNeutralPage(){
    this.page = "Neutral";
  }

  onBadPage(){
    this.page = "Bad";
  }

  onSharePage(){
    this.page = "Share";
  }

  onCopy(){
    let goodString = "Good Bikes\n";
    let neutralString = "\nNeutral Bikes\n";
    let badString = "\nBad Bikes\n";

    this.bikesInfo.forEach( (info) =>{
      if (info.condition=="good"){
        goodString += info.no+": "+ info.comment+"\n";
      }
      else if (info.condition=="neutral"){
        neutralString += info.no+": "+ info.comment+"\n";
      }
      else{
        badString += info.no+": "+ info.comment+"\n";
      }
    })
    const dateString = new Date().toLocaleString();
    const website = "https://app.arcanetrading.co/bikereport/"
    const copyString = goodString+neutralString+badString+ "\n\nGenerated on: "+ dateString + "\n" + website;
    console.log(copyString);
    navigator.clipboard.writeText(copyString).then(function() {
      console.log("copy successfully");
    }, function() {
      /* clipboard write failed */
      console.log("copy failed");
    });
  }
}
