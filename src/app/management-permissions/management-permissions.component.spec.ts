import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPermissionsComponent } from './management-permissions.component';

describe('ManagementPermissionsComponent', () => {
  let component: ManagementPermissionsComponent;
  let fixture: ComponentFixture<ManagementPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
