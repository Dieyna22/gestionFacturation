import { Component, Renderer2 } from '@angular/core';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent {
  isChecked: boolean = false;
  titre: string = 'Facture';

  // Gestion bouton
  boutonActif = 1;

  //model active
  modelActif = 1;

  // Initialiser le contenu actuel
  currentContent: string = 'facture';

  ngOnInit(): void {
    this.listeInfoSup();
  }

  // Mettre à jour le contenu actuel
  showComponant(contentId: string): void {
    this.currentContent = contentId;
    this.titre = contentId;
  }
  currentModel: string = 'bloc'

  // Mettre à jour le modèle actuel
  showModel(modelId: string): void {
    this.currentModel = modelId;
  }
  color: string = '#467aea';

  onColorChange() {
    this.updateTableHeaderColor();

  }
  private updateTableHeaderColor() {
    const theadCells = document.querySelectorAll('thead tr th');
    const titreZone = document.querySelector('h1')
    theadCells.forEach((cell: any) => {
      this.renderer.setStyle(cell, 'background-color', this.color);
      this.renderer.setStyle(cell, 'color', 'white')
    });
  }

  constructor(private renderer: Renderer2, private userService:UtilisateurService) {
    this.currentDate = this.getCurrentDate();
  }

  currentDate: string;


  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString();
  }

  InfoSup: any;
  listeInfoSup() {
    this.userService.getAllInfoSup().subscribe(
      (infoSup: any) => {
        this.InfoSup=infoSup.user;
        console.log(this.InfoSup)
      },
      (err) => {
      }
    )
  }

  showConfig:boolean=false;
  onshowConfig(){
    this.showConfig = !this.showConfig;
  }

}
