import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropWrapperContainerComponent } from './drop-wrapper-container.component';

describe('DropWrapperContainerComponent', () => {
  let component: DropWrapperContainerComponent;
  let fixture: ComponentFixture<DropWrapperContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropWrapperContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropWrapperContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
