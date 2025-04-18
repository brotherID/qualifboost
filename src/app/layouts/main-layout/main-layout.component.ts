import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatFormField} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-main-layout',
    imports: [
        MatFormField,
        MatIcon,
        MatIconButton,
        MatListItem,
        MatNavList,
        MatOption,
        MatSelect,
        MatSelectTrigger,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        MatToolbar,
        MatTooltip,
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {

}
