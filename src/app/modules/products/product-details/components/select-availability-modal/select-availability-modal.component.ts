import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBranch } from '../../../../../interfaces/branch.interface';
import { CustomControlComponent } from '../../../../../shared/components/custom-control/custom-control.component';
import { ModalBaseComponent } from '../../../../../shared/components/modal-base/modal-base.component';
import { DeliveryTypeEnum } from '../../../../../shared/enums/delivery-type.enum';
import { BranchRepo } from '../../../../../shared/repositories/branch.repository';
import { CustomRadioItemComponent } from '../../../../../shared/components/custom-radio-item/custom-radio-item.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-select-availability-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomRadioItemComponent,
    CustomControlComponent,
  ],
  templateUrl: './select-availability-modal.component.html',
  styleUrl: './select-availability-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAvailabilityModalComponent implements OnInit {

  @Input() selectedBranch: IBranch | null = null;

  branches: IBranch[] = [
    {
      id: 1,
      nombre: 'Garza Sada',
      direccion: 'Eugenio Garza Sada 4400, Monterrey, Mexico 8112318748',
      rfc: '',
      envios_soportados: DeliveryTypeEnum .ALL,
    },
    {
      id: 2,
      nombre: 'Valle',
      direccion: 'Río Amazonas 401 Col. Del Valle, San Pedro Garza Garcí...',
      rfc: '',
      envios_soportados: DeliveryTypeEnum .ALL,
    },
  ];
  filteredBranches: IBranch[] = [...this.branches];

  form: FormGroup = this._formBuilder.group({
    branch: [null, Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _branchRepo: BranchRepo,
    private _modalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    if(this.selectedBranch) {
      this.form.patchValue({
        branch: this.selectedBranch.id
      });
    }
  }

  searchBranches(searchTerm: string) {
    if(this.form.value['branch']) {
      this.form.reset();
    }
    this.filteredBranches = this.branches.filter(branch => {
      return branch.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    });
  }

  confirmSelectedBranch() {
    const SELECTED_BRANCH: IBranch | undefined = this.branches.find(branch => branch.id == this.form.value['branch']);
    if (SELECTED_BRANCH) {
      this._branchRepo.setBranch(SELECTED_BRANCH);
      this._modalRef.hide();
    }
  }
}
