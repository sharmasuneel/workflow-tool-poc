import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGrid } from './grid.component';

describe('GridComponent', () => {
  let component: AppGrid;
  let fixture: ComponentFixture<AppGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppGrid]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
