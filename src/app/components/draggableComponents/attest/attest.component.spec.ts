import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestComponent } from './attest.component';

describe('AttestComponent', () => {
  let component: AttestComponent;
  let fixture: ComponentFixture<AttestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
