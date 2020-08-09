import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Pair1} from '../../model/attribute.model';

export const uniqueKeyValidator = (currentPair: Pair1, pairs: Pair1[], formGroup: FormGroup, changeDetectorRef: ChangeDetectorRef) => (c: AbstractControl): ValidationErrors => {
    const count: number = pairs.filter((p: Pair1) => {
      const v =  (currentPair.id !== p.id && formGroup.get(`k-${p.id}`) && formGroup.get(`k-${p.id}`).value === c.value);
      return v;
    }).length;
    if (count > 0) {
      return { uniqueKey: true };
    }
  return null;
};


@Component({
  selector: 'app-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss'],
})
export class SingleSelectComponent implements OnInit {

  counter = -2;

  @Input() rootFormGroup: FormGroup;
  @Input() pairs: Pair1[] = [];

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef) {
  }
  
  formControl(k: string): FormControl {
    return this.formGroup.get(k) as FormControl;
  }

  ngOnInit(): void {
    this.pairs = this.pairs ? [...this.pairs] : [];
    this.formGroup = this.formBuilder.group({});
    this.rootFormGroup.setControl('misc', this.formGroup);
    if (this.pairs) {
      this.pairs.forEach((p: Pair1) => {
        this.formGroup.setControl(`k-${p.id}`, this.formBuilder.control(p.key));
        this.formGroup.setControl(`v-${p.id}`, this.formBuilder.control(p.value));
      });
      setTimeout(() => {
        this.pairs.forEach((p: Pair1) => {
          this.formGroup.controls[`k-${p.id}`].setValidators(
              [Validators.required, uniqueKeyValidator(p, this.pairs, this.formGroup, this.changeDetectorRef)]);
          this.formGroup.controls[`v-${p.id}`].setValidators([Validators.required]);
        });
      });
    }
  }

  onAddPairClicked($event: MouseEvent) {
    const c = this.counter--;
    const p = {id: c, key: '', value: ''};
    this.formGroup.setControl(`k-${p.id}`, this.formBuilder.control(p.key));
    this.formGroup.setControl(`v-${p.id}`, this.formBuilder.control(p.value));
    this.pairs.push({id: c, key: '', value: ''} as Pair1);
    setTimeout(() => {
      this.formGroup.controls[`k-${p.id}`].setValidators(
          [Validators.required, uniqueKeyValidator(p, this.pairs, this.formGroup, this.changeDetectorRef)]);
      this.formGroup.controls[`v-${p.id}`].setValidators([Validators.required]);
    });
  }

  getModifiedPair1() {
    const newPairs: Pair1[] = this.pairs.map((p: Pair1) => {
      const newPair = {...p};
      newPair.key = this.formGroup.get(`k-${p.id}`).value;
      newPair.value = this.formGroup.get(`v-${p.id}`).value;
      return newPair;
    });
    return newPairs;
  }

  onDeleteClicked($event: MouseEvent, pair: Pair1) {
    this.formGroup.controls[`k-${pair.id}`].clearValidators();
    this.formGroup.controls[`v-${pair.id}`].clearValidators();
    this.formGroup.removeControl(`k-${pair.id}`);
    this.formGroup.removeControl(`v-${pair.id}`);
    this.pairs = this.pairs.filter((p: Pair1) => p.id !== pair.id);
  }
}
