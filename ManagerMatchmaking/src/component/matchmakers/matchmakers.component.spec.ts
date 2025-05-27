import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchmakersComponent } from './matchmakers.component';

describe('MatchmakersComponent', () => {
  let component: MatchmakersComponent;
  let fixture: ComponentFixture<MatchmakersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchmakersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchmakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
