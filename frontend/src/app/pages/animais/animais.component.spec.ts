import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { AnimaisComponent } from './animais.component';

describe('AnimaisComponent', () => {
  let component: AnimaisComponent;
  let fixture: ComponentFixture<AnimaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [AnimaisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimaisComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
