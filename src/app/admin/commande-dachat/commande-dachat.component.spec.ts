import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeDachatComponent } from './commande-dachat.component';

describe('CommandeDachatComponent', () => {
  let component: CommandeDachatComponent;
  let fixture: ComponentFixture<CommandeDachatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeDachatComponent]
    });
    fixture = TestBed.createComponent(CommandeDachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
