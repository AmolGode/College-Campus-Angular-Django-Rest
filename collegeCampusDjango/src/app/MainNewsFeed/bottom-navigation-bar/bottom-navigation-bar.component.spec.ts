import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomNavigationBarComponent } from './bottom-navigation-bar.component';

describe('BottomNavigationBarComponent', () => {
  let component: BottomNavigationBarComponent;
  let fixture: ComponentFixture<BottomNavigationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomNavigationBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
