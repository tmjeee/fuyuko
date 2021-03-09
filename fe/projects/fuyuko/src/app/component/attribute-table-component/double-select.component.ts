import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Pair1, Pair2} from '@fuyuko-common/model/attribute.model';

export const uniqueP1KeyValidator = (currentPair: Pair1, pairs: Pair1[], formGroup: FormGroup) =>
  (c: AbstractControl): ValidationErrors => {
  const count: number = pairs.filter((p: Pair1) => {
    const v =  (currentPair.id !== p.id && formGroup.get(`p1-k-${p.id}`) &&  formGroup.get(`p1-k-${p.id}`).value === c.value);
    return v;
  }).length;
  if (count > 0) {
    return { uniqueP1Key: true };
  }
  return null;
};


export const uniqueP2Key1Validator = (formGroup: FormGroup) => (c: AbstractControl): ValidationErrors => {
  let valid = false;
  Object.keys(formGroup.controls)
    .filter((k: string) => {
      return k.startsWith('p1-k-');
    })
    .forEach((k: string) => {
      if (formGroup.controls[k].value === c.value) {
        valid = true;
      }
    });
  if (!valid) {
    return { uniqueP2Key1: true};
  }
  return null;
};

export const uniqueP2Key2Validator = (currentPair: Pair2, pairs: Pair2[], formGroup: FormGroup) =>
  (c: AbstractControl): ValidationErrors => {
  const count: number = pairs.filter((p: Pair2) => {
    const v =  (currentPair.id !== p.id && formGroup.get(`p2-k2-${p.id}`) && formGroup.get(`p2-k2-${p.id}`).value === c.value);
    return v;
  }).length;
  if (count > 0) {
    return { uniqueP2Key2: true };
  }
  return null;
};


@Component({
  selector: 'app-double-select',
  templateUrl: './double-select.component.html',
  styleUrls: ['./double-select.component.scss']
})
export class DoubleSelectComponent implements OnInit {

  counter = -1;

  @Input() rootFormGroup: FormGroup;
  @Input() pairs1: Pair1[];
  @Input() pairs2: Pair2[];

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.pairs1 = this.pairs1 ? [...this.pairs1] : [];
    this.pairs2 = this.pairs2 ? [...this.pairs2] : [];
    this.formGroup = this.formBuilder.group({});
    this.rootFormGroup.setControl('misc', this.formGroup);

    if (this.pairs1) {
      this.pairs1.forEach((p: Pair1) => {
        this.formGroup.setControl(`p1-k-${p.id}`, this.formBuilder.control(p.key));
        this.formGroup.setControl(`p1-v-${p.id}`, this.formBuilder.control(p.value));
      });
      setTimeout(() => {
        this.pairs1.forEach((p: Pair1) => {
          this.formGroup.controls[`p1-k-${p.id}`].setValidators([
            Validators.required,
            uniqueP1KeyValidator(p, this.pairs1, this.formGroup)
          ]);
          this.formGroup.controls[`p1-v-${p.id}`].setValidators([Validators.required]);
        });
      });
    }

    if (this.pairs2) {
      this.pairs2.forEach((p: Pair2) => {
        this.formGroup.setControl(`p2-k1-${p.id}`, this.formBuilder.control(p.key1));
        this.formGroup.setControl(`p2-k2-${p.id}`, this.formBuilder.control(p.key2));
        this.formGroup.setControl(`p2-v-${p.id}`, this.formBuilder.control(p.value));
      });
      setTimeout(() => {
        this.pairs2.forEach((p: Pair2) => {
          this.formGroup.controls[`p2-k1-${p.id}`].setValidators([
            Validators.required,
            uniqueP2Key1Validator(this.formGroup)
          ]);
          this.formGroup.controls[`p2-k2-${p.id}`].setValidators([
            Validators.required,
            uniqueP2Key2Validator(p, this.pairs2, this.formGroup)
          ]);
          this.formGroup.controls[`p2-v-${p.id}`].setValidators([Validators.required]);
        });
      });
    } else {
      this.pairs2 = [];
    }
  }


  onAddPair1Clicked($event: MouseEvent) {
    const c = this.counter--;
    const p = {id: c, key: '', value: ''} as Pair1;
    this.pairs1.push(p);
    this.formGroup.setControl(`p1-k-${p.id}`, this.formBuilder.control(p.key));
    this.formGroup.setControl(`p1-v-${p.id}`, this.formBuilder.control(p.value));
    setTimeout(() => {
      this.formGroup.controls[`p1-k-${p.id}`].setValidators([
        Validators.required,
        uniqueP1KeyValidator(p, this.pairs1, this.formGroup)
      ]);
      this.formGroup.controls[`p1-v-${p.id}`].setValidators([Validators.required]);
    });
  }

  onAddPair2Clicked($event: MouseEvent) {
    const c = this.counter--;
    const p = {id: c, key1: '', key2: '', value: ''} as Pair2;
    this.pairs2.push(p);
    this.formGroup.setControl(`p2-k1-${p.id}`, this.formBuilder.control(p.key1));
    this.formGroup.setControl(`p2-k2-${p.id}`, this.formBuilder.control(p.key2));
    this.formGroup.setControl(`p2-v-${p.id}`, this.formBuilder.control(p.value));
    setTimeout(() => {
      this.formGroup.controls[`p2-k1-${p.id}`].setValidators([
        Validators.required,
        uniqueP2Key1Validator(this.formGroup)
      ]);
      this.formGroup.controls[`p2-k2-${p.id}`].setValidators([
        Validators.required,
        uniqueP2Key2Validator(p, this.pairs2, this.formGroup)
      ]);
      this.formGroup.controls[`p2-v-${p.id}`].setValidators([Validators.required]);
    });
  }

  onDeletePair1Clicked($event: MouseEvent, pair1: Pair1) {
    this.formGroup.controls[`p1-k-${pair1.id}`].clearValidators();
    this.formGroup.controls[`p1-v-${pair1.id}`].clearValidators();
    this.formGroup.removeControl(`p1-k-${pair1.id}`);
    this.formGroup.removeControl(`p1-v-${pair1.id}`);
    this.pairs1 = this.pairs1.filter((p: Pair1) => p.id !== pair1.id);
  }

  onDeletePair2Clicked($event: MouseEvent, pair2: Pair2) {
    this.formGroup.controls[`p2-k1-${pair2.id}`].clearValidators();
    this.formGroup.controls[`p2-k2-${pair2.id}`].clearValidators();
    this.formGroup.controls[`p2-v-${pair2.id}`].clearValidators();
    this.formGroup.removeControl(`p2-k1-${pair2.id}`);
    this.formGroup.removeControl(`p2-k2-${pair2.id}`);
    this.formGroup.removeControl(`p2-v-${pair2.id}`);
    this.pairs2 = this.pairs2.filter((p: Pair2) => p.id !== pair2.id);
  }
  
  formControl(k: string): FormControl {
    return this.formGroup.get(k) as FormControl;
  }
}
