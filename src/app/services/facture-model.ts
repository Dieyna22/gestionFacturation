export interface InvoiceModel {
  typeDocument: string; // 'vente', 'devi','livraison','command_vente' ou 'command_achat'
  reprendre_model_vente:boolean;
  typeDesign: string; // 'bloc', 'compact', ou 'photo'
  contenu: string; // Le contenu HTML du modèle
  signatureExpediteurModel: boolean;
  mention_expediteur: string;
  image_expediteur: any;
  signatureDestinataireModel: boolean;
  mention_destinataire: string;
  autresImagesModel: boolean;
  image: any;
  conditionsPaiementModel: boolean;
  conditionPaiement: string;
  coordonneesBancairesModel: boolean;
  titulaireCompte: string;
  banque: string;
  compte: string;
  notePiedPageModel: boolean;
  peidPage: string;
  css: string; // Le contenu css du modèle
}  