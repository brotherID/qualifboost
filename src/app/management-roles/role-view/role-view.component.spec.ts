import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleViewComponent } from './role-view.component';

describe('RoleViewComponent', () => {
  let component: RoleViewComponent;
  let fixture: ComponentFixture<RoleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
