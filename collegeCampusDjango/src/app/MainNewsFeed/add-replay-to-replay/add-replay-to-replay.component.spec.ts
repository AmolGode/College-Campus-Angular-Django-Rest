import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReplayToReplayComponent } from './add-replay-to-replay.component';

describe('AddReplayToReplayComponent', () => {
  let component: AddReplayToReplayComponent;
  let fixture: ComponentFixture<AddReplayToReplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReplayToReplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReplayToReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
