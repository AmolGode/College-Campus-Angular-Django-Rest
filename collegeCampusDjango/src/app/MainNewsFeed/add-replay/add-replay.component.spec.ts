import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReplayComponent } from './add-replay.component';

describe('AddReplayComponent', () => {
  let component: AddReplayComponent;
  let fixture: ComponentFixture<AddReplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
