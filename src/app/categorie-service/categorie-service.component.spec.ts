import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieServiceComponent } from './categorie-service.component';

describe('CategorieServiceComponent', () => {
  let component: CategorieServiceComponent;
  let fixture: ComponentFixture<CategorieServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieServiceComponent]
    });
    fixture = TestBed.createComponent(CategorieServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
