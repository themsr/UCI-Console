import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UciService} from '../../services/uci.service';
import {UciGraphQlService} from '../../services/uci-graph-ql.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'lib-user-segment-add',
    templateUrl: './user-segment-add.component.html',
    styleUrls: ['./user-segment-add.component.css']
})
export class UserSegmentAddComponent implements OnInit {
    @Output() cancel = new EventEmitter<boolean>();
    @Output() add = new EventEmitter<any>();
    formFieldProperties: Array<any>;
    userSegment: any = {};
    isLoaderShow = false;
    districts = [];
    blocks = [];
    schools = [];
    clusters = [];
    roles = [];
    boards = [];
    grade = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
    subjects = [];
    userSegmentForm: FormGroup;

    constructor(private uciService: UciService,
                private fb: FormBuilder,
                private uciGraphQlService: UciGraphQlService) {
    }

    ngOnInit() {
        this.getUciDistrict();
        this.getUciRole();
        this.getUciBoard();
        // this.getForm();
        this.userSegmentForm = this.fb.group({
            name: [''],
            description: [''],
            district: [''],
            block: [''],
            cluster: [''],
            school: [''],
            role: [''],
            board: [''],
            grade: [''],
            subject: ['']
        });

        this.userSegmentForm.get('district').valueChanges.subscribe(item => {
            if (item) {
                this.userSegmentForm.get('block').patchValue('');
                this.blocks = [];
                this.userSegmentForm.get('cluster').patchValue('');
                this.userSegmentForm.get('school').patchValue('');
                this.schools = [];
                this.clusters = [];
                this.getUciBlock();
            }
        });
        this.userSegmentForm.get('block').valueChanges.subscribe(item => {
            if (item) {
                this.userSegmentForm.get('cluster').patchValue('');
                this.userSegmentForm.get('school').patchValue('');
                this.schools = [];
                this.clusters = [];
                this.getUciCluster();
                this.getUciSchoolDetails();
            }
        });
    }

    getForm() {
        console.log('------> getting form');
        this.uciService.readForm(
            {
                request: {
                    type: 'userSegment',
                    subType: 'global',
                    action: 'menubar',
                    framework: 'ekstep_ncert_k-12',
                    rootOrgId: '*'
                }
            }
        ).subscribe(
            (data: any) => {
                if (data.result && data.result.form && data.result.form.data) {
                    this.formFieldProperties = data.result.form.data.fields;
                    console.log('xxxxxxxxxxxxxxx', this.formFieldProperties);
                }
            }
        );
    }

    onStatusChanges(event) {
        console.log('event', event);
    }

    // valueChanges(event) {
    //     console.log('event value', event);
    //     const keys = ['district', 'block'];
    //     for (const value of keys) {
    //         console.log(value);
    //         if (value === 'district') {
    //             if (this.userSegment.district !== event.district && event.district) {
    //                 // this.getUciBlock();
    //             }
    //         }
    //     }
    //     this.userSegment = Object.assign(this.userSegment, event);
    // }

    onCancel() {
        this.cancel.emit(false);
    }

    onAdd() {
        this.isLoaderShow = true;
        const formValue = this.userSegmentForm.value;
        const temRole = [];
        const temBoard = [];
        const temGrade = [];
        temRole.push(String(formValue.role));
        temBoard.push(String(formValue.board));
        temGrade.push(formValue.grade);
        const param = {
            data: {
                userLocation: [
                    {
                        state: 'Haryana',
                        district: formValue.district,
                        block: formValue.block
                    }
                ],
                roles: temRole,
                userType: {
                    type: 'student'
                },
                framework: {
                    board: temBoard,
                    gradeLevel: temGrade
                }
            }
        };
        // console.log('--->>>add segment', param);
        this.uciService.userSegmentQueryBuilder(param).subscribe(response => {
            // console.log('-->>>response', response);
            if (response) {
                const items = {
                    ...response,
                    name: formValue.name,
                    description: formValue.description
                };
                this.uciService.createUserSegment({data: items}).subscribe(
                    (data: any) => {
                        this.isLoaderShow = false;
                        this.afterAdd(data.data);
                    }, err => {
                        this.isLoaderShow = false;
                    }
                );
            }
        }, error => {
            this.isLoaderShow = false;
        });
    }

    afterAdd(data) {
        this.add.emit(data);
    }

    getUciState() {
        this.uciGraphQlService.getState().subscribe(res => {
            console.log('--->>uci state', res);
        });
    }

    getUciDistrict() {
        const params = {
            state: 'Haryana'
        };
        this.uciGraphQlService.getDistrict(params).subscribe((res: any) => {
            if (res && res.data && res.data.organisation && res.data.organisation.length) {
                this.districts = [];
                this.districts = res.data.organisation;
            }
        });
    }

    getUciBlock() {
        const formVal = this.userSegmentForm.value;
        const params = {
            state: 'Haryana', district: formVal.district
        };
        this.uciGraphQlService.getBlock(params).subscribe((res: any) => {
            if (res && res.data && res.data.organisation && res.data.organisation.length) {
                this.blocks = [];
                this.blocks = res.data.organisation;
            }
        });
    }

    getUciCluster() {
        const formVal = this.userSegmentForm.value;
        const params = {
            state: 'Haryana', district: formVal.district, block: formVal.block
        };
        this.uciGraphQlService.getClusters(params).subscribe((res: any) => {
            if (res && res.data && res.data.organisation && res.data.organisation.length) {
                if (res.data.organisation[0].cluster) {
                    this.clusters = res.data.organisation;
                }
            }
        });
    }

    getUciSchoolDetails() {
        const formVal = this.userSegmentForm.value;
        const params = {
            state: 'Haryana', district: formVal.district, block: formVal.block
        };
        this.uciGraphQlService.getSchoolDetails(params).subscribe((res: any) => {
            if (res && res.data && res.data.organisation && res.data.organisation.length) {
                this.schools = res.data.organisation;
            }
        });
    }

    getUciRole() {
        this.uciGraphQlService.getRole().subscribe((res: any) => {
            if (res && res.data && res.data.role && res.data.role.length) {
                this.roles = res.data.role;
            }
        });
    }

    getUciBoard() {
        this.uciGraphQlService.getBoards().subscribe((res: any) => {
            if (res && res.data && res.data.board && res.data.board.length) {
                this.boards = res.data.board;
            }
        });
    }
}
