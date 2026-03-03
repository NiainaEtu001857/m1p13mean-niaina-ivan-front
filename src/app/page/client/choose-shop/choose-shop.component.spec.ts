import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseShopComponent } from './choose-shop.component';

describe('ChooseShopComponent', () => {
  let component: ChooseShopComponent;
  let fixture: ComponentFixture<ChooseShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseShopComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
