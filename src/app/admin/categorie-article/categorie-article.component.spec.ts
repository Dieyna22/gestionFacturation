import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieArticleComponent } from './categorie-article.component';

describe('CategorieArticleComponent', () => {
  let component: CategorieArticleComponent;
  let fixture: ComponentFixture<CategorieArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieArticleComponent]
    });
    fixture = TestBed.createComponent(CategorieArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
