import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmineEditWorkshopComponent } from './admine-edit-workshop.component';

describe('AdmineEditWorkshopComponent', () => {
  let component: AdmineEditWorkshopComponent;
  let fixture: ComponentFixture<AdmineEditWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmineEditWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmineEditWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
