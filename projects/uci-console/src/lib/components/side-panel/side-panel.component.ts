import {NSDiscussData} from '../../models/discuss.model';
import {TelemetryUtilsService} from '../../telemetry-utils.service';
import {UciService} from '../../services/uci.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import * as CONSTANTS from '../../common/constants.json';
/* tslint:disable */
import * as _ from 'lodash';
import {ConfigService} from '../../services/config.service';
import {IdiscussionConfig, IMenuOptions} from '../../models/discussion-config.model';

/* tslint:enable */

@Component({
    selector: 'lib-side-panel',
    templateUrl: './side-panel.component.html',
    styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, OnDestroy {

    paramsSubscription: Subscription;

    userName: string;

    defaultPage = 'categories';

    data: IdiscussionConfig;
    hideSidePanel: boolean;
    menu: Array<IMenuOptions> = [];
    selectedTab: string;
    showSideMenu: Boolean = true;

    constructor(
        public router: Router,
        public uciService: UciService,
        public activatedRoute: ActivatedRoute,
        private telemetryUtils: TelemetryUtilsService,
        private configService: ConfigService
    ) {
    }

    ngOnInit() {
        // TODO: loader or spinner
        this.telemetryUtils.setContext([]);
        this.hideSidePanel = document.body.classList.contains('widget');
        this.telemetryUtils.logImpression(NSDiscussData.IPageName.HOME);
        this.data = this.configService.getConfig();
        const menuArr = _.get(this.data, 'menuOptions') && _.get(this.data, 'menuOptions').length > 0 ? this.data.menuOptions : CONSTANTS.MENUOPTIONS;
        console.log('====', menuArr);
        for (let i = 0; i < menuArr.length; i++) {
            if (menuArr[i].enable) {
                this.menu.push(menuArr[i]);
            }
        }

    }

    isActive(selectedItem) {
        if (this.router.url.indexOf(`/${selectedItem}`) > -1 || this.selectedTab === selectedItem) {
            if (!this.selectedTab) {
                this.selectedTab = selectedItem;
            }
            return true;
        } else if (selectedItem === 'categories' && !this.selectedTab) {
            return true;
        }
        return false;
    }

    navigate(pageName: string, event?) {
        this.selectedTab = pageName;
        this.telemetryUtils.setContext([]);
        if (event) {
            this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.HOME);
        }
        this.router.navigate([`uci`], {queryParamsHandling: 'merge'});
        this.closeNav();
    }

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
    }

    showMenuButton() {
        this.showSideMenu = this.showSideMenu ? false : true;
    }

    closeNav() {
        this.showSideMenu = this.showSideMenu ? false : true;
    }

}
