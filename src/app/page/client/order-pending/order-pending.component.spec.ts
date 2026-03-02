import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPendingComponent } from './order-pending.component';

describe('OrderPendingComponent', () => {
  let component: OrderPendingComponent;
  let fixture: ComponentFixture<OrderPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPendingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
