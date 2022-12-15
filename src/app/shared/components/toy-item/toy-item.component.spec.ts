import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToyItemComponent } from './toy-item.component';

describe('ToyItemComponent', () => {
  let component: ToyItemComponent;
  let fixture: ComponentFixture<ToyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToyItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
