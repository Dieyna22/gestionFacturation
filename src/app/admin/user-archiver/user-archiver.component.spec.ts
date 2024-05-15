import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserArchiverComponent } from './user-archiver.component';

describe('UserArchiverComponent', () => {
  let component: UserArchiverComponent;
  let fixture: ComponentFixture<UserArchiverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserArchiverComponent]
    });
    fixture = TestBed.createComponent(UserArchiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
