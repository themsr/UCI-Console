import {PipesModule} from '../pipes/pipes.module';
import {UciService} from '../services/uci.service';
import {ConfigService} from '../services/config.service';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidePanelComponent} from './side-panel/side-panel.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from 'ngx-chips';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ConversationListComponent} from './conversation-list/conversation-list.component';
import {ConversationAddComponent} from './conversation-add/conversation-add.component';
import {UserSegmentListComponent} from './user-segment-list/user-segment-list.component';
import {CommonFormElementsModule} from 'common-form-elements-v9';
import {UserSegmentAddComponent} from './user-segment-add/user-segment-add.component';
import {SuiModule} from 'ng2-semantic-ui-v9';
import {ConversationSuccessComponent} from './conversation-success/conversation-success.component';
import {UciGraphQlService} from '../services/uci-graph-ql.service';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';

@NgModule({
    declarations: [
        SidePanelComponent,
        ConversationListComponent,
        ConversationAddComponent,
        UserSegmentListComponent,
        UserSegmentAddComponent,
        TermsConditionsComponent,
        ConversationSuccessComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        PipesModule,
        InfiniteScrollModule,
        CommonFormElementsModule,
        SuiModule,
    ],
    exports: [
        SidePanelComponent,
    ],
    providers: [
        UciService,
        ConfigService,
        UciGraphQlService
    ]
})
export class ComponentsModule {
}
