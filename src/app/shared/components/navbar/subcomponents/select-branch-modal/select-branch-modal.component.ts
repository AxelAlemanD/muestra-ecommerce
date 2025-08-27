import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ModalBaseComponent } from '../../../modal-base/modal-base.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBranch } from '../../../../../interfaces/branch.interface';
import { DeliveryTypeEnum  } from '../../../../enums/delivery-type.enum';
import { BranchRepo } from '../../../../repositories/branch.repository';
import { CustomControlComponent } from '../../../custom-control/custom-control.component';
import { CustomRadioItemComponent } from '../../../custom-radio-item/custom-radio-item.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-select-branch-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomRadioItemComponent,
    CustomControlComponent,
  ],
  templateUrl: './select-branch-modal.component.html',
  styleUrl: './select-branch-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBranchModalComponent implements OnInit {

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
