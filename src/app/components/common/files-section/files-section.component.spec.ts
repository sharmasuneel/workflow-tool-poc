import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSectionComponent } from './files-section.component';

describe('FilesSectionComponent', () => {
  let component: FilesSectionComponent;
  let fixture: ComponentFixture<FilesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
