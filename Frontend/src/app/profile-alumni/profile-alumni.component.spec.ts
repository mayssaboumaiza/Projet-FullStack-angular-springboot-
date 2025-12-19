import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAlumniComponent } from './profile-alumni.component';

describe('ProfileAlumniComponent', () => {
  let component: ProfileAlumniComponent;
  let fixture: ComponentFixture<ProfileAlumniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAlumniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAlumniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
