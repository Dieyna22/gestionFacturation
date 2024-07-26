import { Component } from '@angular/core';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.css']
})
export class DepenseComponent {


boutonActif=1;
currentDoc : string = 'c'
showTypeDocument(docId:string):void{
 this.currentDoc=docId
}
}
