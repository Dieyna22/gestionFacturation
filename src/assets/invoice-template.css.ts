export const invoiceTemplateCss = `
.containerModele {
  width: 94%;
  margin: 0 auto;
}

.headerNav {
  background-color: #eee;
  padding: 10px 8px;
}

.currentItemNav {
  color: #F97316 !important;
}

.nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav li {
  display: inline;
  margin-right: 20px;
}

.nav li a {
  color: #222;
  text-decoration: none;
  cursor: pointer;
}

.configuration-section {
  margin-top: 20px;
  border: 2px dotted #6b6969;
  padding: 30px;
}

.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.left {
  display: flex;
  align-items: center;
}

.label {
  margin-right: 10px;
}

.right button {
  background-color: #fff;
  color: #F97316;
  border: thin solid #F97316;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.icon {
  font-size: 20px;
  margin-right: 5px;
}

.persoFacture {
  border: 2px dotted #6b6969;
  justify-content: center;
  align-items: center;
  padding: 30px;
  margin: 0 auto;
}

.color-input {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

img {
  width: 110px;
  height: 130px;
}

.modéle {
  border: 2px dotted #6b6969;
  padding: 30px;
  margin: 0 auto;
}

.btnAnnuler {
  background-color: #5c636a !important;
  color: white !important;
}

.btnEnregistrer {
  background-color: #02016F !important;
  color: white !important;
  border: none;
}

.btnDelete i {
  color: white !important;
}





.color-input {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.containerModal {
  .invoice {
    background: #fff;
    width: 100%;
    padding: 50px;
  }

  .logo {
    width: 3.5cm !important;
  }

  .document-type {
    text-align: right;
    color: #444;
  }

  .conditions {
    font-size: 0.7em;
    color: #666;
  }

  .bottom-page {
    font-size: 0.7em;
  }
}

.btnPosition {
  display: flex;
  justify-content: flex-end;
}

.modal {
  z-index: 100000;
}

.modelFacture {
  justify-content: center;
  align-items: center;
  padding: 30px;
  margin: 0 auto;
}


.positionTitre {
  float: right;
}

.invoice-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.invoice-number {
  font-size: 16px;
  color: #777;
}

.invoice-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  margin-bottom: 30px;
}

.invoice-details h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.invoice-details p {
  margin: 5px 0;
}

.invoice-items {
  margin-bottom: 30px;
}

.total-amount {
  text-align: right;
  font-weight: bold;
  color: #2c3e50;
}

.logo-container {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 150px;
  height: 150px;
}

.logo1 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.payment-info {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
  font-size: 14px;
  color: #777;
}

.activemodele {
  border: 2px solid #F97316;
  border-radius: 4px;
  padding: 5px;
}

/* body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

header {
  text-align: center;
  margin-bottom: 20px;
} */

.city-date {
  text-align: right;
}

h1 {
  font-size: 24px;
  margin: 10px 0;
}

.order-details {
  text-align: left;
  margin: 20px 0;
}

.order-details p {
  margin: 5px 0;
}


footer {
  text-align: center;
  margin-top: 20px;
}

footer p {
  color: #0070c0;
}



.new-container header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.new-container header h1 {
  color: #444;
  font-size: 14px;
}

.new-container header .new-logo {
  padding: 10px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.savemodel {
  position: fixed;
  top: 550px;
  left: 0;
  background-color: #fff;
  color: #F19A33;
  height: 45px;
  width: 45px;
  z-index: 9999;
  border: thin solid #F19A33;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.savemodel:hover {
  background-color: #F19A33;
  color: #fff;
}

.document.disabled {
  pointer-events: none;
  opacity: 0.6;
}


.addnewModel {
  background-color: #0070c0;
  color: fff !important;
  font-weight: bold;
  font-size: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 8px 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.configModele {
  border: 2px dotted #6b6969;
  justify-content: center;
  align-items: center;
  padding: 30px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 20px;
  border: 1px dashed #ccc;
  padding: 10px;
  width: 48%;
}

.section-content {
  margin-top: 10px;
}

.signature-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
}

textarea {
  width: 100%;
  height: 100px;
}

.addTof {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  padding: 4px 8px;
}

.titre {
  color: #467aea;
}

.addOption {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.form-section {
  width: 100%;
  height: 280px;
}


.addOption {
  padding: 20px;

  .form-sections-container {
    display: flex;
    gap: 20px;

    .form-column {
      flex: 1;
      min-width: 100%;
    }
  }

  .form-section {
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .section-content {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .signature-box {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px dashed #ccc;
      border-radius: 4px;
      background-color: #f8f9fa;

      .titre {
        cursor: pointer;
        color: #0d6efd;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .form-control {
      margin-top: 0.5rem;
    }

    textarea.form-control {
      min-height: 100px;
    }

    span[style*="cursor: pointer"] {
      color: #0d6efd;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .signature-image {
    height: 35px;
    width: 70px;
  }

  .otherImage{
    width: 100%;
    height: 180px;
  }
  .image-preview {
    position: relative;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 243px;
    width: 70px;
    height: 15px;
    background-color: rgba(0, 0, 0, 0.5);
    /* Bande noire semi-transparente */
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .image-preview:hover .overlay {
    opacity: 1;
  }

  .remove-text {
    color: white;
    font-size: 14px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .form-sections-container {
      flex-direction: column;
    }
  }
}


:root {
  --header-color: #467aea;
}

/* Style pour les cellules d'en-tête */
thead  tr  th{
  background-color: var(--header-color);
  color: white;
}

/* Style pour l'input color */
.color-picker {
  margin: 20px 0;
}

/* Styles de base pour le tableau */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.company-info,
.client-info {
  flex: 1;
}

.client-info {
  text-align: right;
}

.company-info h3,
.client-info h3 {
  color: #000;
  margin: 15px 0;
}

.info-block p {
  margin: 5px 0;
}

.invoice-title {
  margin: 0 0 10px 0;
}

.invoice-number {
  margin: 0 0 30px 0;
}
   .header .left, .header .right { width: 48%; display: inline-block; vertical-align: top; } .header .left { text-align: left; } .header .right { text-align: right; }
`;